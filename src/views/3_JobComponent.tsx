import * as React from "react";
import {Job} from "../shell/Job";
import {PromptComponent} from "./4_PromptComponent";
import {BufferComponent} from "./BufferComponent";

interface Props {
    job: Job;
    isFocused: boolean;
}

interface State {
    decorate: boolean;
}

export class JobComponent extends React.Component<Props, State> {
    private _promptComponent: PromptComponent;

    constructor(props: Props) {
        super(props);

        this.state = {
            decorate: true,
        };
    }

    componentDidMount() {
        this.props.job
            .on("data", () => this.forceUpdate())
            .on("status", () => this.forceUpdate());
    }

    promptComponent(): PromptComponent {
        return this._promptComponent;
    }

    render() {
        let buffer: React.ReactElement<any>;
        let canBeDecorated = this.props.job.canBeDecorated();
        if (this.props.job.interceptionResult && this.state.decorate) {
            buffer = this.props.job.interceptionResult;
        } else if (canBeDecorated && this.state.decorate) {
            buffer = this.props.job.decorate();
        } else {
            buffer = <BufferComponent job={this.props.job}/>;
        }

        return (
            <div className={"job"}>
                <PromptComponent
                    job={this.props.job}
                    ref={promptComponent => { this._promptComponent = promptComponent; }}
                    status={this.props.job.status}
                    isFocused={this.props.isFocused}
                    showDecorationToggle={!!this.props.job.interceptionResult || canBeDecorated}
                    decorateToggler={() => {
                        if (this.props.job.interceptionResult) {
                            // Re-execute without intercepting
                            this.props.job.execute({ allowInterception: false });
                        }
                        // Show non-decorated output
                        this.setState({decorate: !this.state.decorate});
                    }}
                    isDecorated={this.state.decorate}
                 />
                {buffer}
            </div>
        );
    }
}
