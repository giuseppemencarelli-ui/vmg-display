import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisplayDegsdComponent } from './display-degsd.component';

describe('DisplayDegsdComponent', () => {
  let component: DisplayDegsdComponent;
  let fixture: ComponentFixture<DisplayDegsdComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DisplayDegsdComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayDegsdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
