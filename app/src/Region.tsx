import React, {useState, useEffect, Fragment} from 'react';
import ChartistGraph from 'react-chartist';
import Chartist from 'chartist';
import { useParams } from 'react-router-dom';
import moment from 'moment';

const graphData = async (slug: string, days: number) => {
    const response = await fetch(`/api/region/${slug}`);
    const data = await response.json();
    return {
        name: data.name,
        labels: data.labels.slice(data.labels.length-days, data.labels.length),
        series: [{
            name: 'estr',
            data: data.estr.slice(data.estr.length-days, data.estr.length),
        }]
    }
};

const options: Chartist.ILineChartOptions = {
    low: 0,
    height: 600,
    axisX: {
        divisor: 5,
        labelInterpolationFnc: (value: string, index: number) => 
             index % 4 === 0 ? moment(value).format('D MMM'): null
        ,
    },
};

interface RegionParams {
    slug: string;
}

export default () => {
    const params = useParams<RegionParams>();
    const slug = params.slug;
    const [data, setData] = useState({name: '', labels: []});
    useEffect(() => {graphData(slug, 80).then(setData)}, [slug]);
    return <Fragment>
        <h2>{data.name}</h2>
        <div>
            <ChartistGraph data={data} options={options} type="Line" />
        </div>
        </Fragment>;
};
