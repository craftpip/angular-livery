import {Injectable, NgZone} from "@angular/core";
import {tours} from "./tours";

declare const hopscotch: any;

export interface TourStep {
    title?: string,
    content?: string,
    target: string,
    placement: string,
    zindex?: number,
    showNextButton?: boolean,
    showPrevButton?: boolean,
    showSkip?: boolean,
}

export interface TourOptions {
    id?: string,
    steps?: TourStep[],
    scrollDuration?: number,
    smoothScroll?: boolean,
    showCloseButton?: boolean,
    showPrevButton?: boolean, // false
    showNextButton?: boolean, // true
}

export interface Tour {

}

@Injectable()
export class TourService {

    constructor(
        public ngZone: NgZone,
    ) {

    }

    /**
     * @param path
     * @returns {boolean | TourOptions}
     */
    isAvailableForPath(path) {
        if (typeof tours[path] === 'undefined') {
            return false;
        } else {
            return {...tours[path]};
        }
    }

    createForPath(path) {
        let routeTourOptions = this.isAvailableForPath(path);
        if (routeTourOptions) {
            this.create(routeTourOptions);
        }
    }

    /**
     * @param {TourOptions} options
     * @returns {Tour}
     */
    create(options: TourOptions) {
        // Start the tour!
        if (typeof options['showCloseButton'] === 'undefined')
            options['showCloseButton'] = true;
        if (typeof options['showNextButton'] === 'undefined')
            options['showNextButton'] = true;
        if (typeof options['showPrevButton'] === 'undefined')
            options['showPrevButton'] = true;

        return hopscotch.startTour(options);
    }
}

