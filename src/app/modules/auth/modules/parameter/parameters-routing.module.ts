import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParametersComponent } from './components';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        data: {
          title: 'Parameters',
          urls: [
            { title: 'Parameters', url: 'parameters' },
            { title: 'Parameters' }
          ]
        },
        component: ParametersComponent
      }
    ]
  }
];

export const ParametersRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
