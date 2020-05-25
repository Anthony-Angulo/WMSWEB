import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './account/guards/auth.guard';


const routes: Routes = [
  { path: 'login', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'purchaseOrder', loadChildren: () => import('./purchase-order/purchase-order.module').then(m => m.PurchaseOrderModule)},
  { path: 'order', loadChildren: () => import('./order/order.module').then(m => m.OrderModule)},
  {
    path: 'InventoryTransfer',
    loadChildren: () => import('./inventory-transfer/inventory-transfer.module').then(m => m.InventoryTransferModule)
  },
  {
    path: 'Inventory',
    loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule)
  },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
