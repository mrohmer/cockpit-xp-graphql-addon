import { TestBed } from '@angular/core/testing';

import { DynamicUrlApolloService } from './dynamic-url-apollo.service';

describe('DynamicUrlApolloService', () => {
  let service: DynamicUrlApolloService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicUrlApolloService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
