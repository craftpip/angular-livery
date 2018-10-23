import {AfterViewInit, Component, Input} from '@angular/core';
import {CardsComponent, DashboardCard} from "../../cards.component";
import {Database} from "../../../../shared/database.service";
import {Utils} from "../../../../shared/helper.service";
import {configs} from "../../../../shared/configs";
import {Chart} from "angular-highcharts";
import {TableHeaders} from "../card.component";

@Component({
    selector: 'graph-donut',
    templateUrl: 'donut.html',
})
export class DonutGraphComponent implements AfterViewInit {

    card: DashboardCard;
    tableName: string = '';
    errorMsg: string = '';
    private chart: Chart = new Chart({
        chart: {
            // pinchType: false,
            // panning: false,
            // pinchType: '',
            // plotBackgroundColor: null,
            // plotBorderWidth: null,
            // plotShadow: false,
            type: 'pie',
            polar: false,
            zoomType: 'xy',
        },
        colors: configs.colors,
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
    });

    constructor(
        public database: Database,
        public utils: Utils,
    ) {
        this.card = this.utils.copy(CardsComponent.defaultCardMock);
    }

    tableHeaders: TableHeaders[] = [];

    @Input('tableHeaders')
    set _tableHeaders(headers: TableHeaders[]) {
        this.tableHeaders = headers;
    }

    @Input('card')
    set _card(card: DashboardCard) {
        this.card = card;
        this.tableName = this.utils.hashTableName(this.card.table);
    }

    queryResponse: any = [];

    query(): Promise<DashboardCard> {
        this.errorMsg = '';
        return new Promise((resolve, reject) => {
            let legendColumn = this.card.options.viewOptions.donut.legend;
            let valueColumn = this.card.options.viewOptions.donut.value;
            let valueAggregator = this.card.options.viewOptions.donut.valueAggregator;

            this.database.execute(`
                    select ${legendColumn} as l, 
                    ${valueAggregator}(${valueColumn}) as v 
                    from ${this.tableName} 
                    group by ${this.tableName}.${legendColumn}  
                `).then((response) => {
                this.queryResponse = response;
                resolve();
            }).catch(err => {
                reject(err);
            });
        });
    }

    render(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.chart.ref)
                return;

            let series = [];

            // let total = this.data.reduce((ac, v) => {
            //     return ac + v.value;
            // });

            let total = 0;
            for (let v of this.queryResponse) {
                total += v.v;
            }

            let seriesOneData = [];
            let hasInvalidData = false;

            for (let i of this.queryResponse) {
                let y = (100 * i.v) / total;
                if ((isNaN(y) || y < 0)) {
                    alert(`Error\nColumn selected as value has an invalid numeric value, please select the right column to view graph`);
                    hasInvalidData = true;
                    break;
                }
                seriesOneData.push({
                    name: i.l,
                    // y: y,
                    y: i.v,
                });
            }

            if (hasInvalidData)
                return;


            series.push({
                name: 'hey' + Math.floor(Math.random() * 9),
                colorByPoint: true,
                type: 'pie',
                data: seriesOneData,
                innerSize: '50%',
            });

            this.chart.removeSerie(0);
            this.chart.addSerie(series[0]);
        })
    }

    ngAfterViewInit() {
        this.query().then(() => {
            this.render().then(() => {
                // done
            });
        });
    }
} 