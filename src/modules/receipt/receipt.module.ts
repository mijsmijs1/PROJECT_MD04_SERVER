import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { ReceiptController } from './receipt.controller';
import { TokenMiddleWare } from 'src/middlewares/authen.middleware';
import { UserService } from '../user/user.service';

@Module({
  controllers: [ReceiptController],
  providers: [ReceiptService,UserService],
})
export class ReceiptModule implements NestModule{
  configure(consumer: MiddlewareConsumer){
    consumer
    .apply(TokenMiddleWare)
    .forRoutes(
      {path:"receipts/add-to-cart", method:RequestMethod.POST,version:"1"},
      
    )
  }
}
