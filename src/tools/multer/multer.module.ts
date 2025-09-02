import { Module } from '@nestjs/common';
import { MulterController } from './multer.controller';

@Module({
  controllers: [MulterController],
})
export class MulterModule {}
