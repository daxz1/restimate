import express from 'express';
import { APIReady, getApiReadyData } from './covid';
import { map, pick, values } from 'ramda';
import path from 'path';
import morgan from 'morgan';

let data: APIReady;

const fetch = async (): Promise<void> => {
    const d = await getApiReadyData();
    console.log("Data fetched");
    data = d;
}

// update every 8 hours;
setInterval(fetch, 8*3600*1000);

const app = express();
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '../build')))
app.get('/ping', (req, res) => res.send('pong'))


app.get('/api/regions', (req, res) => 
    res.json(map(pick(['slug', 'name']), values(data)))
)

app.get('/api/region/:region', (req, res) => 
    res.json(data[req.param('region')])
)

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../build', 'index.html')))

fetch().then(() => {
    app.listen(process.env.PORT || 4000, () => console.log('listening...'));
})
