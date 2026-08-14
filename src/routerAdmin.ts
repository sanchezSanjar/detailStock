import express from "express";
const routerAdmin = express.Router();
import shopController from "./controllers/shop.controller";

routerAdmin.get("/", shopController.goHome);

routerAdmin.get("/login", shopController.login);

routerAdmin.get("/signup", shopController.signup);

export default routerAdmin;