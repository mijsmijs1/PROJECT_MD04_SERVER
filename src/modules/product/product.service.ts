import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createProductDTO } from './dto/create_product.dto';
import { AvailableStatus, ProductStatus } from '@prisma/client';
import unorm from 'unorm';
@Injectable()
export class ProductService {
    constructor(private readonly primaService: PrismaService) { }
    async create(productData: createProductDTO) {
        try {
            let product = await this.primaService.product.create({
                data: productData
            })
            return {
                data: product
            }
        } catch (err) {
            console.log(err);
            return {
                err
            }

        }
    }
    async createImg(img: any) {
        try {
            let product = await this.primaService.img.create({
                data: img
            })
            return {
                data: product
            }
        } catch (err) {
            console.log(err);
            return {
                err
            }

        }
    }
    async update(productId: any, videoUrl: any) {
        try {
            let product = await this.primaService.product.update({
                where: {
                    id: productId
                },
                data: {
                    ...videoUrl,
                    updateAt: new Date().toISOString()
                }
            })
            return {
                data: product
            }
        } catch (err) {
            console.log(err);
            return {
                err
            }

        }
    }

    async get() {
        try {
            let product = await this.primaService.product.findMany({
                where: {
                    status: ProductStatus.active,
                    moderationStatus: AvailableStatus.active
                },
                include: {
                    imgs: true
                },
                take: 18
            })
            return {
                data: product
            }
        } catch (err) {
            console.log(err);
            return {
                err
            }

        }
    }
    async getReviewing() {
        try {
            let product = await this.primaService.product.findMany({
                where: {
                    status: ProductStatus.inactive,
                    moderationStatus: AvailableStatus.inactive
                },
                include: {
                    imgs: true
                },
                take: 18
            })
            return {
                data: product
            }
        } catch (err) {
            console.log(err);
            return {
                err
            }

        }
    }
    async getDelete() {
        try {
            let product = await this.primaService.product.findMany({
                where: {
                    status: ProductStatus.delete
                },
                include: {
                    imgs: true
                },
                take: 18
            })
            return {
                data: product
            }
        } catch (err) {
            console.log(err);
            return {
                err
            }

        }
    }
    async getById(id: number) {
        try {
            let product = await this.primaService.product.findUnique({
                where: {
                    id: id
                },
                include: {
                    imgs: true
                }
            })
            return {
                data: product
            }
        } catch (err) {
            console.log(err);
            return {
                err
            }

        }
    }
    async getProductByUserId(userId: number) {
        try {
            let product = await this.primaService.product.findMany({
                where: {
                    userId: userId
                },
                include: {
                    imgs: true
                }
            })
            return {
                data: product
            }
        } catch (err) {
            console.log(err);
            return {
                err
            }

        }
    }
    async getByKeyWord(keyWord: string, more: boolean) {
        try {
            let products = []
            if (!more) {
                products = await this.primaService.product.findMany({
                    where: {
                        status: ProductStatus.active,
                        moderationStatus: AvailableStatus.active
                    },
                    select: {
                        id: true,
                        name: true,
                    },
                });
            } else {
                products = await this.primaService.product.findMany({
                    where: {
                        status: ProductStatus.active,
                        moderationStatus: AvailableStatus.active
                    }
                });
            }
            let filteredProducts: any = ""
            let nomalString = unorm.nfd(keyWord).replace(/[\u0300-\u036f]/g, "")
            if (nomalString == keyWord) {
                filteredProducts = products.filter((product) =>

                    unorm.nfd(product.name).replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().includes(keyWord.toLocaleLowerCase())
                );
            } else {
                filteredProducts = products.filter((product) =>

                    product.name.toLocaleUpperCase().includes(keyWord.toLocaleUpperCase()) || product.name.toLocaleLowerCase().includes(keyWord.toLocaleLowerCase())
                );
            }
            // product.name.includes(keyWord)

            return {
                data: filteredProducts,
            };
        } catch (err) {
            console.log(err);
            return {
                err
            }

        }
    }
}
