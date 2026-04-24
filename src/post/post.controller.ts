import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('tagId') tagId?: string,
    @Query('published') published?: string,
    @Query('sortBy') sortBy?: 'createdAt' | 'title',
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.postService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
      categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
      tagId: tagId ? parseInt(tagId, 10) : undefined,
      published: typeof published !== 'undefined' ? published === 'true' : undefined,
      sortBy,
      order,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  likePost(@Param('id', ParseIntPipe) postId: number, @Req() req: Request) {
    return this.postService.likePost(postId, req.user?.id ?? 1);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreatePostDto, @Req() req: Request) {
    return this.postService.create({
      ...body,
      authorId: req.user?.id,
    });
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
