import express from "express";
const routerAdmin = express.Router();
import shopController from "./controllers/shop.controller";
import productController from "./controllers/product.controller";
import articleController from "./controllers/article.controller";
import makeUploader from "./libs/utils/uploader";


// SHOP
routerAdmin.get("/", shopController.goHome);
routerAdmin
    .get("/login", shopController.getLogin)
    .post("/login", shopController.processLogin);
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

routerAdmin.delete(
    "/user/:id",
    shopController.verifyShop,
    shopController.deleteUser);

// ARTICLE (FAQ, NOTICES & EVENTS)
routerAdmin.get("/faq/all", shopController.verifyShop, articleController.getAdminFaq);
routerAdmin.get("/notice/all", shopController.verifyShop, articleController.getAdminNotices);
routerAdmin.get("/event/all", shopController.verifyShop, articleController.getAdminEvents);
routerAdmin.post(
    "/article/create",
    shopController.verifyShop,
    makeUploader("articles").single("articleImage"),
    articleController.createArticle);
routerAdmin.post(
    "/article/:id",
    shopController.verifyShop,
    makeUploader("articles").single("articleImage"),
    articleController.updateArticle);
routerAdmin.delete("/article/:id", shopController.verifyShop, articleController.deleteArticle);



export default routerAdmin;