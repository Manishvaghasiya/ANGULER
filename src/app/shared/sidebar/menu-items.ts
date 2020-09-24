import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
    {
        path: '/dashboard',
        title: 'Dashboard',
        icon: 'mdi mdi-gauge',
        class: '',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: []
    },
    {
        path: '/templates',
        title: 'Templates',
        icon: 'mdi mdi-cube-outline',
        class: '',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: []
    },
    {
        path: '/parameters',
        title: 'Parameters',
        icon: 'mdi mdi-table-column-plus-after',
        class: '',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: []
    },
    {
        path: '/conditions',
        title: 'Conditions',
        icon: 'mdi mdi-view-dashboard',
        class: '',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: []
    }
];
