import * as React from 'react';

import SongFinder from './SongFinder';
import { List, ListItem } from 'material-ui';
import { LastFmTrack } from '../api/lastfm';
import { ApplicationState } from 'src/store';

import { connect } from 'react-redux';
import { actionCreators } from 'src/store/actions';

interface Props {
    seedTracks: LastFmTrack[];
    addSong: typeof actionCreators.addSong;
    removeSong: typeof actionCreators.removeSong;
}

const SeedTrack = (props: { track: LastFmTrack }) => <ListItem>

</ListItem>;



class Seed extends React.Component<Props> {
    public render() {
        return <>
            <SongFinder onSelect={this.props.addSong} />
            <List>
            </List>
        </>;
    }
}

const mapStateToProps = (state: ApplicationState) => ({ seedTracks: state.seedTracks });
const mapDispatchToProps = {
    addSong: actionCreators.addSong,
    removeSong: actionCreators.removeSong
}

export default connect(mapStateToProps, mapDispatchToProps)(Seed);