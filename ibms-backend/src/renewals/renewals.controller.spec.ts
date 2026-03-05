import { Test, TestingModule } from '@nestjs/testing';
import { RenewalsController } from './renewals.controller';

describe('RenewalsController', () => {
  let controller: RenewalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RenewalsController],
    }).compile();

    controller = module.get<RenewalsController>(RenewalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
