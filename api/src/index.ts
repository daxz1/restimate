import express from 'express';
import { APIReady, getApiReadyData } from './covid';
import { map, pick, values } from 'ramda';

let data: APIReady;

const fetch = async (): Promise<void> => {
    const d = await getApiReadyData();
    console.log("Data fetched");
    data = d;
}

// update every 8 hours;
setInterval(fetch, 8*3600*1000);

const app = express();

app.get('/api/regions', (req, res) => {
    console.log("boop");
    res.json(map(pick(['slug', 'name']), values(data)));
})

app.get('/api/region/:region', (req, res) => {
    res.json(data[req.param('region')])
})

fetch().then(() => {
    app.listen(4000, () => console.log('listening...'));
})
