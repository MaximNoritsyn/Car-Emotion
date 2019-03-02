import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionclassComponent } from './competitionclass.component';

describe('CompetitionclassComponent', () => {
  let component: CompetitionclassComponent;
  let fixture: ComponentFixture<CompetitionclassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetitionclassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitionclassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
