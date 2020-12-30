import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { VendorsComponent } from '../vendors/vendors.component';
import { VendorsCreateComponent } from '../vendors/vendors-create/vendors-create.component';
import { FormsModule } from '@angular/forms';
import { VendorsEditComponent } from './vendors-edit/vendors-edit.component';

const routes: Routes = [
  { path: 'Create', component: VendorsCreateComponent},
  { path: ':id', component: VendorsEditComponent },
  { path: '', component: VendorsComponent }
]


@NgModule({
  declarations: [
    VendorsCreateComponent,
    VendorsComponent,
    VendorsEditComponent
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]

})
export class VendorsModule { }
