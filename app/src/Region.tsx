import React, {useState, useEffect} from 'react';
import ChartistGraph from 'react-chartist';
import Chartist from 'chartist';
import { useParams } from 'react-router-dom';
import moment from 'moment';

const graphData = async (slug: string) => {
    const response = await fetch(`/api/region/${slug}`);
    const data = await response.json();
    return {
        labels: data.labels.slice(data.labels.length-20, data.labels.length),
        series: [{
            name: 'estr',
            data: data.estr.slice(data.estr.length-20, data.estr.length),
        }]
    }
    // return {
    //     labels: ['2020-04-29T00:00:00+01:00', '2020-04-30T00:00:00+01:00', '2020-05-01T00:00:00+01:00'],
    //     series: [
    //         {
    //             name: slug,
    //             data: [53, 40, 45],
    //         },
    //     ],
    // };
};

const options: Chartist.ILineChartOptions = {
    low: 0,
    axisX: {
        divisor: 30,
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
    const [data, setData] = useState({labels: []});
    useEffect(() => {graphData(params.slug).then(setData)}, []);
    return (
        <div>
            <ChartistGraph data={data} options={options} type="Line" />
        </div>
    );
};
