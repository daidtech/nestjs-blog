import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { PostService } from './post.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id);
  }

  @Get(':id/comments')
  findComments(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findComments(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  createComment(
    @Param('id', ParseIntPipe) postId: number,
    @Req() req: Request,
    @Body() body: CreateCommentDto,
  ) {
    return this.postService.createComment(postId, req.user?.id ?? 1, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  likePost(@Param('id', ParseIntPipe) postId: number, @Req() req: Request) {
    return this.postService.likePost(postId, req.user?.id ?? 1);
  }

  @Post()
  create(@Body() body: CreatePostDto) {
    return this.postService.create(body);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdatePostDto) {
    return this.postService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postService.remove(id);
  }
}
