import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { WithoutFooterRoutingModule } from './without-footer-routing.module';


@NgModule({
  declarations: [
  
  ],
  imports: [
    CommonModule,

    RouterModule.forChild(WithoutFooterRoutingModule),
   
    ToastrModule.forRoot(),
    RouterModule
  
  ]
})
export class WithoutFooterModule { }
