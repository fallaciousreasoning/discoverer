import { IconButton, Toolbar, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import * as React from 'react';

export default class Layout extends React.Component {
    public render() {
        return <div>
            <AppBar>
                <Toolbar variant='dense'>
                    <IconButton color='inherit'>
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="title" color="inherit">
                        Discoverer
                    </Typography>
                </Toolbar>
            </AppBar>
            {this.props.children}
        </div>
    }
}