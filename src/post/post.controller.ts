import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll() {
    return 'This action returns all posts';
  }

  @Post()
  create(@Body() body: any) {
    return this.postService.create(body);
  }
}
