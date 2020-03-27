import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { PurchaseOrderDeliveryDetailComponent } from './purchase-order-delivery-detail/purchase-order-delivery-detail.component';
import { PurchaseOrderDeliveryListComponent } from './purchase-order-delivery-list/purchase-order-delivery-list.component';
import { PurchaseOrderDetailComponent } from './purchase-order-detail/purchase-order-detail.component';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';

const routes: Routes = [
  { path: '', component: PurchaseOrderListComponent },
  { path: 'DeliveryList', component: PurchaseOrderDeliveryListComponent },
  { path: ':id', component: PurchaseOrderDetailComponent },
  { path: 'Delivery/:id', component: PurchaseOrderDeliveryDetailComponent }
];

@NgModule({
  declarations: [
    PurchaseOrderDetailComponent,
    PurchaseOrderListComponent,
    PurchaseOrderDeliveryListComponent,
    PurchaseOrderDeliveryDetailComponent
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    RouterModule.forChild(routes)
  ]
})
export class PurchaseOrderModule { }
