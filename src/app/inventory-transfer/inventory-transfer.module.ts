import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';

import { InventoryTransferDetailComponent } from './inventory-transfer-detail/inventory-transfer-detail.component';
import { InventoryTransferListComponent } from './inventory-transfer-list/inventory-transfer-list.component';
import { InventoryTransferRequestCreateComponent } from './inventory-transfer-request-create/inventory-transfer-request-create.component';
import { InventoryTransferRequestDetailComponent } from './inventory-transfer-request-detail/inventory-transfer-request-detail.component';
import { InventoryTransferRequestListComponent } from './inventory-transfer-request-list/inventory-transfer-request-list.component';
import { ModalModule } from '../common/modal/modal.module';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: 'Request/Create', component: InventoryTransferRequestCreateComponent },
  { path: 'Request', component: InventoryTransferRequestListComponent },
  { path: 'Request/:id', component: InventoryTransferRequestDetailComponent },
  { path: '', component: InventoryTransferListComponent },
  { path: ':id', component: InventoryTransferDetailComponent },
];

@NgModule({
  declarations: [
    InventoryTransferRequestCreateComponent,
    InventoryTransferRequestListComponent,
    InventoryTransferRequestDetailComponent,
    InventoryTransferDetailComponent,
    InventoryTransferListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ModalModule,
    DataTablesModule,
    RouterModule.forChild(routes)
  ]
})
export class InventoryTransferModule { }
