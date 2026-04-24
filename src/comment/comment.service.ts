import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  findComments(postId: number) {
    return this.prisma.comment.findMany({
      where: {
        postId,
        parentId: null,
      },
      orderBy: { createdAt: 'asc' },
      include: {
        author: true,
        replies: {
          include: {
            author: true,
          },
        },
      },
    });
  }

  async createComment(
    postId: number,
    authorId: number,
    data: { content: string; parentId?: number | null },
  ) {
    if (typeof data.parentId !== 'undefined' && data.parentId !== null) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: data.parentId },
      });

      if (!parentComment) {
        throw new BadRequestException('parentId does not reference an existing comment');
      }

      if (parentComment.postId !== postId) {
        throw new BadRequestException('parentId must belong to the same post');
      }
    }

    return this.prisma.comment.create({
      data: {
        content: data.content,
        postId,
        authorId,
        parentId: data.parentId ?? null,
      },
      include: {
        author: true,
        replies: {
          include: {
            author: true,
          },
        },
      },
    });
  }

  deleteComment(id: number) {
    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
