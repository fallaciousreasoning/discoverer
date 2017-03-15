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

import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';

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
            stepIndex: 2
        }

        this.nextStep = this.nextStep.bind(this);
        this.previousStep = this.previousStep.bind(this);
        this.getStepContent = this.getStepContent.bind(this);
        this.canStepForward = this.canStepForward.bind(this);
        this.render = this.render.bind(this);
    }

    nextStep() {
        const {stepIndex} = this.state;
        this.setState({
            stepIndex: stepIndex + 1,
            finished: stepIndex >= 3,
        });
    }

    previousStep() {
        const {stepIndex} = this.state;
        if (stepIndex > 0) {
            this.setState({stepIndex: stepIndex - 1});
        }
    }

    canStepForward() {
        return (this.state.stepIndex == 0 && this.state.seedTracks.length > 0)
            || (this.state.stepIndex == 1)
            || (this.state.stepIndex == 2 && this.state.generatedTracks.length > 0)
            || (this.state.stepIndex == 3 && this.state.saved);
    }

    getStepContent(step) {
        step = step || this.state.stepIndex;
        switch(step) {
            case 0:
                return (<SeedTrackPicker defaultTracks={this.state.seedTracks} onChanged={(tracks) => this.setState({seedTracks: tracks})}/>);
            case 1:
                return (<DiscovererSettings defaultOptions={this.state.options} onChanged={(options) => this.setState({options: options})}/>);
            case 2:
                const options = this.state.options;
                options.seeds = this.state.seedTracks;
                return (<GeneratedTracks options={options} onChanged={(tracks) => this.setState({generatedTracks: tracks})}/>);
            case 3:
               return (<Linker tracks={this.state.generatedTracks} onChanged={(tracks, saved) => this.setState({spotifyTracks: tracks, saved: saved})}/>);
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
                <StepLabel>Link</StepLabel>
            </Step>
            </Stepper>
            <div style={contentStyle}>
            {finished ? (
                <p>
                <a
                    href="#"
                    onClick={(event) => {
                    event.preventDefault();
                    this.setState({stepIndex: 0, finished: false});
                    }}
                >
                    Click here
                </a> to reset the generator.
                </p>
            ) : (
                <div>
                {this.getStepContent(stepIndex)}
                <div style={{marginTop: 12}}>
                    <FlatButton
                    label="Back"
                    disabled={stepIndex === 0}
                    onTouchTap={this.previousStep}
                    style={{marginRight: 12}}
                    />
                    <RaisedButton
                    label={stepIndex === 3 ? 'Finish' : 'Next'}
                    primary={true}
                    onTouchTap={this.nextStep}
                    disabled={!this.canStepForward()}
                    />
                </div>
                </div>
            )}
            </div>
        </div>);
    }
}