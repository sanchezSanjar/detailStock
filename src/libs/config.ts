export const AUTH_TIMER = 24;
export const MORGAN_FORMAT = `:method :url :response-time [:status] \n`;

import mongoose from "mongoose";
import Errors, { HttpCode, Message } from "./Errors";

export const shapeIntoMongooseObjectId = (target: any) => {
    if (typeof target !== "string") return target;
    // a malformed id cannot match anything, so answer 404 instead of crashing with 500
    if (!mongoose.Types.ObjectId.isValid(target)) {
        throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }
    return new mongoose.Types.ObjectId(target);
};
