import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstraintsInputComponent } from './constraints-input.component';

describe('ConstraintsInputComponent', () => {
  let component: ConstraintsInputComponent;
  let fixture: ComponentFixture<ConstraintsInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstraintsInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstraintsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
