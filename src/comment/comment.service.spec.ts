import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CommentService } from './comment.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('CommentService', () => {
  let service: CommentService;
  let prisma: {
    comment: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    const prismaMock = {
      comment: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    prisma = module.get(PrismaService) as unknown as typeof prismaMock;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findComments', () => {
    it('returns top-level comments for a post', async () => {
      const expected = [{ id: 1, postId: 2 }];
      prisma.comment.findMany.mockResolvedValue(expected);

      const result = await service.findComments(2);

      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        where: { postId: 2, parentId: null },
        orderBy: { createdAt: 'asc' },
        include: {
          author: true,
          replies: { include: { author: true } },
        },
      });
      expect(result).toEqual(expected);
    });
  });

  describe('createComment', () => {
    it('throws when parentId does not exist', async () => {
      prisma.comment.findUnique.mockResolvedValue(null);

      await expect(
        service.createComment(1, 1, { content: 'Hi', parentId: 999 }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('creates a comment when parentId is null', async () => {
      prisma.comment.create.mockResolvedValue({ id: 3, content: 'Hi', postId: 1, authorId: 1, parentId: null });

      const result = await service.createComment(1, 1, { content: 'Hi', parentId: null });

      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: {
          content: 'Hi',
          postId: 1,
          authorId: 1,
          parentId: null,
        },
        include: {
          author: true,
          replies: { include: { author: true } },
        },
      });
      expect(result).toEqual({ id: 3, content: 'Hi', postId: 1, authorId: 1, parentId: null });
    });
  });

  describe('deleteComment', () => {
    it('removes a comment by id', async () => {
      prisma.comment.delete.mockResolvedValue({ id: 5, postId: 1, authorId: 1 });

      const result = await service.deleteComment(5);

      expect(prisma.comment.delete).toHaveBeenCalledWith({ where: { id: 5 } });
      expect(result).toEqual({ id: 5, postId: 1, authorId: 1 });
    });
  });
});
