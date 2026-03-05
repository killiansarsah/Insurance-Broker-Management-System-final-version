import { Test, TestingModule } from '@nestjs/testing';
import { RenewalsService } from './renewals.service';

describe('RenewalsService', () => {
  let service: RenewalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RenewalsService],
    }).compile();

    service = module.get<RenewalsService>(RenewalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
