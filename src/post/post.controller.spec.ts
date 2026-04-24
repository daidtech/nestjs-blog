import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';

describe('PostController', () => {
  let controller: PostController;
  let postService: { likePost: jest.Mock };

  beforeEach(async () => {
    postService = {
      likePost: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [{ provide: PostService, useValue: postService }],
    }).compile();

    controller = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calls likePost with the authenticated user id', () => {
    const req = { user: { id: 2 } } as any;

    controller.likePost(3, req);

    expect(postService.likePost).toHaveBeenCalledWith(3, 2);
  });
});
