import * as React from 'react';

import SongFinder from './SongFinder';
import { List, ListItem, Avatar, IconButton } from 'material-ui';
import ActionDelete from 'material-ui/svg-icons/action/delete';

import { LastFmTrack, trackGetInfo } from 'src/services/lastfm';
import { ApplicationState } from 'src/store';

import { connect } from 'react-redux';
import { actionCreators } from 'src/store/actions';

interface Props {
    seedTracks: LastFmTrack[];
    addSong: typeof actionCreators.addSong;
    removeSong: typeof actionCreators.removeSong;
}

// If we have more than one image, take the second (medium size), otherwise take the one and only.
const artistUrl = (track: LastFmTrack) => track.image[Math.min(track.image.length - 1, 1)]['#text'];

const SeedTrack = (props: { track: LastFmTrack, remove: (track: LastFmTrack) => void }) => <ListItem
    leftAvatar={<Avatar src={artistUrl(props.track)}/>}
    primaryText={props.track.name}
    secondaryText={`by ${props.track.artist}`}
    rightIconButton={<IconButton onClick={() => props.remove(props.track)}><ActionDelete/></IconButton>}
/>;


class Seed extends React.Component<Props> {
    public render() {
        return <>
            <SongFinder onSelect={this.props.addSong} />
            <List>
                {this.props.seedTracks.map(track => <SeedTrack key={`${track.name} ${track.artist} ${track.url}`} track={track} remove={this.props.removeSong}/>)}
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