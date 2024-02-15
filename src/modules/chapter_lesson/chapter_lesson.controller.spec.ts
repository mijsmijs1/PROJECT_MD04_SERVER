import { Test, TestingModule } from '@nestjs/testing';
import { ChapterLessonController } from './chapter_lesson.controller';
import { ChapterLessonService } from './chapter_lesson.service';

describe('ChapterLessonController', () => {
  let controller: ChapterLessonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChapterLessonController],
      providers: [ChapterLessonService],
    }).compile();

    controller = module.get<ChapterLessonController>(ChapterLessonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
