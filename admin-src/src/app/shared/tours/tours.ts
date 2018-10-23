import {TourOptions} from "./tours.service";

export var tours: {
    [key: string]: TourOptions,
} = {
    '/home': {
        id: 'home-tour',
        steps: [
            {
                title: 'Cards',
                content: 'Standard cards to show important information',
                target: 'tour-card1',
                placement: 'bottom',
            },
            {
                title: 'Cards loading',
                content: 'This can be used when cards call their different api, and data cant be shown until the api loading has finished',
                target: 'tour-card-loading',
                placement: 'bottom',
            },
        ],
    },
    '/users': {
        id: 'users-tour',
        steps: [
            {
                title: 'Table toolbar',
                content: 'Actions to be take on the table, select a row in the table and edit/delete buttons will appear. Showing actions only when its available.',
                target: 'tour-table-toolbar',
                placement: 'bottom',
            },
            {
                title: 'AgTable',
                content: 'The best table framework',
                target: 'tour-table',
                placement: 'top',
            },
            {
                title: 'Sort & Save state',
                content: 'Move the columns to the left and right, and we will save the state of the order of columns. Refresh and see the state be as you arranged it',
                target: 'tour-table-sorting',
                placement: 'right',
            },
            {
                title: 'Order and filter',
                content: 'Click on the column name to filter it, or click on the bars icon to show filter options',
                target: 'tour-table-filter',
                placement: 'bottom',
            },
            {
                title: 'Quick edit panel',
                content: 'Click on the edit button icon in any row, this will display a quick form to edit information without changing pages.',
                target: 'tour-quick-edit',
                placement: 'bottom',
            },
            {
                title: 'Custom alert dialog',
                content: 'Click on the delete button icon in any row, this will display a confirmation asking if to delete the row, BUT it has a countdown if the user doesnt take a action before 6 seconds the confirmation will be cancelled.',
                target: 'tour-quick-delete',
                placement: 'bottom',
            },
        ],
    },
    '/users/add': {
        id: 'users-add-tour',
        steps: [
            {
                title: 'Elegant card collapse',
                content: 'Click to toggle collapse of card, on collapse the content does not hide completely but shows hint of input elements',
                target: 'tour-card-header',
                placement: 'bottom',
            },
            {
                title: 'Card header fields',
                content: 'Card headers support fields like button, input and select',
                target: 'tour-card-collapse',
                placement: 'bottom',
            },
            {
                title: 'Loading indicator in card',
                content: 'Click here to toggle the loading for card, loading is also supported for cards when the card is collapsed',
                target: 'tour-toggle-loading',
                placement: 'left',
            },
            {
                title: 'Arrow animation',
                content: 'This toggles the card collapse too',
                target: 'tour-card-arrow',
                placement: 'left',
            },
        ]
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
    },
    '/demo/calendar': {
        id: "demo-calendar",
        steps: [
            {
                title: "Date navigation",
                content: "Date through next and previous dates or months",
                target: "tour-date-navigation",
                placement: "bottom"
            },
            {
                title: "Calendar types",
                content: "The calendar supports view for month, week and days",
                target: "tour-date-type",
                placement: "left",
            },
            {
                title: "Events",
                content: "An event can span over multiple days by its start and end timestamps",
                target: "tour-calendar-events",
                placement: "bottom",
            },
            {
                title: "Event details",
                content: "When clicking on the calendar date that has events, it will open a kitchen sink that lists the events. Custom buttons can be added for actions to edit/remove/add events",
                target: "tour-calendar-sink",
                placement: "bottom",
            },
        ],
    }
};