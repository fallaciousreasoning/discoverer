import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';

import SeedTrackPicker from './SeedTrackPicker';
import DiscovererSettings from './DiscovererSettings';
import GeneratedTracks from './GeneratedTracks';
import Linker from './Linker';

import Communicator from '../communicator';

import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';

// Test track.
const deadSilence = {
    name:"Dead Silence",
    artist:"Billy Talent",
    cover:"https://lastfm-img2.akamaized…6b564d059995f3392e386b8e.png",
    key: -1
}

const clone = (obj) => {
    let result = {};
    for (let key in obj) {
        result[key] = obj[key]
    }

    return result;
}

export default class GeneratorPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seedTracks: [],
            generatedTracks: [],
            spotifyTracks: [],
            options: {},
            finished: false,
            saved: false,
            stepIndex: 0,
            locked: false,
            lastStepText: 'Save to Spotify',
            hasToken: false,
        }

        this.defaultState = clone(this.state);

        this.componentWillMount = this.componentWillMount.bind(this);
        this.lock = this.lock.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.previousStep = this.previousStep.bind(this);
        this.getStepContent = this.getStepContent.bind(this);
        this.canStepForward = this.canStepForward.bind(this);
        this.render = this.render.bind(this);
    }

    componentWillMount() {
        if (this.state.hasToken) return;

        fetch('/token')
            .then(response => response.json())
            .then(json => {
                this.token = json.response;
                this.comms = new Communicator(this.token);

                this.setState({hasToken: true});
                this.defaultState.hasToken = true;

                window.fetchAuth = (url, init) => {
                    if (url.indexOf('?') !== -1) {
                        url += '&token=' + this.token;
                    } else {
                        url += '?token=' + this.token;
                    }

                    return fetch(url, init);
                };

                return this.comms.initializeSocket();
            });
    }

    lock(lock) {
        this.setState({locked: lock});
    }

    nextStep() {
        const {stepIndex} = this.state;

        let options = {
            finished: stepIndex >= 3,
            stepIndex: stepIndex
        }

        if (stepIndex === 3 && !this.linker.done) {
            this.linker.login();
            options.lastStepText = 'Reset';
            this.setState(options);
            return;
        } else if (stepIndex == 3) {
            this.setState(this.defaultState);
            return;
        }

        options.stepIndex += 1;
        this.setState(options);
    }

    previousStep() {
        const {stepIndex} = this.state;
        if (stepIndex > 0) {
            this.setState({stepIndex: stepIndex - 1, lastStepText: 'Save to Spotify' });
        }
    }

    canStepForward() {
        return (this.state.stepIndex == 0 && this.state.seedTracks.length > 0)
            || (this.state.stepIndex == 1)
            || (this.state.stepIndex == 2 && this.state.generatedTracks.length > 0)
            || (this.state.stepIndex == 3);
    }

    getStepContent(step) {
        step = step || this.state.stepIndex;
        switch(step) {
            case 0:
                return (<SeedTrackPicker defaultTracks={this.state.seedTracks} onChanged={(tracks) => this.setState({seedTracks: tracks})} lock={this.lock}/>);
            case 1:
                return (<DiscovererSettings defaultOptions={this.state.options} onChanged={(options) => this.setState({options: options})} lock={this.lock}/>);
            case 2:
                const options = this.state.options;
                options.seeds = this.state.seedTracks;
                return (<GeneratedTracks options={options} onChanged={(tracks) => this.setState({generatedTracks: tracks})} lock={this.lock} comms={this.comms}/>);
            case 3:
               return (<Linker ref ={linker => this.linker = linker} tracks={this.state.generatedTracks} onChanged={(tracks, saved) => this.setState({spotifyTracks: tracks, saved: saved})} lock={this.lock} comms={this.comms} token={this.token}/>);
            default:
                return "Start over";
        }
    }

    render() {
        const {finished, stepIndex} = this.state;
        const contentStyle = {margin: '0 16px'};

        return (
            <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
            <Stepper activeStep={stepIndex}>
            <Step>
                <StepLabel>Seed</StepLabel>
            </Step>
            <Step>
                <StepLabel>Configure</StepLabel>
            </Step>
            <Step>
                <StepLabel>Generate</StepLabel>
            </Step>
            <Step>
                <StepLabel>Save</StepLabel>
            </Step>
            </Stepper>
            <div style={contentStyle}>
            <div>
                {this.getStepContent(stepIndex)}
                <div style={{marginTop: 12}}>
                    <FlatButton
                    label="Back"
                    disabled={stepIndex === 0 || this.state.locked || finished}
                    onTouchTap={this.previousStep}
                    style={{marginRight: 12}}
                    />
                    <RaisedButton
                    label={stepIndex === 3 ? this.state.lastStepText : 'Next'}
                    primary={true}
                    onTouchTap={this.nextStep}
                    disabled={!this.canStepForward() || this.state.locked || !this.state.hasToken}
                    />
                </div>
                </div>
            </div>
        </div>);
    }
}