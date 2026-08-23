import { T } from "../libs/types/common";
import {NextFunction, Request, Response } from "express";
import MemberService from "../models/Member.service";
import {
  ExtendedRequest,
  LoginInput,
  Member,
  MemberInput,
} from "../libs/types/member";
import Errors, { HttpCode, Message}from "../libs/Errors";
import { AUTH_TIMER } from "../libs/config";
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
    // console.log("token=>", token);

      res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
    });

    res.status(HttpCode.CREATED).json({ member: result, accessToken: token });
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
      //console.log("token=>", token);

        res.cookie("accessToken", token, {
        maxAge: AUTH_TIMER * 3600 * 1000,
        httpOnly: false,
        });
        res.status(HttpCode.OK).json({ member: result, accessToken: token });
    } catch (err) {
        console.log("Error, login:", err);
        
        res.json;
    }
};


memberController.logout = (req: ExtendedRequest, res: Response) => {
  try {
    console.log("logout");
    res.cookie("accessToken", null, { maxAge: 0, httpOnly: true });
    res.status(HttpCode.OK).json({ logout: true });
  } catch (err) {
    console.log("Error, login:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.verifyAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
    try {
        const token = req.cookies["accessToken"];
        if (token) req.member = await authService.checkAuth(token);
        if (!req.member)
            throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
         next();
    } catch (err) {
    console.log("Error, verifyAuth:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.retrieveAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies["accessToken"];
    if (token) req.member = await authService.checkAuth(token);

    next();
  } catch (err) {
    console.log("Error, retrieveAuth:", err);
    next();
  }
};


export default memberController;