import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorsEditComponent } from './vendors-edit.component';

describe('VendorsEditComponent', () => {
  let component: VendorsEditComponent;
  let fixture: ComponentFixture<VendorsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorsEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
