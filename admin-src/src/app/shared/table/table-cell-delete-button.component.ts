import {ICellEditorAngularComp} from "ag-grid-angular";
import {Component} from "@angular/core";
import {TableCellButtonCallback} from "./table-cell-button-callback";

@Component({
    selector: 'cell-delete',
    template: `
        <span class="cursor-pointer">
            <i (click)="delete()"
               class="ft ft-delete"></i>
        </span>
    `,
})
export class TableCellDeleteButtonComponent implements ICellEditorAngularComp {
    params: any;

    agInit(params: any): void {
        this.params = params;
    }

    delete() {
        this.params.context.componentParent.deleteCell(<TableCellButtonCallback>{
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