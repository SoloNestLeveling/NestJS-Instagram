import { ExceptionFilter, ExecutionContext, createParamDecorator } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";

export const SocketQueryRunner = createParamDecorator((data, context: ExecutionContext) => {

    const socket = context.switchToWs().getClient()

    if (!socket.queryRunner) {
        throw new WsException({
            error: '반드시 SocketTransactionInterceptor와 함께 사용 해주세요!'
        })
    };

    return socket.queryRunner;
})