import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { AuthService } from "src/auth/auth.service";
import { UsersModel } from "src/users/entity/users.entity";
import { UsersService } from "src/users/users.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { CommentsService } from "./comments.service";
import { PostsService } from "./posts.service";
import { CreateLikeDto } from "./dto/create-like.dto";
import { ConnectionNotFoundError } from "typeorm";
import { CommentLikeCountDto } from "./dto/comment-like-count.dto";

@WebSocketGateway({ namespace: 'posts' })
export class PostsGateway implements OnGatewayConnection {

    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
        private readonly commentsService: CommentsService,
        private readonly postsService: PostsService
    ) { }
    async handleConnection(socket: Socket & { user: UsersModel }) {

        console.log(`on connect websocket - ${socket.id}`)

        const headers = socket.handshake.headers

        const rawToken = headers['authorization'];


        if (!rawToken) {
            throw new WsException({
                status: 'error',
                message: '토큰이 존재하지 않습니다.'
            });
        };


        try {
            const token = this.authService.extractTokenFromHeader(rawToken, true);
            const payload = await this.authService.verifyToken(token);
            const user = await this.usersService.getUserByEmail(payload.email);

            socket.user = user;

        } catch (e) {
            socket.disconnect()

        };

    };


    @SubscribeMessage('send_comment')
    async sendComment(
        @ConnectedSocket() socket: Socket & { user: UsersModel },
        @MessageBody() dto: CreateCommentDto
    ) {
        const comment = await this.commentsService.createComment(dto, socket.user.id)

        socket.to(dto.postId.toString()).emit('upload_comment', comment.comment)
    }


    @SubscribeMessage('like_count')
    async toggleCount(
        @ConnectedSocket() socket: Socket & { user: UsersModel },
        @MessageBody() dto: CreateLikeDto
    ) {
        const result = await this.postsService.toggleLikeCount(socket.user.id, dto)


        socket.to(dto.postId.toString()).emit('click_like', { message: 'changed like count' })
    }



    @SubscribeMessage('like_incre')
    async increLikeComment(
        @ConnectedSocket() socket: Socket & { user: UsersModel },
        @MessageBody() dto: CommentLikeCountDto,
    ) {
        const result = this.commentsService.increaseLikeCount(dto)

        socket.to(dto.commentId.toString()).emit('comment_like_incre', { message: 'Comment like count is increased' })
    }


    @SubscribeMessage('like_decre')
    async decreLikeComment(
        @ConnectedSocket() socket: Socket & { user: UsersModel },
        @MessageBody() dto: CommentLikeCountDto,
    ) {
        const result = await this.commentsService.decreaseLikeCount(dto)

        socket.to(dto.commentId.toString()).emit('comment_like_decre', { message: 'Comment like count is decreased' })

    }
}