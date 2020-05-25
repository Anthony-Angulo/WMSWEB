import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsReceiptDetailComponent } from './goods-receipt-detail.component';

describe('GoodsReceiptDetailComponent', () => {
  let component: GoodsReceiptDetailComponent;
  let fixture: ComponentFixture<GoodsReceiptDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsReceiptDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsReceiptDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
