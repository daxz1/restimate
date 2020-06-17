import React, {useState, useEffect, Fragment} from 'react';
import ChartistGraph from 'react-chartist';
import Chartist from 'chartist';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { sum } from 'ramda';

const defaultOptions = {
    class: 'ct-target-line',
    value: null
};

// from chartist-plugins-targetline
Chartist.plugins = Chartist.plugins || {};
Chartist.plugins.ctTargetLine = function(options: any) {

    options = Chartist.extend({}, defaultOptions, options);

    return function ctTargetLine(chart: any) {
        const projectY = (chartRect: any, bounds: any, value: any) => 
					chartRect.y1 - (chartRect.height() / bounds.max * value)

        chart.on('created', function (context: any) {
          var targetLineY = projectY(context.chartRect, context.bounds, options.value);

          context.svg.elem('line', {
            x1: context.chartRect.x1,
            x2: context.chartRect.x2,
            y1: targetLineY,
            y2: targetLineY
          }, options.class);
        });
    };
  };

const graphData = async (slug: string, days: number) => {
    const response = await fetch(`/api/region/${slug}`);
    const data = await response.json();
    return {
        rawData: data,
        graphData: {
        name: data.name,
        labels: data.labels.slice(data.labels.length-days, data.labels.length),
        series: [{
            name: 'estr',
            data: data.estr.slice(data.estr.length-days, data.estr.length),
        }]
    }}

};

const options: Chartist.ILineChartOptions = {
    low: 0,
    height: 600,
    plugins: [Chartist.plugins.ctTargetLine({value: 1})],
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
    const [data, setData] = useState({
        rawData: {
            cases: [],
        }, 
        graphData: {name: '', labels: []}
    });
    const days = 80;
    useEffect(() => {graphData(slug, days).then(setData)}, [slug]);
    const cutOff = 10;
    const allCases = Math.ceil(sum(data.rawData.cases.slice(data.rawData.cases.length-days, data.rawData.cases.length)))
    const recentCases = Math.ceil(sum(data.rawData.cases.slice(data.rawData.cases.length-14, data.rawData.cases.length)));
    const showWarning = () => recentCases < cutOff ? <p><strong>There are low numbers of cases in the previous two weeks. Recent values for R are likely to be very wrong!.</strong></p> : null;
    return <Fragment>
        <h2>{data.graphData.name}</h2>
        <p>Total number of cases in the period shown: <em>{allCases}</em></p>
        <p>Total number of cases in the last two weeks: <em>{recentCases}</em></p>
        {showWarning()}
        <div>
            <ChartistGraph data={data.graphData} options={options} type="Line" />
        </div>
        </Fragment>;
};
