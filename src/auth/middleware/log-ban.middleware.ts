import { Inject, Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "../auth.service";
import { BanService } from "src/users/ban/ban.service";

@Injectable()
export class LogBanMiddleware implements NestMiddleware {

    constructor(
        private readonly authService: AuthService,
        private readonly banService: BanService
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {

        const token = req.headers.authorization?.split(' ')[1];


        if (token) {

            try {

                const userEmailAndPassword = this.authService.decodedToken(token)

                const bannedUser = await this.banService.getBanUserByEmail(userEmailAndPassword.email)

                if (bannedUser) {

                    return res.status(400).json({ message: '사용이 정지된 계정입니다. 고객센터로 문의하세요' })
                }



            } catch (e) {

                console.error('Invalid User')
                return res.status(400).json({ message: '인증되지 않은 사용자입니다, 토큰을 확인해주세요' })
            }
        }
        next();
    }
}