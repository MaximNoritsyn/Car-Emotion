import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentresultComponent } from './currentresult.component';

describe('CurrentresultComponent', () => {
  let component: CurrentresultComponent;
  let fixture: ComponentFixture<CurrentresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
