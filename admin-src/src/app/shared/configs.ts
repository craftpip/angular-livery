/**
 * Store global variables here,
 * please do not commit this file if you've change the api_url,
 * ONLY commit if you have some new configs to add
 */
export var configs: ConfigInfo = {
    api_url: 'http://localhost/kpmg/api/',
    colors: [
        '#ff6b6b',
        '#1dd1a1',
        '#48dbfb',
        '#ff9ff3',
        '#feca57',
        '#00d2d3',
        '#54a0ff',
        '#5f27cd',
        '#c8d6e5',
        '#576574',
        '#1abc9c',
        '#2ecc71',
        '#3498db',
        '#9b59b6',
        '#34495e',
        '#f1c40f',
        '#e67e22',
        '#e74c3c',
        '#bdc3c7',
        '#95a5a6',
    ]
};

/**
 * Please define your config properties here too,
 */
export interface ConfigInfo {
    api_url: string,
    colors: string[],
}