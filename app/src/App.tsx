import React, {Fragment, useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import moment from 'moment';
import Regions from './Regions';
import Region from './Region';

export interface Metadata {
    lastUpdatedAt: string;
    disclaimer: string;
}

const getMetadata = async (): Promise<Metadata> => {
    const response = await fetch('/api/metadata');
    return await response.json();
}

const Intro = () => {
    const [metadata, setMetadata] = useState({lastUpdatedAt: "", disclaimer: ""});
    useEffect(() => {getMetadata().then(setMetadata)}, []);

    return <Fragment>
    <h2>Estimates for 'R'</h2>
    <p>This site shows estimated values for the effective reproduction number <strong>R</strong> for COVID-19 in the UK.</p>
    <h3>How to use</h3>
    <p>Choose a region on the left to see a chart.</p>
    <h3>Source data</h3>
    <p>The source data is timestamped <strong>{moment(metadata.lastUpdatedAt).format("dddd, Do MMM YYYY, HH:mm")}</strong>. It is refreshed approximately every 8 hours.</p>
    <p><em>{metadata.disclaimer}</em></p>
    <h3>Method</h3>
    <ul>
        <li>Days with no data are assumed to have zero cases</li>
        <li>Case data is smoothed with a 7 day rolling average</li>
        <li>R is estimated from a day's 7 day case rolling average compared to the rolling average from 5 days previously, where 5 days appears to be the incubation period for the virus</li>
    </ul>
    <h3>Accuracy</h3>
    <p>This data is based on test results so is strongly influenced by the size and scope of the testing regime, which has changed dramatically over the time series shown.</p>
    <p>I am not a statistician. I am not your statistician. This could all be complete bobbins.</p>
    <p>Seriously, don't base any decisions on these charts.</p>
    <h3>Source code</h3>
    <p>You can find the source for this <a href="https://github.com/winjer/restimate">on Github</a>. Pull requests welcome.</p>
    <small>&copy; 2020, Doug Winter</small>
    </Fragment>
}

const App: React.FC = () => {
    return (
        <Router>
            <Navbar bg="light">
            </Navbar>
            <Container fluid>
                <Row>
                    <Col className='flex-column' xs={2}>
                        <Regions />
                    </Col>
                    <Col>
                    <Route exact path="/" component={Intro} />
                    <Route path="/region/:slug" component={Region} />
                    </Col>
                </Row>
                <Switch>
                </Switch>
            </Container>
        </Router>
    );
};

export default App;
