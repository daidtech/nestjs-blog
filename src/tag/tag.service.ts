import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagService {
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
    return this.prisma.tag.findMany({
      orderBy: { id: 'desc' },
    });
  }

  create(data: CreateTagDto) {
    return this.prisma.tag.create({
      data: {
        name: data.name,
        slug: this.buildSlug(data.name),
      },
    });
  }
}
