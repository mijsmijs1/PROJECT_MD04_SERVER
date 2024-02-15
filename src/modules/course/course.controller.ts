import { Controller } from '@nestjs/common';
import { CourseService } from './course.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('course')
export class CourseController {
  constructor(
     readonly courseService: CourseService, 
     private readonly prismaService: PrismaService 
     ) {}

}
