import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
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
    const authorId = data.authorId;
    if (typeof authorId === 'undefined') return null;
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

  async likePost(postId: number, userId: number) {
    const existingLike = await this.prisma.like.findFirst({
      where: { postId, userId },
    });

    if (existingLike) {
      return this.prisma.like.delete({
        where: { id: existingLike.id },
      });
    }

    return this.prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
  }
}