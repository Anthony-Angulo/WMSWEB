import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsBarcodeComponent } from './products-barcode.component';

describe('ProductsBarcodeComponent', () => {
  let component: ProductsBarcodeComponent;
  let fixture: ComponentFixture<ProductsBarcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsBarcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
