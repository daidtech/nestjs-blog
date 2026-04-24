import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PostService } from './post.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('PostService', () => {
  let service: PostService;
  let prisma: {
    comment: {
      findUnique: jest.Mock;
      create: jest.Mock;
    };
    like: {
      findFirst: jest.Mock;
      create: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    const prismaMock = {
      comment: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      like: {
        findFirst: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    prisma = module.get(PrismaService) as unknown as typeof prismaMock;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('likePost', () => {
    it('creates a like when none exists', async () => {
      prisma.like.findFirst.mockResolvedValue(null);
      prisma.like.create.mockResolvedValue({ id: 1, postId: 2, userId: 1 });

      const result = await service.likePost(2, 1);

      expect(prisma.like.findFirst).toHaveBeenCalledWith({ where: { postId: 2, userId: 1 } });
      expect(prisma.like.create).toHaveBeenCalledWith({ data: { postId: 2, userId: 1 } });
      expect(result).toEqual({ id: 1, postId: 2, userId: 1 });
    });

    it('removes an existing like when it is already present', async () => {
      prisma.like.findFirst.mockResolvedValue({ id: 2, postId: 2, userId: 1 });
      prisma.like.delete.mockResolvedValue({ id: 2, postId: 2, userId: 1 });

      const result = await service.likePost(2, 1);

      expect(prisma.like.delete).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(result).toEqual({ id: 2, postId: 2, userId: 1 });
    });
  });

  describe('createComment', () => {
    it('throws when parentId does not exist', async () => {
      prisma.comment.findUnique.mockResolvedValue(null);

      await expect(service.createComment(1, 1, { content: 'Hi', parentId: 999 })).rejects.toBeInstanceOf(
        BadRequestException,
      );
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
          replies: {
            include: {
              author: true,
            },
          },
        },
      });
      expect(result).toEqual({ id: 3, content: 'Hi', postId: 1, authorId: 1, parentId: null });
    });
  });
});
