import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Request, Response } from 'express'
import { UserService } from '../user/user.service';
import { WalletGateway } from './wallet.gateway';
@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly userService: UserService,
    private readonly walletGateway: WalletGateway) { }

  @Post()
  async topUp(@Req() req: Request, @Body() body: any, @Res() res: Response) {
    console.log("đã vào!")
    if (process.env.CASSO_KEY != req.headers['secure-token']) {
      console.log("key loi")
      return res.status(500).json({
        message: "err"
      })
    }
    let { data, err } = await this.userService.updateWallet(String(body.data[0].description), body.data[0].amount)
    if (!err) {
      this.walletGateway.topUpSuccess(String(body.data[0].description), data);
      return res.status(200).json({
        message: "Ok"
      })
    }
  }

}
