import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('posts/:id/comments')
  findComments(@Param('id', ParseIntPipe) postId: number) {
    return this.commentService.findComments(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('posts/:id/comments')
  createComment(
    @Param('id', ParseIntPipe) postId: number,
    @Req() req: Request,
    @Body() body: CreateCommentDto,
  ) {
    return this.commentService.createComment(postId, req.user?.id ?? 1, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('comments/:id')
  removeComment(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.deleteComment(id);
  }
}
