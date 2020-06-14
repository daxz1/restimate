import React from 'react';
import ChartistGraph from 'react-chartist';
import Chartist from 'chartist';
import { useParams } from 'react-router-dom';
import moment from 'moment';

const graphData2 = (slug: string) => {
    return {
        labels: ['2020-04-29T00:00:00+01:00', '2020-04-30T00:00:00+01:00', '2020-05-01T00:00:00+01:00'],
        series: [
            {
                name: 'series-1',
                data: [53, 40, 45],
            },
        ],
    };
};

const options: Chartist.ILineChartOptions = {
    low: 0,
    axisX: {
        divisor: 5,
        labelInterpolationFnc: (value: string) => {
            return moment(value).format('D MMM');
        },
    },
};

interface RegionParams {
    slug: string;
}

export default () => {
    const params = useParams<RegionParams>();
    const data = graphData2(params.slug);
    return (
        <div>
            <ChartistGraph data={data} options={options} type="Line" />
        </div>
    );
};
