import * as React from 'react';

import SongFinder from './SongFinder';

export default class Seed extends React.Component {
    public render() {
        return <>
        <SongFinder onSelect={console.log} />
        </>;
    }
}