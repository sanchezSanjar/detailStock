import { T } from "../libs/types/common";
import { Request, Response } from "express";
import MemberService from "../models/Member.service";
import { MemberInput, LoginInput, Member } from "../libs/types/member";
import Errors from "../libs/Errors";
import AuthService from "../models/Auth.service";

const memberService = new MemberService();
const authService = new AuthService();

const memberController: T = {};
memberController.signup = async (req: Request, res: Response) => {
    try {
        console.log("signup");
        const input: MemberInput = req.body,
            result: Member = await memberService.signup(input);
        //TOKENS AUTHENTICATION
    const token = await authService.createToken(result);
    console.log("token=>", token);

        res.json({member: result});
    } catch (err) {
        console.log("Error, signup:", err);
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

memberController.login = async (req: Request, res: Response) => {
    try { 
        const input: LoginInput = req.body,
             result = await memberService.login(input),
            //TOKENS AUTHENTICATION
            token = await authService.createToken(result);
    console.log("token=>", token);
            res.json({member: result})
    } catch (err) {
        console.log("Error, login:", err);
        
        res.json;
    }
};





export default memberController;