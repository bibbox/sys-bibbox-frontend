import React from 'react';
import ReactDOM from 'react-dom';
import jQuery   from 'jquery';


/* Renders a confirmation popup with the given text */

const Confirm = React.createClass({
    componentWillReceiveProps(nextProps) {
        if(nextProps.text == null || nextProps.action == null) {
            jQuery(ReactDOM.findDOMNode(this)).fadeOut(300);
        }
        else {
            jQuery(ReactDOM.findDOMNode(this)).fadeIn(500);
        }
    },
    
    confirm() {
        this.props.action();
        this.props.reset();
        
        jQuery(ReactDOM.findDOMNode(this)).fadeOut(300);
    },
    
    cancel() {
        this.props.reset();
        
        jQuery(ReactDOM.findDOMNode(this)).fadeOut(300);
    },
    
    render: function() {
        return (
            <div className="confirm-wrapper">
                <div className="confirm-body">
                    {this.props.text}
                    <br />
                    <br />
                    <button onClick={this.cancel}>Cancel</button>
                    <button onClick={this.confirm}>Confirm</button>
                </div>
            </div>
        );
    }
});


module.exports = Confirm;