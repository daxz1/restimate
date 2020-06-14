import React, { useState, useEffect } from 'react';
import { sortBy, prop } from 'ramda';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';

interface Region {
    readonly slug: string;
    readonly name: string;
}

const getRegions = async (): Promise<Region[]> => {
    const response = await fetch('/api/regions');
    console.log(response);
    return await response.json();
}

export default () => {
    const defaultRegions: Region[] = [];
    const [regions, setRegions] = useState(defaultRegions);
    useEffect(() => {getRegions().then(setRegions)}, []);

    return <Nav className="flex-column">
            {sortBy(prop('name'), regions).map((r: Region) => (
                <Nav.Item><Link to={`/region/${r.slug}`}>{r.name}</Link></Nav.Item>
            ))}
            </Nav>
}
