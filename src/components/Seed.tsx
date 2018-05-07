import * as React from 'react';

import SongFinder from './SongFinder';
import { List, ListItem, Avatar, IconButton } from 'material-ui';
import ActionDelete from 'material-ui/svg-icons/action/delete';

import { LastFmTrack, trackGetInfo } from 'src/services/lastfm';
import { ApplicationState } from 'src/store';

import { connect } from 'react-redux';
import { actionCreators } from 'src/store/actions';
import SongList from './SongList';

interface Props {
    seedTracks: LastFmTrack[];
    addSong: typeof actionCreators.addSeedSong;
    removeSong: typeof actionCreators.removeSeedSong;
}

class Seed extends React.Component<Props> {
    thing: number = 8;

    public render() {
        return <>
            <SongFinder onSelect={this.props.addSong} />
            <SongList songs={this.props.seedTracks} removeSong={this.props.removeSong} />
        </>;
    }
}

const mapStateToProps = (state: ApplicationState) => ({ seedTracks: state.seedTracks });
const mapDispatchToProps = {
    addSong: actionCreators.addSeedSong,
    removeSong: actionCreators.removeSeedSong
}

export default connect(mapStateToProps, mapDispatchToProps)(Seed);