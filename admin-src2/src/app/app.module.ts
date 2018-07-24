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
import {HttpHelper} from "./shared/helper.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {AgGridModule} from "ag-grid-angular";
import {JConfirm} from "./shared/jconfirm";
import {TagInputModule} from "ngx-chips";
import {FlatpickrModule} from "angularx-flatpickr";


@NgModule({
    declarations: [
        AppComponent,
        FullLayoutComponent,
        ContentLayoutComponent,
        LoginComponent
    ],
    imports: [
        BrowserAnimationsModule,
        AppRoutingModule,
        SharedModule,
        NgbModule.forRoot(),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        AgGridModule.withComponents([]),
        TagInputModule,
        FlatpickrModule.forRoot()
    ],
    providers: [
        AuthService,
        HttpHelper,
        AuthGuard,
        JConfirm,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}