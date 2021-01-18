import { TestBed } from '@angular/core/testing';

import { ParticlesConfigService } from './particles-config.service';

describe('ParticlesConfigService', () => {
  let service: ParticlesConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticlesConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
