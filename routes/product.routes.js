import { Router } from "express";
import { upload } from "../middleware/multer.js";
import { product, productList ,productDetails ,productUpdate ,removeProduct } from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post("/Newproduct",upload.single("image"), product);
productRouter.get("/Products", productList);
productRouter.get("/product", productDetails);
productRouter.put('/updateProduct',upload.single("image"), productUpdate);
productRouter.delete('/deleteProduct', removeProduct)

export default productRouter;
