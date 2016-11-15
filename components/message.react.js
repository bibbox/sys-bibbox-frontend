import React from 'react';
import ReactDOM from 'react-dom';


/* Renders a message popup with the given text */

const Message = React.createClass({
    render: function() {
        return (
            <div className="message-wrapper">
                <div className="message-body">
                    {this.props.text}
                </div>
            </div>
        );
    }
});


module.exports = Message;