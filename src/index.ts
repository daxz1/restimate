import { readFileSync } from 'fs';
import * as R from 'ramda';
import * as moment from 'moment';

export interface TimeSeriesItem {
    readonly specimenDate: moment.Moment;
    readonly dailyLabConfirmedCases: number;
}

export interface RawTimeSeriesItem {
    readonly areaName: string;
    readonly dailyLabConfirmedCases: number;
    readonly specimenDate: string;
}

export interface GroupedTimeSeries {
    [areaName: string]: TimeSeriesItem[];
}

// startDate is the most recent date
// endDate is the oldest date
// the list starts at startDate
// series contains confirmed cases for every day from then to endDate
export interface FilledTimeSeries {
    readonly startDate: moment.Moment;
    readonly endDate: moment.Moment;
    readonly series: number[];
}

export const getTimeSeries = (pathname: string): RawTimeSeriesItem[] => {
    const data = JSON.parse(readFileSync(pathname, 'utf-8'));
    const t = R.map(R.pick(['areaName', 'specimenDate', 'dailyLabConfirmedCases']), data.ltlas);
    return (t as unknown) as RawTimeSeriesItem[];
};

export const ntsi2tsi = ({ dailyLabConfirmedCases, specimenDate }: RawTimeSeriesItem): TimeSeriesItem => ({
    specimenDate: moment(specimenDate),
    dailyLabConfirmedCases,
});

export const sortedTimeSeries = (i: TimeSeriesItem[]): TimeSeriesItem[] =>
    R.sortWith([R.descend(R.prop('specimenDate'))], i);

function* filledTimeSeries(ts: TimeSeriesItem[]): Generator<TimeSeriesItem> {
    let last = R.head(ts);
    if (last) {
        for (const i of ts) {
            const t = last.specimenDate.clone();
            while (t > i.specimenDate) {
                t.subtract(1, 'day');
                yield {
                    specimenDate: t.clone(),
                    dailyLabConfirmedCases: 0,
                };
            }
            yield i;
            last = i;
        }
    }
}

export const getGroup = (ts: RawTimeSeriesItem[]): GroupedTimeSeries =>
    R.map<GroupedTimeSeries, GroupedTimeSeries>(
        sortedTimeSeries,
        R.map<{ [index: string]: RawTimeSeriesItem[] }, { [index: string]: TimeSeriesItem[] }>(
            R.map(ntsi2tsi),
            R.groupBy(R.prop('areaName'), ts),
        ),
    );

export const getData = R.pipe(getTimeSeries, getGroup);

export const entryPoint = (pathname: string) => {
    const d = getData(pathname);
    const e = Array.from(filledTimeSeries(d['York']));
    console.log(JSON.stringify(e));
};

entryPoint('data/coronavirus-cases_latest.json');
