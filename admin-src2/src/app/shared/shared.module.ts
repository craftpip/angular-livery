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
import {ColorPickerModule, Dropdown, DropdownModule, EditorModule} from "primeng/primeng";


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
        ColorPickerModule,
        DropdownModule,
        EditorModule, 
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
    ],
    declarations: [
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        ToggleFullscreenDirective,
        FileUploaderComponent,
        DateRangeSelectorDirective,
    ]
})
export class SharedModule {
}
