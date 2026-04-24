import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { PostService } from '@/post/post.service';

describe('CommentController', () => {
  let controller: CommentController;
  let postService: { deleteComment: jest.Mock };

  beforeEach(async () => {
    postService = {
      deleteComment: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [{ provide: PostService, useValue: postService }],
    }).compile();

    controller = module.get<CommentController>(CommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calls deleteComment on PostService', () => {
    postService.deleteComment.mockResolvedValue({ id: 10 });

    const result = controller.removeComment(10);

    expect(postService.deleteComment).toHaveBeenCalledWith(10);
    expect(result).toEqual(expect.any(Promise));
  });
});
