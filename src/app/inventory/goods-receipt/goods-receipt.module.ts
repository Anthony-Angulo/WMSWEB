import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';

import { GoodsReceiptDetailComponent } from './goods-receipt-detail/goods-receipt-detail.component';
import { GoodsReceiptListComponent } from './goods-receipt-list/goods-receipt-list.component';

const routes: Routes = [
  { path: '', component: GoodsReceiptListComponent },
  { path: ':id', component: GoodsReceiptDetailComponent },
];

@NgModule({
  declarations: [
    GoodsReceiptListComponent,
    GoodsReceiptDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule,
    RouterModule.forChild(routes)
  ]
})
export class GoodsReceiptModule { }
