import {Injectable, ApplicationRef, ComponentFactoryResolver, Injector, Component, Type} from "@angular/core";

declare const jQuery: any;
declare const $: any;

@Injectable()
export class JConfirm {
    public instance: JConfirmInstance;

    constructor(private resolver: ComponentFactoryResolver,
                private injector: Injector,
                private app: ApplicationRef) {

    }

    confirm(options: JConfirmOptions): JConfirmInstance {
        console.log(options);

        let newNode;
        if (options.component) {
            newNode = document.createElement('div');
            options.content = $(newNode);
            options.buttons = false;
        }

        if (!options.buttons)
            options.buttons = false;

        let jc: any = jQuery.confirm(options);

        if (options.component) {
            jc.onOpenBefore = () => {
                jc.showLoading(true);
            };
            let factory = this.resolver.resolveComponentFactory(options.component);
            const ref: any = factory.create(this.injector, [], newNode);
            ref.instance.jcInstance = jc;
            ref.instance.jcData = options.componentData;
            this.app.attachView(ref.hostView);

            jc.onContentReady = () => {
                jc.hideLoading(true);
                if (typeof ref.instance.jcOnReady === 'function')
                    ref.instance.jcOnReady();
            };
        }

        return jc;
    }
}

export interface JConfirmButton {
    text?: string,
    btnClass?: string,

    action?(JConfirmButton): void | boolean,

    keys?: string[],
    isHidden?: boolean,
    isDisabled?: boolean,

    setText?(text: string),

    addClass?(className: string),

    removeClass?(className: string),

    disable?(),

    enable?(),

    show?(),

    hide?(),
}

export interface JConfirmOptions {
    title?: any,
    titleClass?: string,
    type?: string,
    typeAnimated?: boolean,
    draggable?: boolean,
    dragWindowGap?: boolean,
    dragWindowBorder?: boolean,
    animateFromElement?: boolean,
    smoothContent?: boolean,
    component?: Type<any>,
    componentData?: any,
    content?: string,
    buttons?: {
        [key: string]: JConfirmButton
    } | boolean,

    contentLoaded?(data: any, status: any, xhr: any),

    icon?: string,
    lazyOpen?: boolean,
    bgOpacity?: any,
    theme?: string,
    animation?: string,
    closeAnimation?: string,
    animationSpeed?: number,
    animationBounce?: number,
    rtl?: boolean,
    container?: string,
    containerFluid?: boolean,
    backgroundDismiss?: boolean,
    backgroundDismissAnimation?: string,
    autoClose?: boolean,
    closeIcon?: any,
    closeIconClass?: string,
    watchInterval?: number,
    columnClass?: string,
    boxWidth?: string,
    scrollToPreviousElement?: boolean,
    scrollToPreviousElementAnimate?: boolean,
    useBootstrap?: boolean,
    offsetTop?: number,
    offsetBottom?: number,
    bootstrapClasses?: {
        container: string,
        containerFluid: string,
        row: string,
    },

    onContentReady?(),

    onOpenBefore?(),

    onOpen?(),

    onClose?(data?: any),

    onDestroy?(),

    onAction?(),
}

export interface JConfirmInstance {
    setTitle(title: string),

    setIcon(title: string),

    setContent(content: any),

    setContentPrepend(content: any),

    setContentAppend(content: any),

    setType(typeClass: string),

    showLoading(disableButtons: boolean),

    hideLoading(enableButtons: boolean),

    close(),

    open(),

    toggle(),

    hilight(),

    setBoxWidth(width: string),

    setColumnClass(className: string),

    setTheme(themeName: string),

    isClosed(): boolean,

    isOpen(): boolean,
}

export interface JConfirmInstanceComponent {
    jcInstance?: JConfirmInstance
    jcData?: any,

    jcOnButtonAction?(),

    jcOnReady?(),

    jcOnClose?(),
}