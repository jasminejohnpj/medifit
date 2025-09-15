
// eslint-disable-next-line no-unused-vars
import { where } from 'sequelize';
import Product from '../model/product.js';
import {uploadToCloudinary ,deleteFromCloudinary} from '../config/cloudinary.js';



export const product = async (req, res, next) => {
  try {

    const { Health_Product_Name, Product_Price, Product_Description } = req.body;
    if (!Health_Product_Name) {
      return res.status(400).json({ message: "Health Product Name is required" });
    }

    const existingProduct = await Product.findOne({ where: { Health_Product_Name } });

    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists" });
    }
     const localFilePath = req.file?.path;
        if (!localFilePath) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const uploadedimage = await uploadToCloudinary(localFilePath, "Medifit_Products");
        if (!uploadedimage) {
            return res.status(500).json({ error: 'Image Upload failed' });
        }
    const newProduct = await Product.create({
      Health_Product_Name,
      Product_Price,
      Product_Description,
      Health_Product_Image : uploadedimage.url,
      productImagePublicId :uploadedimage.public_id
    });

    return res.status(200).json({ message: "Product added successfully", newProduct });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

// export const product = async (req, res, next) => {
//   try {

//     const { Health_Product_Name, Product_Price, Product_Description, Health_Product_Image } = req.body;
//     if (!Health_Product_Name) {
//       return res.status(400).json({ message: "Health Product Name is required" });
//     }

//     const existingProduct = await Product.findOne({ where: { Health_Product_Name } });

//     if (existingProduct) {
//       return res.status(400).json({ message: "Product already exists" });
//     }

//     const newProduct = await Product.create({
//       Health_Product_Name,
//       Product_Price,
//       Product_Description,
//       Health_Product_Image,
//     });

//     return res.status(200).json({ message: "Product added successfully", newProduct });
//   } catch (error) {
//     console.log(error.message);
//     next(error);
//   }
// };


// export const productList = async (req, res, next) => {
//   try {
//     const products = await Product.findAll();

//     if (!products || products.length === 0) {
//       return res.status(404).json({ message: "Products not found" });
//     }

//     return res.status(200).json({ message: "Products retrieved", products });
//   } catch (error) {
//     next(error);
//   }
// };

export const productList = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;     
    const limit = parseInt(req.query.limit) || 10;   
    const offset = (page - 1) * limit;               

    const { rows: products, count: totalItems } = await Product.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]], 
    });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "Products not found" });
    }

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      message: "Products retrieved",
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
      products,
    });
  } catch (error) {
    next(error);
  }
};


export const productDetails = async (req, res, next) => {
  try {
    const { PId } = req.query;
    if (!PId) {
      return res.status(400).json({ message: "Id is required" });
    }

    const product = await Product.findOne({ where: { PId } });

    if (!product) {
      return res.status(404).json({ message: "Product details not found" });
    }

    return res.status(200).json({ message: "Product details found", product });
  } catch (error) {
    next(error);
  }
};


export const productUpdate = async (req, res, next) => {
  try {
    const { PId } = req.query;
    const { Health_Product_Name, Product_Price, Product_Description } = req.body;
    const localFilePath = req.file?.path;

    if (!PId) {
      return res.status(400).json({ message: "Id is required" });
    }

    const product = await Product.findOne({ where: { PId } });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let updatedData = {};

    if (localFilePath) {
      if (product.productImagePublicId) {
        try {
          await deleteFromCloudinary(product.productImagePublicId);
        } catch (err) {
          console.warn("Old image deletion failed:", err.message);
        }
      }

      const uploadedImage = await uploadToCloudinary(localFilePath, "Medifit_Products");

      if (!uploadedImage?.secure_url) {
        return res.status(500).json({ error: "Image upload failed" });
      }

      updatedData.Health_Product_Image = uploadedImage.secure_url;
      updatedData.productImagePublicId = uploadedImage.public_id;
    }

    if (Health_Product_Name !== undefined) updatedData.Health_Product_Name = Health_Product_Name;
    if (Product_Price !== undefined) updatedData.Product_Price = Product_Price;
    if (Product_Description !== undefined) updatedData.Product_Description = Product_Description;

    await product.update(updatedData);
    await product.reload();

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Product Update Error:", error.message);
    next(error);
  }
};


export const removeProduct = async (req, res, next) => {
  try {
    const { PId } = req.query;
    if (!PId) {
      return res.status(400).json({ message: "Id is required" });
    }

    const product = await Product.findOne({ where: { PId } });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete image from Cloudinary
    if (product.productImagePublicId) {
      await deleteFromCloudinary(product.productImagePublicId);
    }

    await Product.destroy({ where: { PId } });

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

