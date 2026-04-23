import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsDialog } from './stats-dialog';

describe('StatsDialog', () => {
  let component: StatsDialog;
  let fixture: ComponentFixture<StatsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
