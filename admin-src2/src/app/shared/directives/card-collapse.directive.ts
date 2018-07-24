import {
    Directive, ElementRef, AfterViewChecked,
    Input, HostListener, NgModule, Renderer2
} from '@angular/core';

@Directive({
    selector: '[cardCollapse]',
})
export class CardCollapseDirective {
    nativeElement: HTMLElement;

    constructor(private el: ElementRef, public renderer: Renderer2) {
        this.nativeElement = <HTMLElement>el.nativeElement;
        console.log('hey');
    }

    // ngAfterViewChecked() {
    //     console.log('hey');
    // }

    @HostListener('click')
    onClick() {
        alert('click')
    }
}
