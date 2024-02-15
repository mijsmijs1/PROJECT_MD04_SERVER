import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }
    async findById(id:number){
        try {
            let user = await this.prisma.user.findUnique({
                where: {
                    id: id
                }
            })
            if (!user) {
                throw "Tài khoản không tồn tại"
            }
            return {
                data: user
            }
        } catch (err) {
            return {
                err
            }
        }
    }
    async findUser(loginInfo: string) {
        try {
            let user = await this.prisma.user.findUnique({
                where: {
                    userName: loginInfo
                }
            })
            if (!user) {
                user = await this.prisma.user.findUnique({
                    where: {
                        email: loginInfo
                    }
                })
            }
            if (!user) {
                throw "Tài khoản không tồn tại"
            }
            return {
                data: user
            }
        } catch (err) {
            return {
                err
            }
        }
    }
    async update(userId: number, updateData: any) {
        try {
            let user = await this.prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    ...updateData,
                    updateAt: String(Date.now())
                }
            })
            return {
                data: user
            }
        } catch (err) {
            return {
                err
            }
        }
    }
    async create(user: any) {
        try {
            let result = await this.prisma.user.create({
                data: user
            });

            return {
                data: result,
            };

        } catch (err) {
            return { err };
        }
    }

}
