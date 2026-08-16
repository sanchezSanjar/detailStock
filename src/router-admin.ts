import express from "express";
const routerAdmin = express.Router();
import shopController from "./controllers/shop.controller";

// SHOP
routerAdmin.get("/", shopController.goHome);

routerAdmin
    .get("/login", shopController.getLogin)
    .post("/login", shopController.processLogin);

routerAdmin
    .get("/signup", shopController.getSignup)
    .post("/signup", shopController.processSignup);


// PRODUCT



// USER

export default routerAdmin;