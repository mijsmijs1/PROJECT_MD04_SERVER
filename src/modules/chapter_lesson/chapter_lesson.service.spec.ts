import { Test, TestingModule } from '@nestjs/testing';
import { ChapterLessonService } from './chapter_lesson.service';

describe('ChapterLessonService', () => {
  let service: ChapterLessonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChapterLessonService],
    }).compile();

    service = module.get<ChapterLessonService>(ChapterLessonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
