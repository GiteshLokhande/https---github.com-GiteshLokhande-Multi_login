import express from "express";
import {
  getProducts,
  getProductsId,
  createProduct,
  updateProducts,
  deleteProducts,
} from "../controller/Product.js";

import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/products", verifyUser, getProducts);
router.get("/products/:id", verifyUser, getProductsId);
router.post("/products", verifyUser, createProduct);
router.patch("/products/:id", verifyUser, updateProducts);
router.delete("/products/:id", verifyUser, deleteProducts);

export default router;
