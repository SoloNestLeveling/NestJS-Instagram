import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentsModel } from './entity/comments.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentLikeCountDto } from './dto/comment-like-count.dto';


@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentsModel)
        private readonly commentsRepository: Repository<CommentsModel>
    ) { }


    async createComment(dto: CreateCommentDto, authorId: number) {

        const comment = this.commentsRepository.create({
            author: {
                id: authorId
            },
            post: {
                id: dto.postId
            },
            comment: dto.comment,
            likeCount: dto.likeCount,

        });

        const result = await this.commentsRepository.save(comment);

        return result;
    }


    async getCommentById(id: number) {
        const comment = await this.commentsRepository.findOne({
            where: {
                id,
            }
        });

        return comment;
    }


    async increaseLikeCount(dto: CommentLikeCountDto) {

        await this.commentsRepository.increment({
            id: dto.commentId
        }, 'likeCount', 1);


        return true;

    }

    async decreaseLikeCount(dto: CommentLikeCountDto) {

        const comment = await this.getCommentById(dto.commentId)

        await this.commentsRepository.decrement({
            id: dto.commentId
        }, 'likeCount', 1);


        if (comment.likeCount < 0) {
            comment.likeCount = 0;


        };

        await this.commentsRepository.save(comment)



        return true;
    }
}
