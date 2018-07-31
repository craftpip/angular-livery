import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {SharedModule} from "./shared/shared.module";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {ContentLayoutComponent} from "./layouts/content/content-layout.component";
import {FullLayoutComponent} from "./layouts/full/full-layout.component";

import {AuthService} from './shared/auth/auth.service';
import {AuthGuard} from './shared/auth/auth-guard.service';

import * as $ from 'jquery';
import {LoginComponent} from "./login/login.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppEvents, FormHelper, HttpHelper, Utils} from "./shared/helper.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {AgGridModule} from "ag-grid-angular";
import {JConfirm} from "./shared/jconfirm";
import {TagInputModule} from "ngx-chips";
import {FlatpickrModule} from "angularx-flatpickr";
import {CalendarModule} from "angular-calendar";
import {TableCellDeleteButtonComponent} from "./shared/table/table-cell-delete-button.component";
import {TableCellEditButtonComponent} from "./shared/table/table-cell-edit-button.component";
import {CardCollapseDirective} from "./shared/directives/card-collapse.directive";
import {QuickPanelModule} from "./shared/directives/quick-panel.directive";
import {FileUploaderComponent} from "./shared/uploader/file-uploader.component";
import {FileUploadModule} from "ng2-file-upload";
import {TourService} from "./shared/tours/tours.service";


@NgModule({
    declarations: [
        AppComponent,
        FullLayoutComponent,
        ContentLayoutComponent,
        LoginComponent,
        TableCellDeleteButtonComponent,
        TableCellEditButtonComponent,

    ],
    imports: [
        BrowserAnimationsModule,
        AppRoutingModule,
        SharedModule,
        NgbModule.forRoot(),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        AgGridModule.withComponents([
            TableCellDeleteButtonComponent,
            TableCellEditButtonComponent,
        ]),
        TagInputModule,
        FlatpickrModule.forRoot(),
        CalendarModule.forRoot(),
    ],
    providers: [
        AuthService,
        HttpHelper,
        AuthGuard,
        JConfirm,
        Utils,
        TourService,
        AppEvents,
        FormHelper,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}