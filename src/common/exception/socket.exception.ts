import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

@Catch(HttpException)
export class SocketCatchHttpExceptionFilter extends BaseExceptionFilter<HttpException>{
    catch(exception: HttpException, host: ArgumentsHost): void {


        const socket = host.switchToWs().getClient()


        socket.emit(

            'exception',
            {
                statusCode: exception.getStatus(),
                error: exception.getResponse()
            }
        )
    }
}