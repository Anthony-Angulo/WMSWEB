import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';

import { GoodsIssueDetailComponent } from './goods-issue-detail/goods-issue-detail.component';
import { GoodsIssueListComponent } from './goods-issue-list/goods-issue-list.component';
import { GoodsReceiptDetailComponent } from './goods-receipt-detail/goods-receipt-detail.component';
import { GoodsReceiptListComponent } from './goods-receipt-list/goods-receipt-list.component';
import { InventoryRequestCreateComponent } from './inventory-request-create/inventory-request-create.component';
import { InventoryRequestDetailComponent } from './inventory-request-detail/inventory-request-detail.component';
import { InventoryRequestListComponent } from './inventory-request-list/inventory-request-list.component';
import { ProductsComponent } from './products/products.component';


const routes: Routes = [
  { path: 'Products', component: ProductsComponent },
  { path: 'Create', component: InventoryRequestCreateComponent },
  { path: 'ReceiptList', component: GoodsReceiptListComponent },
  { path: 'IssueList', component: GoodsIssueListComponent },
  { path: 'Receipt/:id', component: GoodsReceiptDetailComponent },
  { path: 'Issue/:id', component: GoodsIssueDetailComponent },
  { path: ':id', component: InventoryRequestDetailComponent },
  { path: '', component: InventoryRequestListComponent },
];

@NgModule({
  declarations: [
    ProductsComponent,
    InventoryRequestCreateComponent,
    InventoryRequestListComponent,
    InventoryRequestDetailComponent,
    GoodsReceiptListComponent,
    GoodsIssueListComponent,
    GoodsIssueDetailComponent,
    GoodsReceiptDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule,
    RouterModule.forChild(routes)
  ]
})
export class InventoryModule { }
