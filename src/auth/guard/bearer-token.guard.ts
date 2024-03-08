import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "../auth.service";
import { UsersService } from "src/users/users.service";
import { Reflector } from "@nestjs/core";
import { PUBLIC_KEY } from "src/users/decorator/is-public.decorator";

@Injectable()
export class BearerTokenGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly reflector: Reflector
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {

        const IsPublic = await this.reflector.getAllAndOverride(
            PUBLIC_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ]
        );


        const req = context.switchToHttp().getRequest()

        if (IsPublic) {
            req.isPublic = true
            return true;
        }

        const rawToken = req.headers['authorization']

        if (!rawToken) {
            throw new UnauthorizedException('토큰이 존재하지 않습니다.')
        };

        const token = this.authService.extractTokenFromHeader(rawToken, true);
        const result = await this.authService.verifyToken(token);
        const user = await this.usersService.getUserByEmail(result.email);

        req.user = user;
        req.token = token;
        req.tokenType = result.type;

        return true;
    };
};



@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const req = context.switchToHttp().getRequest()

        if (req.isPublic) {
            return true
        }

        if (req.tokenType !== 'access') {
            throw new UnauthorizedException('AccessToken이 아닙니다!')
        };

        return true;
    };
};


@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const req = context.switchToHttp().getRequest()

        if (req.tokenType !== 'refresh') {
            throw new UnauthorizedException('RefreshToken이 아닙니다!')
        };

        return true;
    };
};