import { Router } from "express";
import {CreateAdmin, AdminLogin} from '../controllers/admin.controller.js';

const adminRouter = Router();

adminRouter.post('/CreateAdmin' , CreateAdmin);
adminRouter.post('/AdminLogin' ,AdminLogin);

export default adminRouter;