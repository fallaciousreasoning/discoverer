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
        this.handleNewRequest = this.handleNewRequest.bind(this);
    }

    handleNewRequest(chosenRequest, index) {
        if (index == -1) return;

        let track = {
            name: "Dead Silence",
            artist: "Billy Talent",
            cover: "https://lastfm-img2.akamaized.net/i/u/174s/fcb003397a384302bde911d932f1dcca.jpg"
        }

        if (this.props.onSelect) {
            this.props.onSelect(track);
        }

        this.setState({
            query: ""
        });
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
                    searchText={this.state.query}
                    dataSource={this.state.dataSource}
                    onUpdateInput={this.handleUpdateInput}
                    onNewRequest={this.handleNewRequest}
                    fullWidth={true}/>
            </div>
        );
    }
}