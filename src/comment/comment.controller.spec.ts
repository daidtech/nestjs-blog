import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

describe('CommentController', () => {
  let controller: CommentController;
  let commentService: { findComments: jest.Mock; createComment: jest.Mock; deleteComment: jest.Mock };

  beforeEach(async () => {
    commentService = {
      findComments: jest.fn(),
      createComment: jest.fn(),
      deleteComment: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [{ provide: CommentService, useValue: commentService }],
    }).compile();

    controller = module.get<CommentController>(CommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns comments for a post', async () => {
    const expected = [{ id: 1, content: 'Hi' }];
    commentService.findComments.mockResolvedValue(expected);

    await expect(controller.findComments(2)).resolves.toEqual(expected);
    expect(commentService.findComments).toHaveBeenCalledWith(2);
  });

  it('calls createComment with the authenticated user id', () => {
    const req = { user: { id: 1 } } as any;
    const body = { content: 'Test comment' } as any;

    controller.createComment(2, req, body);

    expect(commentService.createComment).toHaveBeenCalledWith(2, 1, body);
  });

  it('calls deleteComment on CommentService', () => {
    commentService.deleteComment.mockResolvedValue({ id: 10 });

    const result = controller.removeComment(10);

    expect(commentService.deleteComment).toHaveBeenCalledWith(10);
    expect(result).toEqual(expect.any(Promise));
  });
});
