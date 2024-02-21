import { Request } from "express";
import { member } from "@prisma/client";
export interface RequestToken extends Request {
    tokenData: any
}