import {NgModule} from '@angular/core';
import {RouterModule, Routes, PreloadAllModules} from '@angular/router';

import {FullLayoutComponent} from "./layouts/full/full-layout.component";
import {ContentLayoutComponent} from "./layouts/content/content-layout.component";

import {Full_ROUTES} from "./shared/routes/full-layout.routes";
import {CONTENT_ROUTES} from "./shared/routes/content-layout.routes";

import {AuthGuard} from './shared/auth/auth-guard.service';
import {LoginComponent} from "./login/login.component";

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'login', // login
        pathMatch: 'full',
    },
    {
        path: '',
        component: FullLayoutComponent,
        data: {title: 'full Views'},
        children: Full_ROUTES,
        canActivate: [AuthGuard]
    },
    {
        path: '',
        component: ContentLayoutComponent,
        data: {title: 'content Views'},
        children: CONTENT_ROUTES,
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
        data: {
            title: 'Login',
        }
    }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {

}
