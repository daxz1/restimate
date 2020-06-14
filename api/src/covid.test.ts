import {
    TimeSeriesItem,
    smooth,
    fill,
} from './covid';
import moment from 'moment';

const d = moment("2020-02-02");

test('smooth', () => {
    const ts: TimeSeriesItem[] = [{
        dailyLabConfirmedCases: 1,
        specimenDate: d,
    }, {
        dailyLabConfirmedCases: 1,
        specimenDate: d,
    }, {
        dailyLabConfirmedCases: 1,
        specimenDate: d,
    }, {
        dailyLabConfirmedCases: 1,
        specimenDate: d,
    }, {
        dailyLabConfirmedCases: 1,
        specimenDate: d,
    }, {
        dailyLabConfirmedCases: 1,
        specimenDate: d,
    }, {
        dailyLabConfirmedCases: 1,
        specimenDate: d,
    }];
    const s = smooth(ts);
    expect(s[0]).toEqual({
        dailyLabConfirmedCases: 1,
        smoothed: 1,
        specimenDate: d,
    })
    expect(s[1]).toEqual({
        dailyLabConfirmedCases: 1,
        smoothed: 6/7,
        specimenDate: d,
    })

})

test('fill', () => {
    const ts: TimeSeriesItem[] = [{
        dailyLabConfirmedCases: 1,
        specimenDate: moment("2020-02-20")
    }, {
        dailyLabConfirmedCases: 1,
        specimenDate: moment("2020-02-17")
    }];
    const r = fill(ts);
    expect(r).toEqual([{
            dailyLabConfirmedCases: 1,
            specimenDate: moment("2020-02-20")
        }, {
            dailyLabConfirmedCases: 0,
            specimenDate: moment("2020-02-19")
        }, {
            dailyLabConfirmedCases: 0,
            specimenDate: moment("2020-02-18")
        }, {
            dailyLabConfirmedCases: 1,
            specimenDate: moment("2020-02-17")
        }])
})