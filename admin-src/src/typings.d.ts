/* SystemJS module definition */
declare var module: NodeModule;

interface NodeModule {
    id: string;
}

declare module 'quill';
declare module 'leaflet';
declare module 'perfect-scrollbar';
declare module 'screenfull';
declare module 'd3-shape';

interface String {
    contains(c: string): boolean;

    equals(c: string): boolean;

    lower(): string;

    upper(): string;

    in(...a): boolean;

    notIn(...a): boolean;

    percent(a): string;

    between(a, b): boolean;

    dateBeforeToday(): boolean;
}