import { CallHandler, ExecutionContext, Injectable, InternalServerErrorException, NestInterceptor } from "@nestjs/common";
import { Observable, catchError, tap } from "rxjs";
import { DataSource } from "typeorm";

@Injectable()
export class TransactionInterceptor implements NestInterceptor {

    constructor(
        private readonly dataSource: DataSource
    ) { }
    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {

        const req = context.switchToHttp().getRequest();

        const qr = this.dataSource.createQueryRunner();

        req.queryRunner = qr;


        await qr.connect()
        await qr.startTransaction()

        return next.handle()
            .pipe(
                catchError(
                    async () => {
                        await qr.rollbackTransaction()
                        await qr.release()
                        throw new InternalServerErrorException('작업중 에러가 발생했습니다.')
                    }
                ),
                tap(
                    async () => {
                        await qr.commitTransaction()
                        await qr.release()
                    }
                )
            )

    }
}