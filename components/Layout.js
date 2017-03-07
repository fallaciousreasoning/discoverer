import React from 'react';
import { Link } from 'react-router';

export default class Layout extends React.Component {
    render() {
        return (
            <div className="app-container">
                <header>
                    Hello World?
                </header>
                <div className="app-content">{this.props.children}</div>
                <footer>
                    <p>
                        Hopefully I'm helping you discover music..
                    </p>
                </footer>
            </div>
        );
    }
}