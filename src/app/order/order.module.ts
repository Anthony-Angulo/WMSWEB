import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';

import { DeliveryDetailComponent } from './delivery-detail/delivery-detail.component';
import { DeliveryListComponent } from './delivery-list/delivery-list.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderListComponent } from './order-list/order-list.component';

const routes: Routes = [
  { path: '', component: OrderListComponent },
  { path: 'DeliveryList', component: DeliveryListComponent },
  { path: ':id', component: OrderDetailComponent },
  { path: 'Delivery/:id', component: DeliveryDetailComponent }
];

@NgModule({
  declarations: [
    DeliveryListComponent,
    DeliveryDetailComponent,
    OrderDetailComponent,
    OrderListComponent
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    RouterModule.forChild(routes)
  ]
})
export class OrderModule { }
