import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Request, Response } from 'express'
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  async topUp(@Req() req: Request,@Body() body: any, @Res() res: Response) {
    console.log("đã vào!")
      if(process.env.CASSO_KEY != req.headers['secure-token']) {
        console.log("key loi")
        return res.status(500).json({
          message: "err"
        })
      }
      console.log("req", req.headers['secure-token'])
      console.log("da nhan duoc", body.data)
      return res.status(200).json({
        message: "Ok"
      })
  }
}
