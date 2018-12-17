/**
 * Store global variables here,
 * please do not commit this file if you've change the api_url,
 * ONLY commit if you have some new configs to add
 */

export var configs: ConfigInfo = {
    api_url: 'http://localhost/ibase-angular/api/',
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
    ],
    chartOptions: {
        column: {
            chart: {
                type: 'column',
                zoomType: 'xy',
                style: {"fontFamily": "Roboto", "fontSize": "9px"}
            },
            colors: [],
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: [],
                title: {
                    text: null,
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -0,
                y: 80,
                floating: true,
                borderWidth: 0,
                shadow: false
            },
            credits: {
                enabled: false,
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                }
            },
            series: []
        },
        pie: {
            chart: {
                // pinchType: false,
                // panning: false,
                zoomType: 'xy',
                // pinchType: '',
                // plotBackgroundColor: null,
                // plotBorderWidth: null,
                // plotShadow: false,
                type: 'pie',
                style: {"fontFamily": "Roboto", "fontSize": "9px"}
            },
            colors: [],
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            credits: {
                enabled: false,
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y:.0f}',
                        style: {
                            color: 'black'
                        }
                    },
                    showInLegend: true
                }
            },
            series: [],
        },
        line: {
            chart: {
                type: 'line',
                style: {"fontFamily": "Roboto", "fontSize": "9px"}
            },
            tooltip: {
                shared: true,
                crosshairs: true,
            },
            colors: [],
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: []
            },
            legend: {
                maxHeight: 100,
                navigation: {
                    style: {
                        fontSize: '15px',
                    },
                    arrowSize: 15,
                    animation: false,
                },
                floating: false,
                align: 'right',
                verticalAlign: 'bottom',
                itemDistance: 2,
            },
            credits: {
                enabled: false,
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            plotOptions: {
                series: {
                    connectNulls: true,
                },
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: true
                }
            },
            series: [],
        },
    }
};

/**
 * Please define your config properties here too,
 */
export interface ConfigInfo {
    api_url: string,
    colors: string[],
    chartOptions: {
        column?: any,
        pie?: any,
        line?: any,
    }
}