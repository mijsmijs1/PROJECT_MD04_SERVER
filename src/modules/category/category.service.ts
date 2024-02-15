import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
    constructor(
        private readonly prisma: PrismaService
    ) { }
    async findCategory() {
        try {
            let categories = await this.prisma.category.findMany({
                include: {
                    branches: true
                }
            })
            return {
                data: categories
            }
        } catch (err) {
            return {
                err
            }
        }
    }
}
