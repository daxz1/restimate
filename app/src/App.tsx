import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';

import Regions from './Regions';
import Region from './Region';

const Index = () => (
    <React.Fragment>
        <h2>Regions</h2>
        <Regions />
    </React.Fragment>
);

const App: React.FC = () => {
    return (
        <Router>
            <Container className="p-3">
                <Link to="/">Home</Link>
                <Switch>
                    <Route path="/" exact component={Index} />
                    <Route path="/region/:slug" component={Region} />
                </Switch>
            </Container>
        </Router>
    );
};

export default App;
