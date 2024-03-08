import { BadRequestException, ExecutionContext, createParamDecorator } from "@nestjs/common";

export const ReqQueryRunner = createParamDecorator((data, context: ExecutionContext) => {

    const req = context.switchToHttp().getRequest()

    if (!req.queryRunner) {
        throw new BadRequestException('반드시 TransactionInterceptor와 함께 사용 해야합니다')
    };

    return req.queryRunner;
});