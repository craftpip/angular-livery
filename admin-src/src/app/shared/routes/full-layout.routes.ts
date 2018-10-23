import {Routes} from '@angular/router';

// Route for content layout with sidebar, navbar and footer
export const Full_ROUTES: Routes = [
    {
        path: 'home',
        loadChildren: './home/home.module#HomeModule'
    },
    {
        path: 'users',
        loadChildren: './users/users.module#UsersModule'
    },
    {
        path: 'demo',
        loadChildren: './demo/demo.module#DemoModule'
    },
    {
        path: 'languages',
        loadChildren: './language/language.module#LanguageModule'
    },
];