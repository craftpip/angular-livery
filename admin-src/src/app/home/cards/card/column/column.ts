import {AfterViewInit, Component, Input} from '@angular/core';
import {CardsComponent, DashboardCard} from "../../cards.component";
import {Database} from "../../../../shared/database.service";
import {Utils} from "../../../../shared/helper.service";
import {configs} from "../../../../shared/configs";
import {Chart} from "angular-highcharts";
import {TableHeaders} from "../card.component";

@Component({
    selector: 'graph-column',
    templateUrl: 'column.html',
})
export class ColumnGraphComponent implements AfterViewInit {

    card: DashboardCard;
    tableName: string = '';
    errorMsg: string = '';
    public chart: Chart = new Chart({
        chart: {
            type: 'column',
            zoomType: 'xy',
        },
        colors: configs.colors,
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
            this._query(resolve, reject);
        });
    }

    async _query(resolve, reject) {

        let legendColumn = this.card.options.viewOptions.column.legend;
        let groupByColumn = this.card.options.viewOptions.column.groupBy;
        let lines = this.card.options.viewOptions.column.lines;

        try {
            let legendListObj = <{ l: string }[]> await this.database.execute(` select distinct ${legendColumn} as l
                    from ${this.tableName}
                    `);

            let legendList = legendListObj.map((a) => {
                return a.l;
            });

            let linesQ = ``;
            for (let lineIndx in lines) {
                let c = parseInt(lineIndx) + 1;
                linesQ += `, ${lines[lineIndx].aggregator}(${this.tableName}.${lines[lineIndx].line}) as v${c}`
            }

            // PROBLEM WITH ALASQL:
            // select legendColumn as l <- l is returned undefined
            // workaround 'aug' as l
            // ${this.tableName}.${legendColumn} as l <- is undefiend
            // changed to '${legend}' as l
            let groupQ = ``;
            let groupG = ``;
            if (groupByColumn) {
                groupQ += `, ${groupByColumn}`;
                groupG += `, ${groupByColumn}`;
            }

            let dataToPlayWith = <any[]> await this.database.execute(`
                    select  
                      ${legendColumn}
                      ${groupQ}
                      ${linesQ}
                    from ${this.tableName}
                    group by ${legendColumn} ${groupG}
                `);

            let alteredTable = [];
            // debugger;
            if (groupByColumn) {
                let distinctGroupsObj = {};
                for (let g of dataToPlayWith) {
                    distinctGroupsObj[g[groupByColumn]] = true;
                }
                let distinctGroups = Object.keys(distinctGroupsObj);

                for (let l of legendList) {
                    for (let g of distinctGroups) {
                        let matchFound = false;
                        for (let r of dataToPlayWith) {
                            if (r[groupByColumn] == g && r[legendColumn] == l) {
                                // ok found match
                                alteredTable.push(r);
                                matchFound = true;
                                break;
                            }
                        }

                        if (!matchFound) {
                            let row = {};
                            row[groupByColumn] = g;
                            row[legendColumn] = l;
                            for (let i in lines)
                                row['v' + (parseInt(i) + 1)] = null;
                            alteredTable.push(row);
                        }
                    }
                }
            } else {
                // no group ? no hassle !
                alteredTable = dataToPlayWith;
            }

            console.table(alteredTable);

            let rawSeriesSet = {};

            for (let lineIndx in lines) {
                // l is the column name that is v1 : 0 + 1
                let lineName = lines[lineIndx];

                for (let row of alteredTable) {
                    let lineNameWithGroup = lineName.line;
                    if (groupByColumn)
                        lineNameWithGroup += (' - ' + row[groupByColumn]);

                    rawSeriesSet[lineNameWithGroup] = rawSeriesSet[lineNameWithGroup] || [];

                    let lineData = row['v' + (parseInt(lineIndx) + 1)] || false;
                    if (lineData) {
                        rawSeriesSet[lineNameWithGroup].push(lineData);
                    } else {
                        rawSeriesSet[lineNameWithGroup].push(null);
                    }
                }
            }


            let seriesSet = [];
            for (let name of Object.keys(rawSeriesSet)) {
                seriesSet.push({
                    name: name,
                    data: rawSeriesSet[name],
                });
            }

            this.queryResponse = {
                legend: legendList,
                series: seriesSet,
            };

            resolve();
        } catch (e) {
            reject();
        }
    }

    render(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.chart.ref)
                return;

            this.chart.ref.xAxis[0].update({
                categories: this.queryResponse.legend,
            }, true);

            let seriesLength = this.chart.ref.series.length;
            for (let i = 0; i < seriesLength; i++) {
                this.chart.ref.series[0].remove(true);
            }

            for (let series of this.queryResponse.series) {
                this.chart.addSerie(series, true);
            }
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