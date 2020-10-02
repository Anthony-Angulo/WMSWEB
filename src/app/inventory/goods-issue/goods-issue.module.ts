import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';

import { GoodsIssueDetailComponent } from './goods-issue-detail/goods-issue-detail.component';
import { GoodsIssueListComponent } from './goods-issue-list/goods-issue-list.component';

const routes: Routes = [
  { path: '', component: GoodsIssueListComponent },
  { path: ':id', component: GoodsIssueDetailComponent },
];

@NgModule({
  declarations: [
    GoodsIssueListComponent,
    GoodsIssueDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule,
    RouterModule.forChild(routes)
  ]
})
export class GoodsIssueModule { }
