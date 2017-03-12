import React from 'react';
import {Card, CardActions, CardHeader, CardText, CardMedia} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Toggle from 'material-ui/Toggle';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

export default class DiscovererSettings extends React.Component {
    constructor(props) {
        super(props);

        this.render = this.render.bind(this);
    }

    render() {
          return (
            <Paper zDepth={1}>
                <Toolbar>
                    <ToolbarTitle text="Generation Settings"/>
                </Toolbar>
                <List>
                    <ListItem primaryText="Burn Seed Tracks" secondaryText="Stops tracks used as seeds from appearing in the final playlist" rightToggle={<Toggle/>}/>
                    <ListItem primaryText="Burn Seed Artists" secondaryText="Stops artists from seed tracks from appearing in the final playlist" rightToggle={<Toggle/>}/>
                    <ListItem primaryText="Include Seed Tracks" secondaryText="Adds seed tracks to the final playlist (this overrides burning seed tracks/artists)." rightToggle={<Toggle/>}/>
                    <ListItem primaryText="Burn Used Tracks" secondaryText="Stops tracks from appearing in the final playlist more than once" rightToggle={<Toggle defaultToggled={true}/>}/>
                    <ListItem primaryText="Burn Used Artists" secondaryText="Prevents artists from appearing in the final playlist more than once." rightToggle={<Toggle/>}/>
                    <ListItem primaryText="Limit" secondaryText="The maximum number of songs to include in the final playlist" rightToggle={<div/>}/>
                </List>
            </Paper>
        );
    }
};