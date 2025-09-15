import Medicine from "../model/medicine.js";
import { uploadToCloudinary ,deleteFromCloudinary } from "../config/cloudinary.js";


export const medicine = async (req, res, next) => {
  try {

    const { Medicine_Name, Medicine_Price, Medicine_Description } = req.body;

    if (!Medicine_Name) {
      return res.status(400).json({ message: "Medicine Name is required" });
    }

    const existingMedicine = await Medicine.findOne({ where: { Medicine_Name } });

    if (existingMedicine) {
      return res.status(400).json({ message: "Medicine already exists" });
    }
     const localFilePath = req.file?.path;
        if (!localFilePath) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
       const uploadedimage = await uploadToCloudinary(localFilePath, "Medifit_Medicines");
        if (!uploadedimage) {
            return res.status(500).json({ error: 'Image Upload failed' });
        }
    const newProduct = await Medicine.create({
      Medicine_Name,
      Medicine_Price,
      Medicine_Description,
      Medicine_Image : uploadedimage.url,
      MedicineImagePublicId :uploadedimage.public_id
    });

    return res.status(200).json({ message: "Medicine added successfully", newProduct });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};


export const medicineList = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;     
    const limit = parseInt(req.query.limit) || 10;   
    const offset = (page - 1) * limit;               

    const { rows: medicine, count: totalItems } = await Medicine.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]], 
    });

    if (!medicine || medicine.length === 0) {
      return res.status(404).json({ message: "medicine not found" });
    }

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      message: "medicine retrieved",
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
      medicine,
    });
  } catch (error) {
    next(error);
  }
};


export const medicineDetails = async (req, res, next) => {
  try {
    const { MId } = req.query;
    if (!MId) {
      return res.status(400).json({ message: "Id is required" });
    }

    const medicine = await Medicine.findOne({ where: { MId } });

    if (!medicine) {
      return res.status(404).json({ message: "Medicine details not found" });
    }

    return res.status(200).json({ message: "Medicine details found", medicine });
  } catch (error) {
    next(error);
  }
};


export const medicineUpdate = async (req, res, next) => {
  try {
    const { MId } = req.query;
    const { Medicine_Name, Medicine_Price, Medicine_Description } = req.body;
    const localFilePath = req.file?.path;

    if (!MId) {
      return res.status(400).json({ message: "Id is required" });
    }

    const medicine = await Medicine.findOne({ where: { MId } });
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    let updatedData = {};

    if (localFilePath) {
      if (medicine.MedicineImagePublicId) {
        try {
          const deleted = await deleteFromCloudinary(medicine.MedicineImagePublicId);
          console.log("Old image deleted:", deleted);
        } catch (err) {
          console.warn("Old image deletion failed:", err.message);
        }
      }

      const uploadedImage = await uploadToCloudinary(localFilePath, {
        folder: "Medifit_Medicines",
        public_id: medicine.MedicineImagePublicId || `medicine_${MId}`, // reuse or create new
        overwrite: true,
        invalidate: true,
      });

      if (!uploadedImage?.secure_url) {
        return res.status(500).json({ error: "Image upload failed" });
      }

      
      updatedData.Medicine_Image = uploadedImage.secure_url;
      updatedData.MedicineImagePublicId = uploadedImage.public_id;
    }

    if (Medicine_Name !== undefined) updatedData.Medicine_Name = Medicine_Name;
    if (Medicine_Price !== undefined) updatedData.Medicine_Price = Medicine_Price;
    if (Medicine_Description !== undefined) updatedData.Medicine_Description = Medicine_Description;

    await medicine.update(updatedData);
    await medicine.reload();

    return res.status(200).json({
      message: "Medicine updated successfully",
      medicine,
    });
  } catch (error) {
    console.error("Medicine Update Error:", error.message);
    next(error);
  }
};


export const removeMedicine = async (req, res, next) => {
  try {
    const { MId } = req.query;
    if (!MId) {
      return res.status(400).json({ message: "Id is required" });
    }

    const medicine = await Medicine.findOne({ where: { MId } });
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    // Delete image from Cloudinary
    if (medicine.MedicineImagePublicId) {
      await deleteFromCloudinary(medicine.MedicineImagePublicId);
    }

    await Medicine.destroy({ where: { MId } });

    return res.status(200).json({ message: "Medicine deleted successfully" });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};
