import { Module } from '@nestjs/common';
import { ProtectedResourceController } from './protected_resource.controller';

@Module({
  controllers: [ProtectedResourceController]
})
export class ProtectedResourceModule {}
