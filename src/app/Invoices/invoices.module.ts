import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { InvoiceBurnComponent } from './invoice-burn/invoice-burn.component';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from '../account/guards/auth.guard';

const routes: Routes = [
  { path: 'burns', 
  component: InvoiceBurnComponent,
  canActivate: [AuthGuard]
}
,
  ];

@NgModule({
  declarations: [InvoiceBurnComponent],
  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule,
    RouterModule.forChild(routes)

  ]
})
export class InvoicesModule { }
