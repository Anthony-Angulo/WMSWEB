import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { AccountModule } from '../../account/account.module';
import { AppRoutingModule } from '../../app-routing.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    AccountModule,
  ],
  exports: [
    HeaderComponent,
  ]
})
export class HeaderModule { }
