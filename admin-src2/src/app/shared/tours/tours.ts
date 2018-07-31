import {TourOptions} from "./tours.service";

export var tours: {
    [key: string]: TourOptions,
} = {
    '/users': {
        id: 'users-tour',
        steps: []
    },
    '/demo/tabs': {
        id: "demo-tabs",
        steps: [
            {
                title: "My Header",
                content: "This is the header of my page.",
                target: "tour1",
                placement: "right"
            },
            {
                title: "My content",
                content: "Here is where I put my content.",
                target: 'tour2',
                placement: "left",
            },
            {
                title: "Radio buttons",
                content: "Here is where I put my content.",
                target: 'tour3',
                placement: "top",
            },
            {
                title: "Radio buttons",
                content: "Here is where I put my content.",
                target: 'tour4',
                placement: "bottom",
            }
        ],
        showCloseButton: true,
        showNextButton: true,
        showPrevButton: true,
    }
};