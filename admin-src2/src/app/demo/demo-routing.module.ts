import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CalendarComponent} from "./calendar/calendar.component";

const routes: Routes = [
    {
        path: 'calendar',
        component: CalendarComponent,
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
