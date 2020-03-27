import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products/products.component';
import { InventoryRequestCreateComponent } from './inventory-request-create/inventory-request-create.component';
import { InventoryRequestListComponent } from './inventory-request-list/inventory-request-list.component';
import { InventoryRequestDetailComponent } from './inventory-request-detail/inventory-request-detail.component';



@NgModule({
  declarations: [ProductsComponent, InventoryRequestCreateComponent, InventoryRequestListComponent, InventoryRequestDetailComponent],
  imports: [
    CommonModule
  ]
})
export class InventoryModule { }
