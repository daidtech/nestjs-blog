import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  private buildSlug(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  findAll() {
    return this.prisma.category.findMany({
      orderBy: { id: 'desc' },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });
  }

  create(data: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: data.name,
        slug: this.buildSlug(data.name),
      },
    });
  }
}
