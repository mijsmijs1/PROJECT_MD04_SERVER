import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, ParseFilePipe, Patch, Post, Query, Req, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { createReadStream, statSync, writeFileSync } from 'fs';
import { product, img } from '@prisma/client';

import { RequestToken } from 'src/common/interface';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }
  @Post('/')
  @UseInterceptors(FilesInterceptor('img'))
  async create(@UploadedFiles() images: Express.Multer.File[], @Req() req: RequestToken, @Body() body: any, @Res() res: Response) {
    try {
      const maxFileSize = 10 * 1024 * 1024; // Kích thước tối đa cho mỗi file (10MB)
      const allowedFileType = /^image\//; // Loại file cho phép (chỉ có hình ảnh)
      if (!images || images.length === 0) {
        throw { message: 'Không có file hình ảnh nào được tải lên!' };
      }
      for (const image of images) {
        // Validate kích thước file
        if (image.size > maxFileSize) {
          // Kích thước file vượt quá giới hạn
          throw { message: "Kích thước file vượt quá giới hạn cho phép!" };
        }

        // Validate loại file
        if (!allowedFileType.test(image.mimetype)) {
          // Loại file không hợp lệ
          throw { message: "Loại file không hợp lệ! Chỉ chấp nhận các file hình ảnh.!" };
        }

        // Tiếp tục xử lý các tác vụ khác liên quan đến file hình ảnh
        // ...
      }

      let fileName = `product_${Math.ceil(Date.now() * Math.random())}.${images[0].mimetype.split("/")[1]}`;
      writeFileSync(`public/img/${fileName}`, images[0].buffer)
      let { err, data } = await this.productService.create({
        ...JSON.parse(body.data),
        createAt: String(Date.now()),
        updateAt: String(Date.now()),
        avatar: `img/${fileName}`,
        userId: req.tokenData.id
      })
      images.map((item: any) => {
        fileName = `product_${Math.ceil(Date.now() * Math.random())}.${item.mimetype.split("/")[1]}`
        writeFileSync(`public/img/${fileName}`, item.buffer)
        this.productService.createImg({
          imgUrl: `img/${fileName}`,
          createAt: String(Date.now()),
          updateAt: String(Date.now()),
          productId: (data as any).id
        })
      })
      if (err) {
        throw {
          message: "Lỗi hệ thống! 031"
        }
      }
      return res.status(200).json({
        message: "Tin đã được tạo thành công, chúng tôi sẽ duyệt tin của bạn sớm nhất!",
        data: data
      })
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err ? [err.message] : ["Lỗi Server!"]
      })
    }
  }
  @Patch('/updateVideo/:productId')
  @UseInterceptors(FileInterceptor('video'))
  async updateVideo(@UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 500 * 1024 * 1024 }),
      new FileTypeValidator({ fileType: /^video\// }),
    ]
  })) video: Express.Multer.File, @Req() req: Request, @Res() res: Response) {

    try {

      let fileName = `product_video_${Math.ceil(Date.now() * Math.random())}.${video.mimetype.split("/")[1]}`
      writeFileSync(`public/video/${fileName}`, video.buffer)
      let { err, data } = await this.productService.update(Number(req.params.productId), {
        videoUrl: `video/${fileName}`
      });

      if (err) {
        throw "Lỗi CSDL"
      }

      res.status(200).json({
        message: "Update product thành công!",
        data: {
          ...data
        }
      })
    } catch (err) {
      res.status(500).json({
        message: err ? [err] : ["Lỗi Server!"]
      })
    }
  }
  @Patch('/:id')
  async update(@Req() req: Request,@Body() body: any, @Res() res: Response) {
    try {
      let { err, data } = await this.productService.update(Number(req.params.id),{...body})

      if (err) {
        throw "Lỗi CSDL"
      }

      res.status(200).json({
        message: "Update product thành công!",
        data: {
          ...data
        }
      })
    } catch (err) {
      res.status(500).json({
        message: err ? [err] : ["Lỗi Server!"]
      })
    }
  }
  
  @Get('/search')
  async getProductByKeyWord(@Req() req: Request, @Res() res: Response) {
    try {
      let { err, data } = await this.productService.getByKeyWord(String(req.query.keyword), Boolean(req.query.more))

      if (err) {
        throw "Lỗi CSDL"
      }

      res.status(200).json({
        message: "Get product thành công!",
        data: {
          ...data
        }
      })
    } catch (err) {
      res.status(500).json({
        message: err ? [err] : ["Lỗi Server!"]
      })
    }
  }
  @Get('/getByUserId/:userId')
  async getProductByUserId(@Req() req: Request, @Res() res: Response) {
    try {
      let { err, data } = await this.productService.getProductByUserId(Number(req.params.userId))

      if (err) {
        throw "Lỗi CSDL"
      }

      res.status(200).json({
        message: "Get product thành công!",
        data: {
          ...data
        }
      })
    } catch (err) {
      res.status(500).json({
        message: err ? [err] : ["Lỗi Server!"]
      })
    }
  }
  @Get('/reviewing')
  async getProductReviewing(@Req() req: Request, @Res() res: Response) {
    try {
      let { err, data } = await this.productService.getReviewing()

      if (err) {
        throw "Lỗi CSDL"
      }

      res.status(200).json({
        message: "Get product thành công!",
        data: {
          ...data
        }
      })
    } catch (err) {
      res.status(500).json({
        message: err ? [err] : ["Lỗi Server!"]
      })
    }
  }
  @Get('/delete')
  async getProductDelete(@Req() req: Request, @Res() res: Response) {
    try {
      let { err, data } = await this.productService.getDelete()

      if (err) {
        throw "Lỗi CSDL"
      }

      res.status(200).json({
        message: "Get product thành công!",
        data: {
          ...data
        }
      })
    } catch (err) {
      res.status(500).json({
        message: err ? [err] : ["Lỗi Server!"]
      })
    }
  }
  @Get('/:id')
  async getProductById(@Req() req: Request, @Res() res: Response) {
    try {
      let { err, data } = await this.productService.getById(Number(req.params.id))

      if (err) {
        throw "Lỗi CSDL"
      }

      res.status(200).json({
        message: "Get product thành công!",
        data: {
          ...data
        }
      })
    } catch (err) {
      res.status(500).json({
        message: err ? [err] : ["Lỗi Server!"]
      })
    }
  }
  @Get('/')
  async getProduct(@Req() req: Request, @Res() res: Response) {
    try {
      let { err, data } = await this.productService.get()

      if (err) {
        throw "Lỗi CSDL"
      }

      res.status(200).json({
        message: "Get product thành công!",
        data: {
          ...data
        }
      })
    } catch (err) {
      res.status(500).json({
        message: err ? [err] : ["Lỗi Server!"]
      })
    }
  }
  @Get('/video/streaming')
  async streamingVideo(@Req() req: Request, @Query('code') code: string, @Res() res: Response) {
    try {
      // Lấy phạm vi dung lượng yêu cầu từ phía video call qua
      const range = req.headers.range;
      if (!range) {
        console.log("Requires Range header");
        res.status(400).send("Requires Range header");
      }
      // Lấy video ra
      const videoPath = `public/${code}`;
      // Lấy size video
      const videoSize = statSync(videoPath).size;
      // CHUCK zise tức là phần dung lượng video sẽ lấy để trả về tương ứng lần call
      const CHUNK_SIZE = 5 * 10 ** 5; // ~500 KB => 500000 Bytes
      //Lấy số range gửi qua để tính (là điểm bắt đầu)
      const start = Number(range.replace(/\D/g, ""));// 'bytes=6750208-' => 6750208
      //Điểm end là start cộng với CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
      console.log(start, end);
      // Độ dài nội dung
      const contentLength = end - start + 1;
      //set header (video tự hiểu header này)
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      };
      //Viết header
      res.writeHead(206, headers);
      //Tạo Stream
      const videoStream = createReadStream(videoPath, { start, end });
      videoStream.pipe(res);
    } catch (err) {
      console.log('err', err);

      res.status(500).json({
        message: err ? [err] : ["Lỗi Server!"]
      })
    }
  }

}
