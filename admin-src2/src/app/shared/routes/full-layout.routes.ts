import {Routes, RouterModule} from '@angular/router';

//Route for content layout with sidebar, navbar and footer
export const Full_ROUTES: Routes = [
    // {
    //     path: 'categories',
    //     loadChildren: './categories/categories.module#CategoriesModule'
    // },
    // {
    //     path: 'fields',
    //     loadChildren: './fields/fields.module#FieldsModule'
    // },
    // {
    //     path: 'sub-categories',
    //     loadChildren: './sub-categories/sub-categories.module#SubCategoriesModule'
    // },
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
    // {
    //     path: 'subscriptions',
    //     loadChildren: './subscriptions/subscriptions.module#SubscriptionsModule'
    // },
    // {
    //     path: 'full-layout',
    //     loadChildren: './pages/full-layout-page/full-pages.module#FullPagesModule'
    // }
];