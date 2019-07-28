import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalresultsComponent } from './totalresults.component';

describe('TotalresultsComponent', () => {
  let component: TotalresultsComponent;
  let fixture: ComponentFixture<TotalresultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalresultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalresultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
