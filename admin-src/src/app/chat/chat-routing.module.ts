import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChatComponent} from "./chat.component";

const routes: Routes = [
    {
        path: '',
        component: ChatComponent,
        data: {
            title: 'Chat'
        },
    }
];

/**
 * @deprecated
 * This is not used for chat,
 * chat is loaded at the start with admin-src2/src/app/shared/shared.module.ts
 */
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ChatRoutingModule {
}
