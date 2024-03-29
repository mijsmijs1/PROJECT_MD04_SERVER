import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { MailModule } from './modules/mail/mail.module';
import { CourseModule } from './modules/course/course.module';
import { CategoryModule } from './modules/category/category.module';
import { ChapterLessonModule } from './modules/chapter_lesson/chapter_lesson.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { ProductModule } from './modules/product/product.module';
import { MemberModule } from './modules/member/member.module';
// import { LoginModule } from './modules/login/login.module';
import { ReceiptModule } from './modules/receipt/receipt.module';

@Module({
  imports: [UserModule,
  PrismaModule,
  MailModule,
  MemberModule,
  CourseModule,
  CategoryModule,
  ChapterLessonModule,
  WalletModule,
  ProductModule,
  ReceiptModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
