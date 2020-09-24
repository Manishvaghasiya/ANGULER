import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { ParametersComponent } from './components';
import { ParametersRoutingModule } from './parameters-routing.module';

@NgModule({
  declarations: [
    ParametersComponent
  ],
  imports: [
    CommonModule,
    ParametersRoutingModule,
    SharedModule
  ]
})
export class ParametersModule { }
