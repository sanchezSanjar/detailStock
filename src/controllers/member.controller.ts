import { T } from "../libs/types/common";
import { Request, Response } from "express";


const memberController: T = {};
memberController.goHome = (req: Request, res: Response) => {
    try {
        res.send("Home Page");
    } catch (err) {
        console.log("Error, goHome:", err);
    }
};

memberController.login = (req: Request, res: Response) => {
    try {
        res.send("Login Page");
    } catch (err) {
        console.log("Error, getLogin:", err);
    }
};

memberController.signup = (req: Request, res: Response) => {
    try {
        res.send("Signup Page");
    } catch (err) {
        console.log("Error, getSignup:", err);
    }
};

export default memberController;