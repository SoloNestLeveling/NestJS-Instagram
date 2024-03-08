import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BasePaginateDto } from './dto/paginate.dto';
import { BaseModel } from './base/entity.base';
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { FILTER_MAPPER } from './const/filter-mapper.const';
import { HOST_KEY, PROTOCOL_KEY } from './const/env-path.const';
import { doesNotMatch } from 'assert';

@Injectable()
export class CommonService {
    constructor(
        private readonly configService: ConfigService
    ) { }



    commonPaginate<T extends BaseModel>(
        dto: BasePaginateDto,
        repository: Repository<T>,
        overriedFindOptions: FindManyOptions<T> = {},
        path: string,
    ) {

        if (dto.page) {

            return this.pagePaginate(
                dto,
                repository,
                overriedFindOptions
            )
        } else {

            return this.cursorPaginate(
                dto,
                repository,
                overriedFindOptions,
                path
            )
        };

    }


    async cursorPaginate<T extends BaseModel>(
        dto: BasePaginateDto,
        repository: Repository<T>,
        overriedFindOptions: FindManyOptions<T> = {},
        path: string,
    ) {

        const findOptions = this.composeFindOptions<T>(dto)

        const result = await repository.find({
            ...findOptions,
            ...overriedFindOptions
        });


        const lastItem = result.length && dto.take === result.length ? result[result.length - 1] : null;

        const host = this.configService.get<string>(HOST_KEY);
        const protocol = this.configService.get<string>(PROTOCOL_KEY)

        const nextUrl = lastItem ? new URL(`${protocol}://${host}/${path}`) : null;

        if (nextUrl) {

            for (const key of Object.keys(dto)) {

                if (key !== 'where__id__more_than' && key !== 'where__id__less_than') {

                    nextUrl.searchParams.append(key, dto[key])
                }
            };

            let key = null
            if (dto.order__createdAt === 'ASC') {

                key = 'where__id__more_than';
            } else if (dto.order__createdAt === 'DESC') {

                key = 'where__id__less_than';
            };

            nextUrl.searchParams.append(key, lastItem.id.toString())

        };

        return {
            data: result,
            cursor: {
                after: lastItem?.id.toString() ?? null
            },
            take: dto.take,
            nextUrl: nextUrl?.toString() ?? null
        }
    }


    async pagePaginate<T extends BaseModel>(
        dto: BasePaginateDto,
        repository: Repository<T>,
        overriedFindOptions: FindManyOptions<T> = {},
    ) {

        const findOptions = this.composeFindOptions<T>(dto)

        const [option, count] = await repository.findAndCount({
            ...findOptions,
            ...overriedFindOptions
        })

        return {

            data: option,
            total: count
        }
    }



    parseWhereAndOrderFilter<T extends BaseModel>(key: string, value: any): FindOptionsOrder<T> | FindOptionsWhere<T> {

        let options: FindOptionsOrder<T> | FindOptionsWhere<T> = {}

        const split = key.split('__');

        if (split.length !== 2 && split.length !== 3) {
            throw new BadRequestException(`split 적용시 where,order 필터의 길이는 반드시 2또는 3이어야합니다. 잘못된 키값 -${key}`)
        }

        if (split.length === 2) {

            const [_, field] = split

            options[field] = value;
        } else {

            const [_, field, operator] = split

            options[field] = FILTER_MAPPER[operator](value)
        };

        return options;


    };


    composeFindOptions<T extends BaseModel>(dto: BasePaginateDto): FindManyOptions<T> {

        let where: FindOptionsWhere<T> = {};
        let order: FindOptionsOrder<T> = {};

        for (const [key, value] of Object.entries(dto)) {

            if (dto[key]) {

                if (key.startsWith('where__')) {
                    where = {
                        ...where,
                        ...this.parseWhereAndOrderFilter(key, value)
                    }
                } else if (key.startsWith('order__')) {

                    order = {
                        ...order,
                        ...this.parseWhereAndOrderFilter(key, value)
                    }
                }
            }
        }

        return {
            where,
            order,
            take: dto.take,
            skip: dto.page ? dto.take * (dto.page - 1) : null
        };
    };
}
