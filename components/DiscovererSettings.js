import React from 'react';
import FlatButton from 'material-ui/FlatButton';

import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Toggle from 'material-ui/Toggle';

import {Toolbar, ToolbarTitle} from 'material-ui/Toolbar';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const secondaryTextStyle = {
    fontSize: "14px",
    lineHeight: "16px",
    height: "16px",
    margin: "4px 0px 0px",
    color: "rgba(0, 0, 0, 0.54)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
};


export default class DiscovererSettings extends React.Component {
    constructor(props) {
        super(props);

        this.render = this.render.bind(this);
        this.limitOptions = [10, 25, 50, 100, 200];
        this.state = {
            burnSeedTracks: false,
            burnSeedArtists: false,
            includeSeedTracks: false,
            burnUsedTracks: true,
            burnUsedArtists: false,
            limit: 10,
            minDepth: 0,
            maxDepth: 2,
        };

        // Initialize our state from the default options.
        if (props.defaultOptions) {
            for (let key in props.defaultOptions) {
                this.state[key] = props.defaultOptions[key] || this.state[key];
            }
        }

        this.onChanged = this.props.onChanged || (() => {});
        this.onChanged(this.state);

        this.getOptions = this.getOptions.bind(this);
        this.render = this.render.bind(this);
        this.setOptions = this.setOptions.bind(this);
    }

    setOptions(options) {
        const state = this.state;
        for (let key in options) {
            state[key] = options[key];
        }

        this.setState(options);
        this.onChanged(state);
    }

    getOptions() {
        const options = {};
        for (let key in this.state) {
            options[key] = this.state[key];
        }
        return options;
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
                                onToggle={(event, value) => this.setOptions({burnSeedTracks: value})}/>
                        }/>
                    <ListItem primaryText="Burn Seed Artists" secondaryText="Stops artists from seed tracks from appearing in the final playlist"
                        rightToggle={
                            <Toggle
                                defaultToggled={this.state.burnSeedArtists}
                                onToggle={(event, value) => this.setOptions({burnSeedArtists: value})}/>
                        }/>
                    <ListItem primaryText="Include Seed Tracks" secondaryText="Adds seed tracks to the final playlist (this overrides burning seed tracks/artists)."
                        rightToggle={
                            <Toggle
                                defaultToggled={this.state.includeSeedTracks}
                                onToggle={(event, value) => this.setOptions({includeSeedTracks: value})}/>
                        }/>
                    <ListItem primaryText="Burn Used Tracks" secondaryText="Stops tracks from appearing in the final playlist more than once" rightToggle={
                        <Toggle
                            defaultToggled={this.state.burnUsedTracks}
                            onToggle={(event, value) => this.setOptions({burnUsedTracks: value})}/>}
                    />
                    <ListItem primaryText="Burn Used Artists" secondaryText="Prevents artists from appearing in the final playlist more than once."
                        rightToggle={
                            <Toggle
                                defaultToggled={this.state.burnUsedArtists}
                                onToggle={(event, value) => this.setOptions({burnUsedArtists: value})}/>
                        }/>
                    <ListItem disableFocusRipple={true} disableTouchRipple={true} hoverColor="transparent">   
                        <div>
                            Limit
                            <div style={secondaryTextStyle}>
                                The maximum number of tracks in the final playlist.
                            </div>
                        </div>    
                        <br/>
                        <SelectField
                            value={this.state.limit}
                            onChange={(event, index, value) => this.setOptions({limit: value})}>

                            {this.limitOptions.map(option => {
                                return (<MenuItem primaryText={option} key={option} value={option}/>);
                            })}
                        </SelectField>
                    </ListItem>
                </List>
            </Paper>
        );
    }
};