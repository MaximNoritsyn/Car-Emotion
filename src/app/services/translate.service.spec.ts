import { TestBed, inject } from '@angular/core/testing';

import { Translate_Service } from './translate.service';

describe('Translate_Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Translate_Service]
    });
  });

  it('should be created', inject([Translate_Service], (service: Translate_Service) => {
    expect(service).toBeTruthy();
  }));
});
