import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';

import { ProductsComponent } from './products/products.component';
import { ModalModule } from '../common/modal/modal.module';


const routes: Routes = [
  { path: 'Products', component: ProductsComponent },
  {
    path: 'InventoryRequest',
    loadChildren: () => import('./inventory-request/inventory-request.module').then(m => m.InventoryRequestModule)
  },
  {
    path: 'GoodsReceipt',
    loadChildren: () => import('./goods-receipt/goods-receipt.module').then(m => m.GoodsReceiptModule)
  },
  {
    path: 'GoodsIssue',
    loadChildren: () => import('./goods-issue/goods-issue.module').then(m => m.GoodsIssueModule)
  },
  { path: '',   redirectTo: '/InventoryRequest', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    ProductsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    // ModalModule,
    DataTablesModule,
    RouterModule.forChild(routes)
  ]
})
export class InventoryModule { }
