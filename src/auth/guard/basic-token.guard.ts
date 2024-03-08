import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "../auth.service";

@Injectable()
export class BasicTokenGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {

        const req = context.switchToHttp().getRequest()

        const rawToken = req.headers['authorization']

        if (!rawToken) {
            throw new UnauthorizedException('토큰이 존재하지 않습니다.')
        };

        const token = this.authService.extractTokenFromHeader(rawToken, false);
        const result = this.authService.decodedToken(token);
        const user = await this.authService.authenticatedWithEmailAndPassword(result);

        req.user = user;

        return true;
    }
}