import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { UserService } from '../user/user.service';
import { WalletGateway } from './wallet.gateway';

@Module({
  controllers: [WalletController],
  providers: [WalletService,UserService,WalletGateway],
  exports: [WalletService, WalletGateway]
})
export class WalletModule {}
