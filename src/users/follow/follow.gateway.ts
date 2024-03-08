import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { UsersModel } from "../entity/users.entity";
import { AuthService } from "src/auth/auth.service";
import { UsersService } from "../users.service";
import { FollowService } from "./follow.service";
import { FollowUserDto } from "./dto/follow-user.dto";
import { UnFollowUserDto } from "./dto/unfollow-user.dto";

@WebSocketGateway({ namespace: 'follow/socket' })
export class FollowGateway implements OnGatewayConnection {

    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly followService: FollowService

    ) { }

    async handleConnection(socket: Socket & { user: UsersModel }): Promise<boolean> {

        console.log(`on connet websocket - ${socket.id}`)


        const headers = socket.handshake.headers;

        const rawToken = headers['authorization'];

        if (!rawToken) {
            throw new WsException({
                error: '토큰이 존재하지 않습니다.'
            });
        }

        try {
            const token = this.authService.extractTokenFromHeader(rawToken, true);
            const payload = await this.authService.verifyToken(token);
            const user = await this.usersService.getUserByEmail(payload.email)

            socket.user = user;

            return true;
        } catch (e) {
            socket.disconnect()
        };

    }


    @SubscribeMessage('follow')
    async followUser(
        @ConnectedSocket() socket: Socket & { user: UsersModel },
        @MessageBody() dto: FollowUserDto,
    ) {

        const follow = await this.followService.followUser(socket.user.id, dto.followingId);

        socket.emit('follow_user', { message: 'user follow' })

    }



    @SubscribeMessage('unFollow')
    async unFollowUser(
        @ConnectedSocket() socket: Socket & { user: UsersModel },
        @MessageBody() dto: UnFollowUserDto
    ) {

        const unFollow = await this.followService.unFollowUser(socket.user.id, dto.unFollowingId);

        socket.emit('unFollow_user', { message: 'user unFollow' })
    }
}