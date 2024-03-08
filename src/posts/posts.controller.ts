import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { ImagesService } from 'src/images/images.service';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/users/decorator/user-id.decorator';
import { UsersModel } from 'src/users/entity/users.entity';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { ReqQueryRunner } from 'src/common/decorator/query-runner.decorator';
import { QueryRunner } from 'typeorm';
import { ImageTypeEnum } from 'src/images/entity/images.entity';
import { PostPaginateDto } from './dto/post-paginate.dto';
import { CreateLikeDto } from './dto/create-like.dto';


@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly imagesService: ImagesService
  ) { }


  @Get()
  getPosts(
    @Query() dto: PostPaginateDto,
  ) {
    return this.postsService.postPaginate(dto)
  }



  @Post()
  @UseInterceptors(TransactionInterceptor)
  async createPost(
    @Body() dto: CreatePostDto,
    @User() author: UsersModel,
    @ReqQueryRunner() qr?: QueryRunner
  ) {
    const post = await this.postsService.createPost(dto, author.id, qr)

    for (let i = 0; i < dto.images.length; i++) {
      await this.imagesService.createPostImage({
        order: i + 1,
        type: ImageTypeEnum.POST_IMAGE,
        path: dto.images[i],
        post,
      }, qr);
    };

    return this.postsService.getPostById(post.id, qr)
  }




  @Get(':id')
  getPost(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.postsService.getPostById(id)
  }


  @Get('like/:id')
  getLike(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.postsService.getLike(id)
  };





}
