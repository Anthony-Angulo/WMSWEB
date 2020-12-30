import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryRequestCreateComponent } from './inventory-request-create/inventory-request-create.component';
import { InventoryRequestDetailComponent } from './inventory-request-detail/inventory-request-detail.component';
import { InventoryRequestListComponent } from './inventory-request-list/inventory-request-list.component';
import { InventoryRequestLocationComponent } from './inventory-request-location/inventory-request-location.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';

import { ProductListComponent as ProductListCreateComponent} from './inventory-request-create/product-list/product-list.component';
import { UserListComponent } from './inventory-request-create/user-list/user-list.component';
import { ProductListComponent as ProductListDetailComponent} from './inventory-request-detail/product-list/product-list.component';
import { ProductsBarcodeComponent } from './inventory-request-detail/product-list/products-barcode/products-barcode.component';
import { ProductsDetailComponent } from './inventory-request-detail/product-list/products-detail/products-detail.component';
import { ModalModule } from 'src/app/common/modal/modal.module';


const routes: Routes = [
  { path: 'Create', component: InventoryRequestCreateComponent },
  { path: 'Location', component: InventoryRequestLocationComponent },
  { path: ':id', component: InventoryRequestDetailComponent },
  { path: '', component: InventoryRequestListComponent }
];

@NgModule({
  declarations: [
    InventoryRequestCreateComponent,
    InventoryRequestDetailComponent,
    InventoryRequestListComponent,
    InventoryRequestLocationComponent,
    ProductListCreateComponent,
    UserListComponent,
    ProductListDetailComponent,
    ProductsBarcodeComponent,
    ProductsDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ModalModule,
    DataTablesModule,
    RouterModule.forChild(routes)
  ]
})
export class InventoryRequestModule { }
