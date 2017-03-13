import React from 'react';
import {Card, CardActions, CardHeader, CardText, CardMedia} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Toggle from 'material-ui/Toggle';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class DiscovererSettings extends React.Component {
    constructor(props) {
        super(props);

        this.render = this.render.bind(this);
        this.state = {
            burnSeedTracks: false,
            burnSeedArtists: false,
            includeSeedTracks: false,
            burnUsedTracks: true,
            burnUsedArtists: false,
            limit: 10,
            minDepth: 0,
            maxDepth: 1,
        };
    }

    render() {
          return (
            <Paper zDepth={1}>
                <Toolbar>
                    <ToolbarTitle text="Generation Settings"/>
                </Toolbar>
                <List>
                    <ListItem primaryText="Burn Seed Tracks" secondaryText="Stops tracks used as seeds from appearing in the final playlist"
                        rightToggle={
                            <Toggle
                                defaultToggled={this.state.burnSeedTracks}
                                onToggle={(event, value) => this.setState({burnSeedTracks: value})}/>
                        }/>
                    <ListItem primaryText="Burn Seed Artists" secondaryText="Stops artists from seed tracks from appearing in the final playlist"
                        rightToggle={
                            <Toggle
                                defaultToggled={this.state.burnSeedArtists}
                                onToggle={(event, value) => this.setState({burnSeedArtists: value})}/>
                        }/>
                    <ListItem primaryText="Include Seed Tracks" secondaryText="Adds seed tracks to the final playlist (this overrides burning seed tracks/artists)."
                        rightToggle={
                            <Toggle
                                defaultToggled={this.state.includeSeedTracks}
                                onToggle={(event, value) => this.setState({includeSeedTracks: value})}/>
                        }/>
                    <ListItem primaryText="Burn Used Tracks" secondaryText="Stops tracks from appearing in the final playlist more than once" rightToggle={
                        <Toggle
                            defaultToggled={this.state.burnUsedTracks}
                            onToggle={(event, value) => this.setState({burnUsedTracks: value})}/>}
                    />
                    <ListItem primaryText="Burn Used Artists" secondaryText="Prevents artists from appearing in the final playlist more than once."
                        rightToggle={
                            <Toggle
                                defaultToggled={this.state.burnUsedArtists}
                                onToggle={(event, value) => this.setState({burnUsedArtists: value})}/>
                        }/>
                    <ListItem disableFocusRipple={true} disableTouchRipple={true} hoverColor="transparent">   
                        <div>
                            Limit
                            <div style={{
                                    fontSize: "14px",
                                    lineHeight: "16px",
                                    height: "16px",
                                    margin: "4px 0px 0px",
                                    color: "rgba(0, 0, 0, 0.54)",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}>
                                The maximum number of tracks in the final playlist.
                            </div>
                        </div>    
                        <br/>
                        <SelectField
                            value={this.state.limit}
                            onChange={(event, index, value) => this.setState({limit: value})}>
                            <MenuItem primaryText="10"/>
                            <MenuItem primaryText="25"/>
                            <MenuItem primaryText="50"/>
                            <MenuItem primaryText="100"/>
                            <MenuItem primaryText="200"/>
                        </SelectField>
                    </ListItem>
                </List>
            </Paper>
        );
    }
};