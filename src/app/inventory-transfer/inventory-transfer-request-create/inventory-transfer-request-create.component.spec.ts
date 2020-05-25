import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTransferRequestCreateComponent } from './inventory-transfer-request-create.component';

describe('InventoryTransferRequestCreateComponent', () => {
  let component: InventoryTransferRequestCreateComponent;
  let fixture: ComponentFixture<InventoryTransferRequestCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryTransferRequestCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryTransferRequestCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
