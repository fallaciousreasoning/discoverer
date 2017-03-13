import React from 'react';
import Track from './Track';
import TrackSearch from './TrackSearch';
import DiscovererSettings from './DiscovererSettings';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';

import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';

export default class GeneratorPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tracks: [],
            options: {},
            finished: false,
            stepIndex: 0
        }

        this.nextStep = this.nextStep.bind(this);
        this.previousStep = this.previousStep.bind(this);
        this.getStepContent = this.getStepContent.bind(this);
        this.render = this.render.bind(this);
    }

    nextStep() {
        const {stepIndex} = this.state;
        this.setState({
            stepIndex: stepIndex + 1,
            finished: stepIndex >= 2,
        });
    }

    previousStep() {
        const {stepIndex} = this.state;
        if (stepIndex > 0) {
            this.setState({stepIndex: stepIndex - 1});
        }
    }

    getStepContent(step) {
        step = step || this.state.stepIndex;

        switch(step) {
            case 0:
                return "Select tracks";
            case 1:
                return "Configure advanced options";
            case 2:
                return "Save playlist to spotify";
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
                <StepLabel>Select seed tracks</StepLabel>
            </Step>
            <Step>
                <StepLabel>Configure generator</StepLabel>
            </Step>
            <Step>
                <StepLabel>Save to spotify</StepLabel>
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
                <p>{this.getStepContent(stepIndex)}</p>
                <div style={{marginTop: 12}}>
                    <FlatButton
                    label="Back"
                    disabled={stepIndex === 0}
                    onTouchTap={this.previousStep}
                    style={{marginRight: 12}}
                    />
                    <RaisedButton
                    label={stepIndex === 2 ? 'Finish' : 'Next'}
                    primary={true}
                    onTouchTap={this.nextStep}
                    />
                </div>
                </div>
            )}
            </div>
        </div>);
    }
}