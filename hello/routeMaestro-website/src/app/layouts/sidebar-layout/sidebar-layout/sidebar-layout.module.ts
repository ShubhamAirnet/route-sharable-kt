import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { SidebarLayoutRoutingModule } from './sidebar-layout-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    RouterModule.forChild(SidebarLayoutRoutingModule),
   
    ToastrModule.forRoot(),
    RouterModule
  
  ]
})
export class SidebarLayoutModule { }
