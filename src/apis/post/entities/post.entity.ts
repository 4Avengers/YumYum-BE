import { Restaurant } from 'src/apis/restaurant/entities/restaurant.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Hashtag } from './hashtag.entity';
import { Image } from './image.entity';
import { PostLike } from './post-like.entity';
import { Comment } from 'src/apis/comment/entities/comment.entity';
import { PostUserTag } from './post-usertag.entity';
import { Collection } from 'src/apis/collection/entities/collection.entity';
import { CollectionItem } from 'src/apis/collection/entities/collection-item';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  rating: number;

  @Column()
  img_url: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @Column({
    type: 'enum',
    enum: ['public', 'private'],
    default: 'public',
  })
  visibility: 'public' | 'private';

  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.posts)
  @JoinColumn()
  restaurant: Restaurant;

  @OneToMany((type) => Image, (images) => images.post)
  @JoinColumn()
  images: Image[];

  @OneToMany((type) => PostLike, (postLIkes) => postLIkes.post)
  @JoinColumn()
  postLikes: PostLike[];

  @OneToMany((type) => Comment, (comments) => comments.post)
  @JoinColumn()
  comments: Comment[];

  @ManyToOne((type) => User, (user) => user.posts)
  @JoinColumn()
  user: User;

  //TODO: 다대다 관계 정의해주기
  @ManyToMany((type) => Hashtag, (hashtags) => hashtags.posts)
  @JoinTable()
  hashtags: Hashtag[];

  @OneToMany((type) => CollectionItem, (collectionItem) => collectionItem.post)
  collectionItems: CollectionItem[];

  @OneToMany((type) => PostUserTag, (postUserTags) => postUserTags.post)
  @JoinColumn()
  postUserTags: PostUserTag[];
}
