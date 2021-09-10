import React, {Component} from 'react';

class BigButton extends Component {
    render() {
        return (
            <div className="big-button" onClick={e => { this.props.onClick(); }}>{this.props.children}</div>
        );
    }
}

export default BigButton;
