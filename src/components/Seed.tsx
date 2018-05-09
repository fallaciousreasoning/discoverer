import * as React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { actionCreators } from 'src/store/actions';
import { Track } from 'src/store/trackStore';
import { getSeedTracks } from '../store/seedStore';
import SongFinder from './SongFinder';
import SongList from './SongList';




interface Props {
    seeds: Track[];
    addSong: typeof actionCreators.addSeedSong;
    removeSong: typeof actionCreators.removeSeedSong;
}

class Seed extends React.Component<Props> {
    thing: number = 8;

    public render() {
        return <>
            <SongFinder onSelect={this.props.addSong} />
            <SongList songs={this.props.seeds} removeSong={this.props.removeSong} />
        </>;
    }
}

const mapStateToProps = createSelector([getSeedTracks], seeds => ({ seeds }))
const mapDispatchToProps = {
    addSong: actionCreators.addSeedSong,
    removeSong: actionCreators.removeSeedSong
}

export default connect(mapStateToProps, mapDispatchToProps)(Seed);