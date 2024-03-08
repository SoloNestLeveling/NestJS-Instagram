import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesModel } from './entity/images.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ImagesModel,
    ])
  ],
  exports: [ImagesService],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule { }
