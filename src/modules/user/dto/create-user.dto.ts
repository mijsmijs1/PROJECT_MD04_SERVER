import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDTO {
    @IsNotEmpty()
    userName: string
    @IsEmail()
    email: string
    @IsNotEmpty()
    password: string

}