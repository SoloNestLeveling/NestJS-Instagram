import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsModel } from './entity/posts.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { PostPaginateDto } from './dto/post-paginate.dto';
import { CommonService } from 'src/common/common.service';
import { LikesModel } from './entity/likes.entity';
import { privateDecrypt } from 'crypto';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostsModel)
        private readonly postsRepository: Repository<PostsModel>,
        private readonly commonService: CommonService,
        @InjectRepository(LikesModel)
        private readonly likesRepository: Repository<LikesModel>
    ) { }




    postPaginate(dto: PostPaginateDto) {

        return this.commonService.commonPaginate(
            dto,
            this.postsRepository,
            {
                relations: ['images', 'author', 'comments', 'likes'],
                select: {
                    author: {
                        id: true,
                        nickname: true
                    },
                    comments: {
                        id: true,
                        comment: true,
                        likeCount: true,
                    }
                }
            },
            'posts'
        )

    }





    getRepository(qr?: QueryRunner) {
        return qr ? qr.manager.getRepository<PostsModel>(PostsModel) : this.postsRepository;
    };

    async createPost(dto: CreatePostDto, authorId: number, qr?: QueryRunner) {

        const repository = this.getRepository(qr)

        const post = repository.create({
            author: {
                id: authorId
            },
            ...dto,
            images: []
        });

        const result = await repository.save(post)

        return result;
    }


    async getPostById(id: number, qr?: QueryRunner) {

        const repository = this.getRepository(qr)

        const post = await repository.findOne({
            where: {
                id,
            },
            relations: ['images', 'author', 'comments', 'likes'],
            select: {
                author: {
                    id: true,
                    nickname: true,
                },
                comments: {
                    id: true,
                    comment: true,
                }
            }
        });
        return post;
    }



    // 포스트 좋아요 

    async toggleLikeCount(userId: number, dto: CreateLikeDto) {


        const likeObj = await this.likesRepository.findOne({
            where: {
                user: {
                    id: userId
                },
                post: {
                    id: dto.postId
                }
            }
        })


        if (!likeObj) {

            const like = this.likesRepository.create({
                user: {
                    id: userId
                },
                post: {
                    id: dto.postId
                }
            });

            await this.likesRepository.save(like)
            this.increaseLikeCount(dto.postId);
            return true;

        } else {

            await this.likesRepository.delete(likeObj.id)
            this.decreaseLikeCount(dto.postId)
            return 'cancel like'


        }
    }



    increaseLikeCount(postId: number) {

        return this.postsRepository.increment({
            id: postId
        }, 'likeCount', 1)


    };



    decreaseLikeCount(postId: number) {

        return this.postsRepository.decrement({
            id: postId
        }, 'likeCount', 1)

    };


    async getLike(id: number) {
        const like = await this.likesRepository.findOne({
            where: {
                id,
            },
            relations: ['user'],
            select: {
                user: {
                    id: true,
                    nickname: true
                }
            }
        });

        if (!like) {
            throw new BadRequestException('존재하지 않습니다.')
        }

        return like
    };



}
