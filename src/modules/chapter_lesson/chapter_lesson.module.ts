import { Module } from '@nestjs/common';
import { ChapterLessonService } from './chapter_lesson.service';
import { ChapterLessonController } from './chapter_lesson.controller';

@Module({
  controllers: [ChapterLessonController],
  providers: [ChapterLessonService],
})
export class ChapterLessonModule {}
