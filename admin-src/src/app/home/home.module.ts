import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {MatchHeightModule} from "../shared/directives/match-height.directive";

import {HomeComponent} from "./home.component";
import {HomeRoutingModule} from "./home-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ChartModule, HIGHCHARTS_MODULES} from 'angular-highcharts';
import * as drildown from 'highcharts/highcharts-more.src';
import {SharedModule} from "../shared/shared.module";
import {CardsComponent} from "./cards/cards.component";
import {CardComponent} from "./cards/card/card.component";
import {TableGraphComponent} from "./cards/card/table/table";
import {PieGraphComponent} from "./cards/card/pie/pie";
import {DonutGraphComponent} from "./cards/card/donut/donut";
import {LineGraphComponent} from "./cards/card/line/line";
import {BarGraphComponent} from "./cards/card/bar/bar";
import {ColumnGraphComponent} from "./cards/card/column/column";
import {CountGraphComponent} from "./cards/card/count/count";
import {DragulaModule} from "ng2-dragula";

@NgModule({
    imports: [
        CommonModule,
        HomeRoutingModule,
        MatchHeightModule,
        FormsModule,
        ReactiveFormsModule,
        ChartModule,
        SharedModule,
        DragulaModule.forRoot(),
    ],
    exports: [],
    declarations: [
        HomeComponent,
        CardsComponent,
        CardComponent,
        TableGraphComponent,
        PieGraphComponent,
        DonutGraphComponent,
        LineGraphComponent,
        BarGraphComponent,
        ColumnGraphComponent,
        CountGraphComponent,
    ],
    providers: [{
        provide: HIGHCHARTS_MODULES, useFactory: () => [drildown]
    }],
})
export class HomeModule {
}
