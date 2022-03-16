import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCarPartsComponent } from './create-car-parts.component';

describe('CreateCarPartsComponent', () => {
  let component: CreateCarPartsComponent;
  let fixture: ComponentFixture<CreateCarPartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCarPartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCarPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
