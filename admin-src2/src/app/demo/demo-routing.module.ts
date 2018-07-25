import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CalendarComponent} from "./calendar/calendar.component";
import {List1Component} from "./list1/list1.component";
import {TabsComponent} from "./tabs/tabs.component";

const routes: Routes = [
    {
        path: 'calendar',
        component: CalendarComponent,
        data: {
            title: 'Listing users'
        },
    },
    {
        path: 'list1',
        component: List1Component,
        data: {
            title: 'Listing users'
        },
    },
    {
        path: 'tabs',
        component: TabsComponent,
        data: {
            title: 'Listing users'
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DemoRoutingModule {
}
