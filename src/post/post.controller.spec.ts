import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';

describe('PostController', () => {
  let controller: PostController;
  let postService: { createComment: jest.Mock; likePost: jest.Mock };

  beforeEach(async () => {
    postService = {
      createComment: jest.fn(),
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

  it('calls createComment with the authenticated user id', () => {
    const req = { user: { id: 1 } } as any;
    const body = { content: 'Test comment' } as any;

    controller.createComment(2, req, body);

    expect(postService.createComment).toHaveBeenCalledWith(2, 1, body);
  });

  it('calls likePost with the authenticated user id', () => {
    const req = { user: { id: 2 } } as any;

    controller.likePost(3, req);

    expect(postService.likePost).toHaveBeenCalledWith(3, 2);
  });
});
