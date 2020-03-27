import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../../app-routing.module';
import { MenuSidebarComponent } from './menu-sidebar.component';


@NgModule({
  declarations: [MenuSidebarComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
  ],
  exports: [
    MenuSidebarComponent,
  ]
})
export class MenuSidebarModule { }
