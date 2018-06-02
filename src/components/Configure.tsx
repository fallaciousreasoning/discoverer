import { List, ListItem, ListItemSecondaryAction, ListItemText, MenuItem, Select, Switch } from '@material-ui/core';
import * as React from 'react';
import { Settings } from 'src/store/settingsStore';
import { connect } from '../connect';
import { ApplicationState } from '../store';
import { actionCreators } from '../store/actions';

interface Props extends Settings {
    updateSettings: (update: Partial<Settings>) => void;
}

const secondaryTextStyle = {
    fontSize: "14px",
    lineHeight: "16px",
    height: "16px",
    margin: "4px 0px 0px",
    color: "rgba(0, 0, 0, 0.54)",
    overflow: "hidden",
    textOverflow: "ellipsis",
};

function ListToggleEntry(props: { primary: string, secondary: string, checked: boolean, onChange: (event) => void }) {
    return <ListItem>
        <ListItemText
            primary={props.primary}
            secondary={props.secondary} />
        <ListItemSecondaryAction>
            <Switch checked={props.checked} onChange={props.onChange}/>
        </ListItemSecondaryAction>
    </ListItem>;
}

class Configure extends React.Component<Props> {
    limitOptions = [5, 10, 25, 50, 100, 250];

    public render() {
        return <List>
            <ListToggleEntry
                primary="Burn Seed Tracks"
                secondary="Stops tracks used as seeds from appearing in the final playlist"
                checked={this.props.burnSeedTracks}
                onChange={event => this.props.updateSettings({ burnSeedTracks: event.target.value })}/>
            <ListToggleEntry
                primary="Burn Seed Artists"
                secondary="Stops artists from seed tracks from appearing in the final playlist"
                checked={this.props.burnSeedArtists}
                onChange={(event) => this.props.updateSettings({ burnSeedArtists: event.target.value })}/>
            <ListToggleEntry
                primary="Include Seed Tracks"
                secondary="Adds seed tracks to the final playlist (this overrides burning seed tracks/artists)."
                checked={this.props.includeSeedTracks}
                onChange={(event) => this.props.updateSettings({ includeSeedTracks: event.target.value })} />
            <ListToggleEntry
                primary="Burn Used Tracks"
                secondary="Stops tracks from appearing in the final playlist more than once"
                checked={this.props.burnUsedTracks}
                onChange={(event) => this.props.updateSettings({ burnUsedTracks: event.target.value })} />
            <ListToggleEntry
                primary="Burn Used Artists"
                secondary="Prevents artists from appearing in the final playlist more than once."
                checked={this.props.burnUsedArtists}
                onChange={(event) => this.props.updateSettings({ burnUsedArtists: event.target.value })} />
            <ListItem>
                <div>
                    Limit
                    <div style={secondaryTextStyle}>
                        The maximum number of tracks in the final playlist.
                    </div>
                </div>
                <br />
                <Select autoWidth value={this.props.limit} onChange={(event) => this.props.updateSettings({ limit: event.target.value as any })}>
                    {this.limitOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                </Select>
            </ListItem>
        </List>;
    }
}

export default connect((state: ApplicationState) => state.settings, { updateSettings: actionCreators.updateSettings })(Configure);

