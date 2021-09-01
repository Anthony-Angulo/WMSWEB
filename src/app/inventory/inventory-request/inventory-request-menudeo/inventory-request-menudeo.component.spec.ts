import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryRequestMenudeoComponent } from './inventory-request-menudeo.component';

describe('InventoryRequestMenudeoComponent', () => {
  let component: InventoryRequestMenudeoComponent;
  let fixture: ComponentFixture<InventoryRequestMenudeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryRequestMenudeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryRequestMenudeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
