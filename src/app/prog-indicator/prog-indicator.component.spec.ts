import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgIndicatorComponent } from './prog-indicator.component';

describe('ProgIndicatorComponent', () => {
  let component: ProgIndicatorComponent;
  let fixture: ComponentFixture<ProgIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgIndicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
