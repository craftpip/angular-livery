import {
    Directive, ElementRef, AfterViewChecked,
    Input, HostListener, NgModule, Renderer2, OnInit
} from '@angular/core';

declare const $: any;

@Directive({
    selector: '[cardCollapse]',
})
export class CardCollapseDirective implements OnInit {
    nativeElement: HTMLElement;

    _isOpen: boolean = false;
    _isStarted: boolean = false;

    @Input('isOpen')
    set isOpen(a) {
        a = !!a;
        this._isOpen = a;

        if (this._isStarted) {
            if (a) {
                this.toggleOpen();
            } else {
                this.toggleClose();
            }
        }
    }

    constructor(private el: ElementRef, public renderer: Renderer2) {
        this.nativeElement = <HTMLElement>el.nativeElement;
        // console.log('hey');
    }

    $title;
    $block;
    $el;
    $header;
    $icon;

    ngOnInit() {
        let $el = $(this.nativeElement);

        this.$el = $el;
        this.$title = $el.find('.card-title');
        this.$block = $el.find('.card-block');
        this.$header = $el.find('.card-header');
        this.$icon = $el.find('.card-collapse-toggle');

        if (this._isOpen) {
            this.toggleOpen();
        } else {
            this.toggleClose();
        }
        // this.$block.css({
        //     'height': this.$block[0].scrollHeight + 'px'
        // });

        this.$title.on('click', () => {
            this.toggle();
        });
        this.$icon.on('click', () => {
            this.toggle();
        })

        this._isStarted = true;
    }

    toggleOpen() {
        this.$header.removeClass('hide-block');
        this.$block.css({
            'height': this.$block[0].scrollHeight + 'px'
        });
    }

    toggleClose() {
        this.$header.addClass('hide-block');
        this.$block.css({
            'height': '60px'
        });
    }

    toggle() {
        if (this.$header.hasClass('hide-block')) {
            this.toggleOpen();
        } else {
            this.toggleClose();
        }
    }

    // @HostListener('click')
    // onClick() {
    //     alert('click');
    // console.log(this.nativeElement);
    // this.toggle();
    // }
}
