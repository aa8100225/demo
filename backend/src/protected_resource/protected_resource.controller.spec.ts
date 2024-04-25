import { Test, TestingModule } from '@nestjs/testing';
import { ProtectedResourceController } from './protected_resource.controller';

describe('ProtectedResourceController', () => {
  let controller: ProtectedResourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProtectedResourceController],
    }).compile();

    controller = module.get<ProtectedResourceController>(ProtectedResourceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
