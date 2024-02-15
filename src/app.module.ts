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

@Module({
  imports: [UserModule,
  PrismaModule,
  MailModule,
  CourseModule,
  CategoryModule,
  ChapterLessonModule,
  WalletModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
