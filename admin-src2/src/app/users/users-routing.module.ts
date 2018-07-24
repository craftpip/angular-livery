import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { UsersAddComponent } from './users-add/users-add.component';

const routes: Routes = [
    {
        path: '',
        component: UsersComponent,
        data: {
            title: 'Listing users'
        },
    },
    {
        path: 'add',
        component: UsersAddComponent,
        data: {
            title: 'Create users'
        },
    },
    {
        path: 'edit/:id',
        component: UsersAddComponent,
        data: {
            title: 'Edit users'
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UsersRoutingModule {
}
