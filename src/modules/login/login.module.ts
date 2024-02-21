import { Global, Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginGateway } from './login.gateway';

@Global()
@Module({
  providers: [LoginGateway, LoginService],
  exports: [LoginService, LoginGateway]
})
export class LoginModule {}
