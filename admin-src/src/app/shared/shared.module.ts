import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {FooterComponent} from "./footer/footer.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {ToggleFullscreenDirective} from "./directives/toggle-fullscreen.directive";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FileUploaderComponent} from "./uploader/file-uploader.component";
import {FileUploadModule} from "ng2-file-upload";
import {DateRangeSelectorDirective} from "./directives/date-selector.directive";
import {AutoCompleteModule, ColorPickerModule, DropdownModule, EditorModule, InputMaskModule, KeyFilterModule, MultiSelectModule} from "primeng/primeng";
import {CardCollapseDirective} from "./directives/card-collapse.directive";
import {QuickPanelModule} from "./directives/quick-panel.directive";
import {ChatComponent} from "../chat/chat.component";
import {DateFormatPipe, SafeHtmlPipe} from "./helper.pipe";
import {ChatGroupInfoComponent} from "../chat/group/chat-group-info.component";
import {LanguagePipe} from "./language.service";
import {ChartModule} from "angular-highcharts";
import {DragulaModule} from "ng2-dragula";

/**
 * This is a shared module,
 * create all ur classes and include it here.
 * and add this module to every module you create
 */
@NgModule({
    exports: [
        CommonModule,
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        ToggleFullscreenDirective,
        NgbModule,
        FileUploaderComponent,
        DateRangeSelectorDirective,
        FileUploadModule,
        ColorPickerModule,
        DropdownModule,
        EditorModule,
        InputMaskModule,
        CardCollapseDirective,
        QuickPanelModule,
        AutoCompleteModule,
        ChatComponent,
        ChatGroupInfoComponent,
        DateFormatPipe,
        SafeHtmlPipe,
        LanguagePipe,
        ChartModule,
        DragulaModule,
        KeyFilterModule,
        MultiSelectModule,
    ],
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        FileUploadModule,
        ColorPickerModule,
        DropdownModule,
        EditorModule,
        InputMaskModule,
        QuickPanelModule,
        AutoCompleteModule,
        ChartModule,
        DragulaModule.forRoot(),
        KeyFilterModule,
        MultiSelectModule,
    ],
    declarations: [
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        ToggleFullscreenDirective,
        FileUploaderComponent,
        DateRangeSelectorDirective,
        CardCollapseDirective,
        ChatComponent,
        ChatGroupInfoComponent,
        DateFormatPipe,
        SafeHtmlPipe,
        LanguagePipe,
    ],
    providers: [

    ]
})
export class SharedModule {
}
