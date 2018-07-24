import {
    Directive, ElementRef, AfterViewChecked,
    Input, HostListener, NgModule, Renderer2
} from '@angular/core';

@Directive({
    selector: '[quickPanel]'
})
export class QuickPanelDirective implements AfterViewChecked {

    public _open: boolean = false;
    public nativeElement: HTMLElement;

    @Input()
    set quickPanel(param) {
        this._open = !!param;

        if (this._open) {
            this.renderer.addClass(this.nativeElement, 'open');
        } else {
            this.renderer.removeClass(this.nativeElement, 'open');
        }
    }

    constructor(private el: ElementRef, public renderer: Renderer2) {
        this.nativeElement = <HTMLElement>el.nativeElement;
        // renderer.addClass(ne, 'hello');
        // console.log(ne);

        document.getElementsByClassName('main-panel')[0].addEventListener('scroll', (e) => {
            this.positionDiv(this.el);
        })
    }

    ngAfterViewChecked() {
        // call our matchHeight function here
        // this.matchHeights(this.el.nativeElement, this.matchHeight);
        // this.positionDiv(this.el);

    }

    timeout: any;

    positionDiv(el: any) {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = false;
        }

        this.setDiv();
        // this.timeout = setTimeout((e) => {
        // }, 0);
    }

    setDiv() {
        let qp = <any> document.getElementsByClassName('quick-panel')[0];
        let b = document.getElementsByClassName('main-panel')[0];
        let c = document.getElementsByClassName('navbar')[0];
        let height = window.document.body.clientHeight;
        qp.style.height = height + 'px';
        qp.style.top = (b.scrollTop - c.clientHeight) + 'px';
        console.log('setttt');
    }

    @HostListener('window:resize')
    onResize() {
        this.positionDiv(this.el);
    }
}

@NgModule({
    declarations: [QuickPanelDirective],
    exports: [QuickPanelDirective]
})

export class QuickPanelModule {
}