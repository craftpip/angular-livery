import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatchHeightModule} from "../shared/directives/match-height.directive";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AgGridModule} from "ag-grid-angular";
import {FlatpickrModule} from "angularx-flatpickr";
import {DragDropModule} from 'primeng/dragdrop';
import {QuickPanelModule} from "../shared/directives/quick-panel.directive";
import {SharedModule} from "../shared/shared.module";
import {ChatRoutingModule} from "./chat-routing.module";
import {ChatComponent} from "./chat.component";
import {ChatGroupInfoComponent} from "./group/chat-group-info.component";

/**
 * @deprecated
 * This is not used for chat,
 * chat is loaded at the start with admin-src2/src/app/shared/shared.module.ts
 */
@NgModule({
    imports: [
        CommonModule,
        MatchHeightModule,
        NgbModule,
        FormsModule,
        AgGridModule.withComponents([]),
        FlatpickrModule.forRoot(),
        QuickPanelModule,
        SharedModule,
        ReactiveFormsModule,
        DragDropModule,
        ChatRoutingModule,
    ],
    exports: [],
    declarations: [
        ChatComponent,
        ChatGroupInfoComponent,
    ],
    providers: [],
})
export class ChatModule {
}
