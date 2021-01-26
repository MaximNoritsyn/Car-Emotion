import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MergepersonsComponent } from './mergepersons.component';

describe('MergepersonsComponent', () => {
  let component: MergepersonsComponent;
  let fixture: ComponentFixture<MergepersonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MergepersonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergepersonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
