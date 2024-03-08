import { Controller, Post, UploadedFile, UploadedFiles, UseFilters, UseInterceptors } from '@nestjs/common';
import { CommonService } from './common.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) { }

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  saveImageInTemp(
    @UploadedFile() file: Express.Multer.File
  ) {
    return {
      fileName: file.filename
    }
  }
}
