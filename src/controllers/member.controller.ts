import { T } from "../libs/types/common";
import { Request, Response } from "express";
import MemberService from "../models/Member.service";
import { MemberInput, LoginInput, Member } from "../libs/types/member";
import Errors from "../libs/Errors";

const memberService = new MemberService();

const memberController: T = {};
memberController.signup = async (req: Request, res: Response) => {
    try {
        console.log("signup");
        const input: MemberInput = req.body,
            result: Member = await memberService.signup(input);

        res.json({member: result});
    } catch (err) {
        console.log("Error, signup:", err);
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
        // res.status(400).json({ message: err instanceof Error ? err.message : "Signup failed" });
    }
};

memberController.login = async (req: Request, res: Response) => {
    try { 
        const input: LoginInput = req.body,
            result = await memberService.login(input);
        
            res.json({member: result})
    } catch (err) {
        console.log("Error, login:", err);
        
        res.json;
    }
};





export default memberController;