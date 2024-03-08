import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Observable, catchError, tap } from "rxjs";
import { DataSource } from "typeorm";

@Injectable()
export class SocketTransactionInterceptor implements NestInterceptor {

    constructor(
        private readonly dataSource: DataSource
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {

        const socket = context.switchToWs().getClient()
        const qr = this.dataSource.createQueryRunner()

        socket.queryRunner = qr;


        await qr.connect();
        await qr.startTransaction();

        return next.handle()
            .pipe(

                catchError(
                    async () => {

                        await qr.rollbackTransaction();
                        await qr.release();
                        throw new WsException({
                            error: '작업중 에러가 발생했습니다.'
                        });
                    }
                ),
                tap(
                    async () => {

                        await qr.commitTransaction();
                        await qr.release();
                    }
                ),
            )

    }
}