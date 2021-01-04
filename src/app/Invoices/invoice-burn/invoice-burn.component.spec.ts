import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceBurnComponent } from './invoice-burn.component';

describe('InvoiceBurnComponent', () => {
  let component: InvoiceBurnComponent;
  let fixture: ComponentFixture<InvoiceBurnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceBurnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceBurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
