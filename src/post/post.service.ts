import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  private buildSlug(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  private async getOrCreateDefaultAuthorId(): Promise<number> {
    const existing = await this.prisma.user.findFirst({
      orderBy: { id: 'asc' },
      select: { id: true },
    });

    if (existing) {
      return existing.id;
    }

    const user = await this.prisma.user.create({
      data: {
        email: 'admin@example.com',
        firstName: 'Admin',
        password: '',
      },
      select: { id: true },
    });

    return user.id;
  }

  findAll() {
    return this.prisma.post.findMany({
      orderBy: { id: 'desc' },
      include: {
        author: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
  }

  async create(data: CreatePostDto) {
    const authorId = data.authorId ?? (await this.getOrCreateDefaultAuthorId());
    const slug = data.slug ?? this.buildSlug(data.title);

    return this.prisma.post.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        published: data.published ?? false,
        authorId,
      },
    });
  }

  async update(id: number, data: UpdatePostDto) {
    const payload: {
      title?: string;
      slug?: string;
      excerpt?: string | null;
      content?: string | null;
      published?: boolean;
    } = {};

    if (typeof data.title !== 'undefined') {
      payload.title = data.title;
      if (typeof data.slug === 'undefined') {
        payload.slug = this.buildSlug(data.title);
      }
    }

    if (typeof data.slug !== 'undefined') {
      payload.slug = data.slug;
    }

    if (typeof data.excerpt !== 'undefined') {
      payload.excerpt = data.excerpt;
    }

    if (typeof data.content !== 'undefined') {
      payload.content = data.content;
    }

    if (typeof data.published !== 'undefined') {
      payload.published = data.published;
    }

    return this.prisma.post.update({
      where: { id },
      data: payload,
    });
  }

  remove(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }
}