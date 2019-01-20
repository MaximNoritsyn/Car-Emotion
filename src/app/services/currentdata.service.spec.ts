import { TestBed } from '@angular/core/testing';

import { CurrentdataService } from './currentdata.service';

describe('CurrentdataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrentdataService = TestBed.get(CurrentdataService);
    expect(service).toBeTruthy();
  });
});
