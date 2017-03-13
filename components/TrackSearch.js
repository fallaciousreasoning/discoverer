import React from 'react';

import AutoComplete from 'material-ui/AutoComplete';

const search = (query) => {
    return fetch('search/' + query)
        .then(response => response.json()
            , error => {
                return error;
        })
        .then(json => {
            console.log(json);
            return json.response;
        });
};

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
        this.tracks = [];
    }

    handleNewRequest(chosenRequest, index) {
        if (index == -1) return;

        let track = this.tracks[index];

        if (this.props.onSelect) {
            this.props.onSelect(track);
        }

        this.setState({
            query: ""
        });
    }

    handleUpdateInput(value) {
        search(value)
            .then(tracks => {
                let dataSource = tracks.map(track => {
                    return track.name + ' by ' + track.artist;
                });

                this.tracks = tracks;
                this.setState({dataSource: dataSource});
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