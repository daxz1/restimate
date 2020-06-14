import React, {Fragment} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Regions from './Regions';
import Region from './Region';

const Intro = () => <Fragment>
    <h2>Welcome</h2>
    <p>This site shows estimated vales for the effective reproduction number <strong>R</strong> for the COVID-19 disease</p>
    <p>The data for this site comes from the UK Government, but is for only English regions. The raw data is available <a href="https://c19downloads.azureedge.net/downloads/json/coronavirus-cases_latest.json">in JSON form</a></p>
    <h3>Method</h3>
    <ul>
        <li>Data points with no data are assumed to have zero cases</li>
        <li>Case data is smoothed with a 7 day rolling average</li>
        <li>R is estimated from a date's 7 day case rolling average compared to the rolling average from 5 days previously</li>
    </ul>
    <h3>Accuracy</h3>
    <p>This data is based on test results so is strongly influenced by the size and scope of the testing regime. Take it with a pinch of salt.</p>
    <p>Seriously, don't base any decisions on these charts. Stay indoors.</p>
    <h3>Source</h3>
    <p>You can find the source for this <a href="https://github.com/winjer/restimate">on Github</a></p>
    </Fragment>

const App: React.FC = () => {
    return (
        <Router>
            <Navbar bg="light">
            </Navbar>
            <Container fluid>
                <Row>
                    <Col className='flex-column' style={{backgroundColor: '#f7f7f7', borderRight: '1px solid #ececec'}} xs={2}>
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
