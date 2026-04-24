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

    const createData: any = {
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: data.content,
      published: data.published ?? false,
      authorId,
    };

    if (data.categoryIds?.length) {
      createData.categories = {
        connect: data.categoryIds.map((id) => ({ id })),
      };
    }

    if (data.tagIds) {
      createData.taggings = {
        create: data.tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })),
      };
    }

    return this.prisma.post.create({
      data: createData,
    });
  }

  async update(id: number, data: UpdatePostDto) {
    const payload: any = {};

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

    if (typeof data.categoryIds !== 'undefined') {
      payload.categories = {
        set: data.categoryIds.map((id) => ({ id })),
      };
    }

    if (typeof data.tagIds !== 'undefined') {
      payload.taggings = {
        deleteMany: {},
        create: data.tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })),
      };
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