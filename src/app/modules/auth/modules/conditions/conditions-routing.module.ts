import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConditionsComponent } from './components';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        data: {
          title: 'Conditions',
          urls: [
            { title: 'Conditions', url: 'conditions' },
            { title: 'Conditions' }
          ]
        },
        component: ConditionsComponent
      }
    ]
  }
];

export const ConditionsRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
