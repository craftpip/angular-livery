import {Component, EventEmitter, Input, NgModule, OnInit, Output} from '@angular/core';
import {FileItem, FileUploader} from "ng2-file-upload";


@Component({
    selector: 'file-uploader',
    template: `
        <div class="drop-zone"
             ng2FileDrop=""
             [ngClass]="{'has-file-over': hasFileOver}"
             [uploader]="uploader"
             (click)="fileUploader.click()"
             (fileOver)="hasFileOver = $event">
            <div class="file-progress"
                 *ngIf="uploader.isUploading"
                 [style.width]="getUploadedPercent()+'%' ">

            </div>
            Drop files here or click to choose file
        </div>
        <input type="file"
               #fileUploader
               style="display: none"
               ng2FileSelect
               [uploader]="uploader"
               class="form-control form-control-sm">

        <div class="uploader-queue"
             *ngIf="uploader.queue.length">
            <div *ngFor="let q of uploader.queue"
                 class="uploader-item">
                
                <span class="pull-right"
                      (click)="q.cancel();q.remove()">
                    <i class="ft ft-delete"></i>
                </span>

                <div class="name">
                    {{q._file.name}}

                    <span *ngIf="q.isUploading">
                        (Uploading)
                    </span>
                </div>

            </div>
        </div>
    `,
})
export class FileUploaderComponent implements OnInit {
    public uploader: FileUploader;
    public _url: string;

    public hasFileOver: boolean = false;

    /**
     * Url to upload the file.
     */
    @Input('url')
    set urlString(url) {
        if (this._url)
            console.warn('Ignored set url in file uploader');

        this._url = url;

        if (this.uploader) {
            // if uploader is initialised, use same object
            this.uploader.setOptions({
                url: this._url,
            });
        }
    }

    /**
     * Data to be sent when file is uploaded.
     */
    @Input()
    postData: any;

    /**
     * Emit changes to files array when file is uploaded
     * @type {EventEmitter<any>}
     */
    @Output()
    filesUploaded: EventEmitter<any> = new EventEmitter();

    /**
     * Emit state of uploader, if its uploading or not
     * @type {EventEmitter<boolean>}
     */
    @Output()
    isUploading: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {

    }

    uploading: boolean = false;

    previousUpdatedPercent: any = 0;

    getUploadedPercent() {
        let u = this.uploader.progress;

        if (isNaN(u)) {
            return 0;
        } else {
            if (u == 0) {
                return this.previousUpdatedPercent;
            } else {
                this.previousUpdatedPercent = u;
                return u;
            }
        }
    }

    /**
     * The parent component can remove from the responses
     * @type {any[]}
     */
    @Input('files')
    responses: any[] = [];

    ngOnInit() {
        this.uploader = new FileUploader({
            url: this._url,
        });
        this.uploader.onBuildItemForm = (file: FileItem, form: any) => {
            /**
             * Append post data to the form.
             */
            for (let key of Object.keys(this.postData)) {
                form.append(key, this.postData[key]);
            }
        };
        this.uploader.onBeforeUploadItem = (file: FileItem) => {
            this.uploading = true;
            this.isUploading.emit(this.uploading);
        };
        this.uploader.onCompleteItem = (file: FileItem, r: any) => {
            this.uploading = false;
            this.isUploading.emit(this.uploading);
            console.log(r, file);
            this.uploader.removeFromQueue(file);

            let response;
            try {
                response = JSON.parse(r);
            } catch (e) {
                response = r;
            }

            // store the file and its response in responses
            this.responses.push({
                file: file,
                response: response,
            });

            this.filesUploaded.emit(this.responses);
        };
        this.uploader.onAfterAddingFile = (file: FileItem) => {
            this.uploader.uploadAll();
        };
    }
}