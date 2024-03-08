import { CallHandler, ExecutionContext, Injectable, InternalServerErrorException, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { RolesTypeEnum } from "../entity/users.entity";
import { classToPlain, instanceToPlain } from "class-transformer";
import { UsersService } from "../users.service";

@Injectable()
export class UserAndAdminFieldInterceptor implements NestInterceptor {
    constructor(
        private readonly usersService: UsersService
    ) { }
    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {

        const req = context.switchToHttp().getRequest()

        const userId = req.params.userId;

        const user = await this.usersService.getUserById(userId)

        return next.handle()
            .pipe(

                map(() => {

                    if (user.role === RolesTypeEnum.USER) {

                        return instanceToPlain(user, { groups: ['USER'] })
                    } else if (user.role === RolesTypeEnum.ADMIN) {

                        return instanceToPlain(user, { groups: ['ADMIN'] })
                    } else {
                        throw new InternalServerErrorException()
                    }


                })
            )

    }
}