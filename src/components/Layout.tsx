import AppBar from '@material-ui/core/AppBar';
import * as React from 'react';

export default class Layout extends React.Component {
    public render() {
        return <div>
            <AppBar></AppBar>
            {this.props.children}
        </div>
    }
}