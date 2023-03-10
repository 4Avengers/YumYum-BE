import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { PostLikeController } from './post-like.controller';
import { PostLikeService } from './post-like.service';
import { PostLike } from './entities/post-like.entity';
import { Hashtag } from './entities/hashtag.entity';
import { PostHashtagService } from './post-hashtag.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostLike, Hashtag])],
  controllers: [PostController, PostLikeController],
  providers: [PostService, PostLikeService, PostHashtagService],
  exports: [PostService, TypeOrmModule],
})
export class PostModule {}
