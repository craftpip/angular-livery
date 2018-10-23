import {ICellEditorAngularComp} from "ag-grid-angular";
import {Component} from "@angular/core";
import {Router} from '@angular/router';
import {TableCellButtonCallback} from "./table-cell-button-callback";

@Component({
    selector: 'cell-delete',
    template: `
        <span class="cursor-pointer">
            <i (click)="edit()"
               class="ft ft-edit-2"></i>
        </span>
    `,
})
export class TableCellEditButtonComponent implements ICellEditorAngularComp {
    params: any;

    agInit(params: any): void {
        this.params = params;
    }

    edit() {
        this.params.context.componentParent.editCell(<TableCellButtonCallback>{
            data: this.params.data,
            rowIndex: this.params.node.rowIndex,
            colName: this.params.colDef.headerName,
        });
    }

    getValue() {

    }

    refresh(): boolean {
        return false;
    }
}