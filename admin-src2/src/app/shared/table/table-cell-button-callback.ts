import {ICellEditorAngularComp} from "ag-grid-angular";
import {Component} from "@angular/core";

/**
 * Interface to support callback when button is clicked inside ag grid
 */
export interface TableCellButtonCallback {
    data: any,
    rowIndex: number,
    colName: string,
}