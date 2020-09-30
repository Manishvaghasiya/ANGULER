import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from '../../core/guards';

const routes: Routes = [{
  path: '',
  component: FullComponent,
  children: [
    { path: '', redirectTo: 'templates', pathMatch: 'full' },
    // {
    //   path: 'dashboard',
    //   // canActivate: [AuthGuard],
    //   loadChildren: () => import(`./modules/dashboard/dashboard.module`).then(m => m.DashboardModule)
    // },
    {
      path: 'templates',
      // canActivate: [AuthGuard],
      loadChildren: () => import(`./modules/templates/templates.module`).then(m => m.TemplatesModule)
    },
    {
      path: 'parameters',
      // canActivate: [AuthGuard],
      loadChildren: () => import(`./modules/parameter/parameters.module`).then(m => m.ParametersModule)
    },
    {
      path: 'conditions',
      // canActivate: [AuthGuard],
      loadChildren: () => import(`./modules/conditions/conditions.module`).then(m => m.ConditionsModule)
    },
    {
      path: 'rules',
      // canActivate: [AuthGuard],
      loadChildren: () => import(`./modules/rules/rules.module`).then(m => m.RulesModule)
    }
  ]
}];

export const AuthRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
