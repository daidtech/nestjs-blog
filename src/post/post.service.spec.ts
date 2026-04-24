import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('PostService', () => {
  let service: PostService;
  let prisma: {
    like: {
      findFirst: jest.Mock;
      create: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    const prismaMock = {
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
});
