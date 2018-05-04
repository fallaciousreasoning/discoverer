import * as React from 'react';
import { List, ListItem, Toggle, SelectField, MenuItem } from 'material-ui';
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

class SettingsEditor extends React.Component<Props> {
    limitOptions = [5, 10, 25, 50, 100, 250];

    public render() {
        return <List>
            <ListItem
                primaryText="Burn Seed Tracks"
                secondaryText="Stops tracks used as seeds from appearing in the final playlist"
                rightToggle={<Toggle toggled={this.props.burnSeedTracks} onToggle={(event, value) => this.props.updateSettings({ burnSeedTracks: value })} />} />
            <ListItem
                primaryText="Burn Seed Artists"
                secondaryText="Stops artists from seed tracks from appearing in the final playlist"
                rightToggle={<Toggle defaultToggled={this.props.burnSeedArtists}
                    onToggle={(event, value) => this.props.updateSettings({ burnSeedArtists: value })} />} />
            <ListItem
                primaryText="Include Seed Tracks"
                secondaryText="Adds seed tracks to the final playlist (this overrides burning seed tracks/artists)."
                rightToggle={<Toggle defaultToggled={this.props.includeSeedTracks} onToggle={(event, value) => this.props.updateSettings({ includeSeedTracks: value })} />} />
            <ListItem
                primaryText="Burn Used Tracks"
                secondaryText="Stops tracks from appearing in the final playlist more than once"
                rightToggle={< Toggle defaultToggled={this.props.burnUsedTracks} onToggle={(event, value) => this.props.updateSettings({ burnUsedTracks: value })} />} />
            <ListItem
                primaryText="Burn Used Artists"
                secondaryText="Prevents artists from appearing in the final playlist more than once."
                rightToggle={< Toggle defaultToggled={this.props.burnUsedArtists} onToggle={(event, value) => this.props.updateSettings({ burnUsedArtists: value })} />} />
            <ListItem
                disableFocusRipple={true}
                disableTouchRipple={true}
                hoverColor="transparent">
                <div>
                    Limit
                    <div style={secondaryTextStyle}>
                        The maximum number of tracks in the final playlist.
                    </div>
                </div>
                <br />
                <SelectField autoWidth value={this.props.limit} onChange={(event, index, value) => this.props.updateSettings({ limit: value })}>
                    {this.limitOptions.map(option => <MenuItem primaryText={option} key={option} value={option} />)}
                </SelectField>
            </ListItem>
        </List>;
    }
}

export default connect((state: ApplicationState) => state.settings, { updateSettings: actionCreators.updateSettings})(SettingsEditor);

