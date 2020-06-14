import React, { useState, useEffect } from 'react';
import { sortBy, prop } from 'ramda';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';

interface Region {
    readonly slug: string;
    readonly name: string;
}

const getRegions = async (): Promise<Region[]> => {
    const response = await fetch('/api/regions');
    return await response.json();
}

export default () => {
    const defaultRegions: Region[] = [];
    const [regions, setRegions] = useState(defaultRegions);
    useEffect(() => {getRegions().then(setRegions)}, []);

    return <Nav style={{backgroundColor: '#f7f7f7', borderRight: '1px solid #ececec', overflow: 'auto', maxHeight: '100vh', flexWrap: 'nowrap'}} className="flex-column">
            {sortBy(prop('name'), regions).map((r: Region) => (
                <Nav.Item style={{width: '100%'}}><Link to={`/region/${r.slug}`}>{r.name}</Link></Nav.Item>
            ))}
            </Nav>
}
