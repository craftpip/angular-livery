import {
    Directive, ElementRef, AfterViewChecked,
    Input, HostListener, NgModule, Renderer2, ContentChildren, OnInit
} from '@angular/core';

@Directive({
    selector: '[quickPanel]'
})
export class QuickPanelDirective implements OnInit {

    public _open: boolean = false;
    public nativeElement: HTMLElement;
    public _isReady: boolean = false;

    @Input('open')
    set quickPanel(param) {
        this._open = !!param;

        if (this._isReady) {
            if (this._open) {
                this.renderer.addClass(this.nativeElement, 'open');
            } else {
                this.renderer.removeClass(this.nativeElement, 'open');
            }
        }
    }

    constructor(private el: ElementRef,
                public renderer: Renderer2) {

        this.nativeElement = <HTMLElement>el.nativeElement;
        // $(this.nativeElement).children('.quick-panel-close')
        //     .on('click', () => {
        //         this.quickPanel(false);
        //     })
    }

    ngOnInit() {
        if (this._open) {
            this.renderer.addClass(this.nativeElement, 'open');
        } else {
            this.renderer.removeClass(this.nativeElement, 'open');
        }
        this._isReady = true;
    }

}

@NgModule({
    declarations: [QuickPanelDirective],
    exports: [QuickPanelDirective]
})

export class QuickPanelModule {
}