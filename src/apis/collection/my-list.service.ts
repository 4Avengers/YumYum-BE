import { Collection } from './entities/collection.entity';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { CollectionItem } from './entities/collection-item.entity';
import { Post } from '../post/entities/post.entity';

@Injectable()
export class MyListService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
    @InjectRepository(CollectionItem)
    private collectionItemRepository: Repository<CollectionItem>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}
  /*
    ### 23.03.14
    ### 표정훈
    ### MyList 상세보기 [가게명/평점/포스팅내용/이미지]
    */

  async getMyListsDetail(userId: number, collectionId: number) {
    try {
      const myLists = await this.collectionRepository.find({
        relations: {
          collectionItems: {
            post: true,
            restaurant: true,
          },
        },
        where: {
          user_id: userId,
          deletedAt: null,
          type: 'myList',
          id: collectionId,
        },
        select: { name: true, description: true, image: true },
      });

      return myLists;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
    ### 23.03.14
    ### 표정훈
    ### MyList 이름조회(내꺼) 👍
    */

  async getMyListsName(userId: number) {
    try {
      const myLists = await this.collectionRepository.find({
        where: { user_id: userId, deletedAt: null, type: 'myList' },
        select: { name: true },
      });

      return myLists;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
    ### 23.03.14
    ### 표정훈
    ### MyList 전체조회(내꺼)
    */

  // 해결해야할 사항 fix:16 fix30
  // 1. post에서 id: 1인 값만 가져옴 => 데이터베이스 수정으로 해결완료🔥
  // 2. post를 3개까지만 제한해서 가져오고 싶음 => map으로 해결완료🔥
  async getMyListsMe(userId: number) {
    try {
      const myLists = await this.collectionRepository.find({
        relations: {
          collectionItems: {
            post: true,
            restaurant: true,
          },
        },
        where: { user_id: userId, deletedAt: null, type: 'myList' },
        select: { name: true, description: true, image: true },
      });

      return myLists.map((collection) => ({
        ...collection,
        collectionItems: collection.collectionItems.slice(0, 3),
      }));
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 전체조회(남의꺼)
    */

  // 해결해야할 사항 fix:16 fix30
  // 1. post에서 id: 1인 값만 가져옴 => 데이터베이스 수정으로 해결완료🔥
  // 2. post를 3개까지만 제한해서 가져오고 싶음 => map으로 해결완료🔥
  async getMyListsAll(userId: number) {
    try {
      const myLists = await this.collectionRepository.find({
        relations: {
          collectionItems: {
            post: true,
            restaurant: true,
          },
        },
        where: { user_id: userId, deletedAt: null, type: 'myList' },
        select: { name: true, description: true, image: true },
      });

      return myLists.map((collection) => ({
        ...collection,
        collectionItems: collection.collectionItems.slice(0, 3),
      }));
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 생성
    */
  async createMyList(userId: number, name: string, type: 'myList') {
    try {
      const myLists = await this.collectionRepository.insert({
        user_id: userId,
        name,
        type: 'myList',
      });
      return myLists;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 수정
    */
  //🔥문제 발생할만한 부분: myListId는 collectionId와 같아서 문제🔥
  // 예) 1번유저 마이리스트 검색후, 1번의 3번째 마이리스트 수정
  async updateMyList(
    userId: number,
    collectionId: number,
    name: string,
    image: string,
    description: string,
    visibility: 'public' | 'private',
  ) {
    try {
      // id와 type이 모두 일치하는 Collection 엔티티를 찾는다.
      const myList = await this.collectionRepository.find({
        relations: {
          user: true,
        },
      });

      if (!myList) {
        throw new NotFoundException('마이리스트가 없습니다.');
      }

      await this.collectionRepository.update(
        { id: collectionId },
        {
          name,
          image,
          description,
          visibility,
        },
      );
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      } else {
        console.error(err);
        throw new InternalServerErrorException(
          'Something went wrong while processing your request. Please try again later.',
        );
      }
    }
  }

  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 삭제
    */
  async deleteMyList(userId: number, id: number) {
    try {
      const result = await this.collectionRepository.softDelete(id); // soft delete를 시켜주는 것이 핵심입니다!
      if (result.affected === 0) {
        throw new NotFoundException('마이리스트가 없습니다.');
      }
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      } else {
        console.error(err);
        throw new InternalServerErrorException(
          'Something went wrong while processing your request. Please try again later.',
        );
      }
    }
  }

  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 포스팅 추가
    */
  // 같은 컬렉션 안에 동일한 포스트는 안들어감!
  async myListPlusPosting(postId: number, collectionId: number[]) {
    try {
      for (let i = 0; i < collectionId.length; i++) {
        const item = collectionId[i];
        const existingItem = await this.collectionItemRepository.findOne({
          where: {
            post: { id: postId },
            collection: { id: item },
          },
        });

        if (existingItem) {
          continue; // 이미 존재하는 CollectionItem이면 해당 콜렉션에 추가하지 않고, 다음 콜렉션으로 넘어감
        }

        const collectionItem = this.collectionItemRepository.create({
          post: { id: postId },
          collection: { id: item },
        });
        await this.collectionItemRepository.save(collectionItem);
      }
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      } else {
        console.error(err);
        throw new InternalServerErrorException(
          'Something went wrong while processing your request. Please try again later.',
        );
      }
    }
  }

  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 포스팅 삭제
    */

  //해당 collectionId일때 일치하는 postId만 삭제하는 기능
  // 🔥주의사항: Number만 삭제 가능🔥
  async myListMinusPosting(postId: number, collectionId: number) {
    try {
      if (collectionId) {
        await this.collectionItemRepository.delete({
          collection: { id: collectionId },
          post: { id: postId },
        });
      } else {
        throw new NotFoundException('해당 컬렉션은 없습니다.');
      }
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      } else {
        console.error(err);
        throw new InternalServerErrorException(
          'Something went wrong while processing your request. Please try again later.',
        );
      }
    }
  }
}

// async 데이터찾기(userId: number) {
//   try {

// const myLists = await this.collectionRepository.find({
//   relations: {
//     collectionItems: {
//       post: true,
//     },
//     user: true,
//   },
//   where: {
//     user: {
//       id: userId,
//     },
//   },
// });

// return myLists;
//   } catch (err) {
//     console.log(err);
//     throw new InternalServerErrorException(
//       'Something went wrong while processing your request. Please try again later.',
//     );
//   }
// }
