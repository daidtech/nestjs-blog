import { Controller, Delete, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostService } from 'src/post/post.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeComment(@Param('id', ParseIntPipe) id: number) {
    return this.postService.deleteComment(id);
  }
}
