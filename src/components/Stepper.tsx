import MUIStep from '@material-ui/core/Step';
import MUIStepper from '@material-ui/core/Stepper';
import * as React from 'react';

export interface StepProps {
    name: string;
    progress?: number;
}

export class Step extends React.Component<StepProps> {
    public render() {
        return this.props.children;
    }
}

type StepChildType = { props: StepProps };
type ButtonChildType = (props: StepButtonProps) => JSX.Element;
type ChildType = StepChildType | (StepChildType | ButtonChildType)[] | ButtonChildType;

interface StepButtonProps {
    currentStepProps: StepProps;
    complete: boolean;
    firstStep: boolean;
    lastStep: boolean;
}

interface Props {
    activeStep: number;
    vertical?: boolean;
    children: ChildType;

    renderHorizontalContentAs?: string | React.ComponentType<StepProps> | React.ComponentType;
}

export class Stepper extends React.Component<Props> {
    public static defaultProps: Partial<Props> = {
        renderHorizontalContentAs: React.Fragment
    };

    public render() {
        const children = (Array.isArray(this.props.children) ? this.props.children : [this.props.children]) as (StepChildType | ButtonChildType)[];
        const buttons: ButtonChildType[] = [];
        const steps: StepChildType[] = [];

        // TODO reduce rerendering
        children.forEach(child => {
            if (typeof child === "function") {
                buttons.push(child);
            } else {
                steps.push(child);
            }
        });

        const activeStep = steps[this.props.activeStep];
        const buttonProps: StepButtonProps = {
            currentStepProps: activeStep.props,
            firstStep: this.props.activeStep === 0,
            lastStep: this.props.activeStep === steps.length - 1,
            complete: activeStep.props.progress === undefined || activeStep.props.progress === 1
        }

        return <>
            <MUIStepper activeStep={this.props.activeStep} orientation={this.props.vertical ? 'vertical' : 'horizontal'}>
                {steps.map(step => step && <MUIStep key={step.props.name}>
                    {step.props.name}
                    {this.props.vertical ? <>{step}</> : <React.Fragment />}
                </MUIStep>)}
            </MUIStepper>
            {!this.props.vertical && <this.props.renderHorizontalContentAs {...activeStep.props}>
                {activeStep}
                {buttons.map((button, i) => <React.Fragment key={i}>
                    {button(buttonProps)}
                </React.Fragment>)}
            </this.props.renderHorizontalContentAs>}
        </>;
    }
}