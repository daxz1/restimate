import {
    TimeSeriesItem,
    smooth,
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
    const s = Array.from(smooth(ts));
    expect(s[0]).toEqual({
        dailyLabConfirmedCases: 1,
        specimenDate: d,
    })
    expect(s[1]).toEqual({
        dailyLabConfirmedCases: 6/7,
        specimenDate: d,
    })

})