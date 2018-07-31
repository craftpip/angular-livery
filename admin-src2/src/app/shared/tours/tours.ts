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
                title: "Duration selector",
                content: "Selects date according to This day, this week, this month, or the last 7 days, last 30 days." +
                "This component is modular so it can be easily added in other pages.",
                target: "tour-duration",
                placement: "bottom"
            },
            {
                title: "Date range",
                content: "One picker to select the from and to dates with ease",
                target: "tour-range-selector",
                placement: "bottom"
            },
            {
                title: "More elements",
                content: "Show more elements for search",
                target: "tour-advanced-search",
                placement: "bottom"
            },
            {
                title: "Progress element",
                content: "Dynamic element to show progress between states, It can dynamically adjust width with multiple steps",
                target: "tour-progress-bar",
                placement: "bottom"
            },
            {
                title: "Tabs",
                content: "Demonstrating tabs",
                target: "tour-tabs",
                placement: "right"
            },
            {
                title: "File uploader",
                content: "Custom file uploader with dropzone + click to upload, can add multiple files in queue to upload, + validation for file inputs, this uploader accepts jpg, png and gif file formats",
                target: "tour1",
                placement: "right"
            },
            {
                title: "Auto complete input",
                content: "As soon as you type something, it will suggest you with matching results",
                target: "tour-username",
                placement: "right"
            },
            {
                title: "Native html elements",
                content: "Rest all of the form elements are native html input fields",
                target: "tour-native-elements",
                placement: "bottom"
            },
            {
                title: "Multiple tags",
                content: "type and press enter to add your entry. This field does not allow duplicates, but is editable!",
                target: "tour-tag-input",
                placement: "right"
            },
            {
                title: "Date & time picker",
                content: "This element lets you pick ur date + time. Select the date first and time picker will be displayed. Only time picker can also be shown",
                target: "tour-date1",
                placement: "left"
            },
            {
                title: "Custom checkbox & radio buttons",
                content: "Custom simple checkboxes and radio buttons",
                target: "tour-checkbox",
                placement: "top"
            },
            {
                title: "Validation!",
                content: "Each element, custom and native support validation. Each element is customized to match the overall in terms of design and code" +
                "Click on the submit button without filling in the data and all errors will be shown, or interact with one element to see its error",
                target: "tour-save-button",
                placement: "top"
            },
        ],
        showCloseButton: true,
        showNextButton: true,
        showPrevButton: true,
    }
};