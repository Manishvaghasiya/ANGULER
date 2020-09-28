import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { RulesComponent } from './components';
import { RulesRoutingModule } from './rules-routing.module';

@NgModule({
  declarations: [
    RulesComponent
  ],
  imports: [
    CommonModule,
    RulesRoutingModule,
    SharedModule
  ]
})
export class RulesModule { }
