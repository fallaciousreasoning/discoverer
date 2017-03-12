import React from 'react';

import AutoComplete from 'material-ui/AutoComplete';

export default class TrackSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            query: "",
            dataSource: [],
        };

        this.render = this.render.bind(this);
        this.handleUpdateInput = this.handleUpdateInput.bind(this);
    }

    handleUpdateInput(value) {
        this.setState({
            dataSource: [
                "We Will Fall Together by Streetlight Manifesto",
                "Dead Silence by Billy Talent",
            ]
        });
    }

    render() {
        return (
            <div>
                <AutoComplete
                    hintText="Search for a track"
                    dataSource={this.state.dataSource}
                    onUpdateInput={this.handleUpdateInput}/>
            </div>
        );
    }
}