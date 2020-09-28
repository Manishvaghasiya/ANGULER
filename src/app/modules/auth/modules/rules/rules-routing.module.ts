import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RulesComponent } from './components';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        data: {
          title: 'Rules',
          urls: [
            { title: 'Rules', url: 'rules' },
            { title: 'Rules' }
          ]
        },
        component: RulesComponent
      }
    ]
  }
];

export const RulesRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
