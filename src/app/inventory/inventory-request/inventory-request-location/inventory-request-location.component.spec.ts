import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryRequestLocationComponent } from './inventory-request-location.component';

describe('InventoryRequestLocationComponent', () => {
  let component: InventoryRequestLocationComponent;
  let fixture: ComponentFixture<InventoryRequestLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryRequestLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryRequestLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
