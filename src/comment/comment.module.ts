import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { PostModule } from '@/post/post.module';

@Module({
  imports: [PostModule],
  controllers: [CommentController],
})
export class CommentModule {}
