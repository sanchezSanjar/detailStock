import express from "express";
const routerAdmin = express.Router();
import shopController from "./controllers/shop.controller";
import productController from "./controllers/product.controller";
import makeUploader from "./libs/utils/uploader";


// SHOP
routerAdmin.get("/", shopController.goHome);
routerAdmin
    .get("/login", shopController.getLogin)
    .post("/login", shopController.processLogin);
routerAdmin
    .get("/signup", shopController.getSignup)
    .post("/signup",   makeUploader("members").single("memberImage"),
     shopController.processSignup);
routerAdmin.get("/logout", shopController.logout);
routerAdmin.get("/check-me", shopController.checkAuthSession);

// PRODUCT
routerAdmin.get(
    "/product/all",
    shopController.verifyShop, 
    productController.getAllproducts);

routerAdmin.post(
    "/product/create",
    shopController.verifyShop,
    makeUploader("products").array("productImages", 5),
    productController.createNewProduct);


routerAdmin.post(
    "/product/:id", 
    shopController.verifyShop, 
    productController.updateChosenProduct);

// USER
routerAdmin.get("/user/all", 
    shopController.verifyShop, 
    shopController.getUsers)
routerAdmin.post("/user/edit", 
    shopController.verifyShop, 
    shopController.updateChosenUser);


export default routerAdmin;