import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { ParametersComponent } from './components';
import { ParametersRoutingModule } from './parameters-routing.module';
import { TemplatePipe } from '../../../../core/pipe/template.pipe';

@NgModule({
  declarations: [
    ParametersComponent,
    TemplatePipe
  ],
  imports: [
    CommonModule,
    ParametersRoutingModule,
    SharedModule
  ]
})
export class ParametersModule { }
