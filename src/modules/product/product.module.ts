
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TokenMiddleWare } from 'src/middlewares/authen.middleware';
import { UserService } from '../user/user.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, UserService],
})

export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMiddleWare)
      .forRoutes(
        { path: "product", method: RequestMethod.POST, version: "1" },
        { path: "product/updateVideo/:productId", method: RequestMethod.PATCH, version: "1" }
      )
  }

}
