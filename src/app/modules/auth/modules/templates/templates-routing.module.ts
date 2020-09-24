import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplatesComponent } from './components';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        data: {
          title: 'Templates',
          urls: [
            { title: 'Templates', url: 'templates' },
            { title: 'Templates' }
          ]
        },
        component: TemplatesComponent
      }
    ]
  }
];

export const TemplatesRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
