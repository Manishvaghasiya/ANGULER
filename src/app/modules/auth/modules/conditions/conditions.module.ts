import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { ConditionsComponent } from './components';
import { ConditionsRoutingModule } from './conditions-routing.module';

@NgModule({
  declarations: [
    ConditionsComponent
  ],
  imports: [
    CommonModule,
    ConditionsRoutingModule,
    SharedModule
  ]
})
export class ConditionsModule { }
