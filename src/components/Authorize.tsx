import { Paper, Toolbar, ToolbarTitle } from 'material-ui';
import * as querystring from 'querystring';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { AuthorizationToken } from 'src/store/authorizationStore';

const secondsTillClose = 3;

interface State {
    secondsTillClose: number;
}

const delayOneSecond = () => new Promise(resolve => setTimeout(resolve, 1000));
const countdown = (from: number, callback: (value: number) => void) => delayOneSecond().then(() => {
    const next = from - 1;
    callback(next);
    if (next) {
        countdown(next, callback);
    }
});

export default class Authorize extends React.Component<RouteComponentProps<{}>, State> {
    state = {
        secondsTillClose
    };

    token: AuthorizationToken;

    componentDidMount() {
        this.token = querystring.parse(this.props.location.hash.slice(1));
        this.token.issue_date = new Date(); // Store the issue date so we know when it expires

        window.opener.postMessage(this.token, '*');

        countdown(this.state.secondsTillClose, secondsTillClose => this.setState({ secondsTillClose }));
    }

    componentDidUpdate() {
        if (this.state.secondsTillClose <= 0) {
            window.close();
        }
    }

    public render() {
        return <Paper>
            <Toolbar><ToolbarTitle text="Success!" /></Toolbar>
            You have been successfully authorized! This tab will close in {this.state.secondsTillClose}
        </Paper>
    }
}