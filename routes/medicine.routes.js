import { Router } from "express";
import { medicine , medicineList , medicineDetails ,medicineUpdate , removeMedicine} from '../controllers/medicine.controller.js';
import { upload } from "../middleware/multer.js";


const medicineRouter = Router();

medicineRouter.post('/newMedicine' ,upload.single("image"),medicine );
medicineRouter.get('/medicines' , medicineList)
medicineRouter.get('/medicine' , medicineDetails)
medicineRouter.put('/updateMedicine' ,upload.single("image"), medicineUpdate)
medicineRouter.delete('/deleteMedicine' , removeMedicine)

export default medicineRouter;