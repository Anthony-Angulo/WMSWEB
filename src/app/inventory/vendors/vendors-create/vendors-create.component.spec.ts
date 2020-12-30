import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorsCreateComponent } from './vendors-create.component';

describe('VendorsCreateComponent', () => {
  let component: VendorsCreateComponent;
  let fixture: ComponentFixture<VendorsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorsCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
