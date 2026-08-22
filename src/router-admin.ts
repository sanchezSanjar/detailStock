import express from "express";
const routerAdmin = express.Router();
import shopController from "./controllers/shop.controller";
import productController from "./controllers/product.controller";


// SHOP
routerAdmin.get("/", shopController.goHome);
routerAdmin
    .get("/login", shopController.getLogin)
    .post("/login", shopController.processLogin);
routerAdmin
    .get("/signup", shopController.getSignup)
    .post("/signup", shopController.processSignup);
routerAdmin.get("/logout", shopController.logout);
routerAdmin.get("/check-me", shopController.checkAuthSession);

// PRODUCT
routerAdmin.get(
    "/product/all",
    shopController.verifyRestaurant, 
    productController.getAllproducts);

routerAdmin.post(
    "/product/create",
    shopController.verifyRestaurant, 
    productController.createNewProduct);


routerAdmin.post(
    "/product/:id", 
    shopController.verifyRestaurant, 
    productController.updateChosenProduct);

// USER

export default routerAdmin;