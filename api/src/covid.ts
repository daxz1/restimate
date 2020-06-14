import { readFileSync } from 'fs';
import * as R from 'ramda';
import moment from 'moment';
import fetch from 'node-fetch';

const incubationDays = 5;
const smoothingDays = 7;

const sourceUrl = 'https://c19downloads.azureedge.net/downloads/json/coronavirus-cases_latest.json';

export interface TimeSeriesItem {
    readonly specimenDate: moment.Moment;
    readonly dailyLabConfirmedCases: number;
}

export interface SmoothedTimeSeriesItem extends TimeSeriesItem {
    readonly smoothed: number;
}

export interface EstimatedTimeSeriesItem extends SmoothedTimeSeriesItem {
    readonly r: number;
}

export interface RawTimeSeriesItem {
    readonly areaName: string;
    readonly dailyLabConfirmedCases: number;
    readonly specimenDate: string;
}

export interface GroupedTimeSeries {
    [areaName: string]: TimeSeriesItem[];
}

export interface GroupedEstimatedTimeSeries {
    [areaName: string]: EstimatedTimeSeriesItem[];
}

export interface Region {
    readonly slug: string;
    readonly name: string;
    readonly labels: string[];
    readonly cases: number[];
    readonly estr: number[];
}

export interface Metadata {
    lastUpdatedAt: string;
    disclaimer: string;
}

export interface APIReady {
    [slug: string]: Region;
}

export const loadDataFromUrl = async (url: string): Promise<any> => {
    const response = await fetch(url);
    return await response.json();
}

export const loadTimeSeries = (data: any): RawTimeSeriesItem[] => {
    const t = R.map(R.pick(['areaName', 'specimenDate', 'dailyLabConfirmedCases']), data.ltlas);
    return (t as unknown) as RawTimeSeriesItem[];
};

export const momentize = (t: RawTimeSeriesItem): TimeSeriesItem => ({
    ...t,
    specimenDate: moment(t.specimenDate),
});

export const sortedTimeSeries = (i: TimeSeriesItem[]): TimeSeriesItem[] =>
    R.sortWith([R.descend(R.prop('specimenDate'))], i);

export const group = (ts: RawTimeSeriesItem[]): GroupedTimeSeries =>
    R.map<GroupedTimeSeries, GroupedTimeSeries>(
        sortedTimeSeries,
        R.map<{ [index: string]: RawTimeSeriesItem[] }, { [index: string]: TimeSeriesItem[] }>(
            R.map(momentize),
            R.groupBy(R.prop('areaName'), ts),
        ),
    );

export const filler = (acc: TimeSeriesItem[], t: TimeSeriesItem): TimeSeriesItem[] => {
    if(acc.length > 0) {
        const fill = [];
        const last = acc[0].specimenDate.clone();
        while(last.diff(t.specimenDate, 'days') > 1) {
            last.subtract(1, 'day');
            fill.unshift({
                specimenDate: moment(last.format('YYYY-MM-DD')),
                dailyLabConfirmedCases: 0,
            })
        }
        return [t, ...fill, ...acc]
    }
    return [t]
}

export const smoothSum = (start: number, end: number) => (t: EstimatedTimeSeriesItem[]): number => 
    R.sum(R.map(R.prop('smoothed'), t.slice(start, end)))

export const sumNow = smoothSum(0, smoothingDays - 1)
export const sumThen = smoothSum(incubationDays, incubationDays+  smoothingDays)

export const rcalculator = (t: SmoothedTimeSeriesItem, acc: EstimatedTimeSeriesItem[]): EstimatedTimeSeriesItem[] => [{
    ...t,
    r: (sumNow(acc) + t.smoothed) / sumThen(acc)
}, ...acc]

export const smoother = (t: TimeSeriesItem, acc: SmoothedTimeSeriesItem[], ): SmoothedTimeSeriesItem[] => [{
        ...t,
    smoothed: (R.sum(R.map(R.prop('dailyLabConfirmedCases'), R.take(smoothingDays-1, acc)))+ t.dailyLabConfirmedCases) / smoothingDays
    }, ...acc
]

export const smooth = (ts: TimeSeriesItem[]): SmoothedTimeSeriesItem[] => 
    R.reduceRight(smoother, [], ts)

export const fill = (ts: TimeSeriesItem[]): TimeSeriesItem[] => R.reverse(R.reduce(filler, [], ts))

export const estr =  (ts: SmoothedTimeSeriesItem[]): EstimatedTimeSeriesItem[] => 
    R.reduceRight(rcalculator, [], ts)

export const slugify = (s: string): string => s.toLowerCase().replace(/ /g, '-');

export const makeApiReady = (g: GroupedEstimatedTimeSeries): APIReady => {
    const d: APIReady = {};
    for (const name in g) {
        const slug = slugify(name);
        const region = g[name];
        const labels = R.reverse(R.map((x: moment.Moment) => x.format(), R.map(R.prop('specimenDate'), region)));
        const cases = R.reverse(R.map(R.prop('smoothed'), region));
        const estr = R.reverse(R.map(R.prop('r'), region));
        d[slug] = {
            slug,
            name,
            labels,
            cases,
            estr,
        }
    }
    return d;
}

export const getApiReadyData = async () => {
    const raw = await loadDataFromUrl(sourceUrl);
    const metadata = raw.metadata;
    const d = R.pipe(loadTimeSeries, group)(raw);
    const e = R.map<GroupedTimeSeries,GroupedEstimatedTimeSeries>(R.compose(estr, smooth, fill), d);
    return {
        data: makeApiReady(e),
        metadata,
    }
};
