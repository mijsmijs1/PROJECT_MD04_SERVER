import { AvailableStatus, ProductStatus } from "@prisma/client";
import { IsNotEmpty } from "class-validator";


export class createProductDTO {
    @IsNotEmpty()
    name: string
    @IsNotEmpty()
    price: number
    @IsNotEmpty()
    createAt: string;
    @IsNotEmpty()
    updateAt: string;
    @IsNotEmpty()
    desc: string;
    @IsNotEmpty()
    detail: string;
    @IsNotEmpty()
    address: string;
    @IsNotEmpty()
    avatar: string;
    @IsNotEmpty()
    branchId: number;
}