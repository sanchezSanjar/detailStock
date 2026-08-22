import { T } from "../libs/types/common";
import Errors from "../libs/Errors";
import { Request, Response } from "express";
import MemberService from "../models/Member.service";
import ProductService from "../models/Product.service";
import { AdminRequest } from "../libs/types/member";

const productService = new ProductService();

const productController: T = {};

productController.getAllproducts = async (req: AdminRequest, res: Response) => {
    try {
        console.log("getAllProducts");
        console.log("req.member", req.member);
        res.render("products");
    } catch (err) {
        console.log("Error, getAllProducts:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)};
    };

productController.createNewProduct = async (req: Request, res: Response) => {
    try {
        console.log("creatNewProduct");
        res.send("DONE");
        
    } catch (err) {
        console.log("Error, creatNewProduct:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)};
    };
 
productController.updateChosenProduct = async (req: Request, res: Response) => {
    try {
        console.log("getAllProducts");
        
    } catch (err) {
        console.log("Error, updateChosenProduct:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)};
    };


export default productController;