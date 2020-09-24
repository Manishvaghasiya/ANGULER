import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { TemplatesComponent } from './components';
import { TemplatesRoutingModule } from './templates-routing.module';

@NgModule({
  declarations: [
    TemplatesComponent
  ],
  imports: [
    CommonModule,
    TemplatesRoutingModule,
    SharedModule
  ]
})
export class TemplatesModule { }
