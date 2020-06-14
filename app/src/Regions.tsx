import React, { useState, useEffect } from 'react';
import { sortBy, prop } from 'ramda';
import { Link } from "react-router-dom";

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

    return <ol>
            {sortBy(prop('name'), regions).map((r: Region) => <li key="{r.slug}"><Link to={`/region/${r.slug}`}>{r.name}</Link></li>)}
        </ol>;
}
