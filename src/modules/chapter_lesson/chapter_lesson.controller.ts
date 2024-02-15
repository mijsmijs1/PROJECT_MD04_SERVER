import { Controller } from '@nestjs/common';
import { ChapterLessonService } from './chapter_lesson.service';

@Controller('chapter-lesson')
export class ChapterLessonController {
  constructor(private readonly chapterLessonService: ChapterLessonService) {}
}
