import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../decorator/role.decorator";
import { RolesTypeEnum } from "../entity/users.entity";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {

        const Roles = await this.reflector.getAllAndOverride(
            ROLES_KEY,
            [
                context.getHandler(),
                context.getClass()
            ]
        );


        if (!Roles) {
            return true;
        };


        const { user } = context.switchToHttp().getRequest()

        if (user.role === RolesTypeEnum.USER) {

            throw new ForbiddenException('작업을 수행 할 권한이 없습니다.')

        } else {

            return true;
        }



    }
}