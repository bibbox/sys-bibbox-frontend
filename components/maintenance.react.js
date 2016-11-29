import React    from 'react';
import ReactDOM from 'react-dom';
import jQuery   from 'jquery';


/* Renders the maintenance page of an instance */

const Maintenance = React.createClass({
	getInitialState() {
		return {
            content: ''
		}
	},
  
	componentDidMount() {
        get(jQuery, '/api/jsonws/BIBBOXDocker-portlet.get-instance-maintenance', {
			instanceId: this.props.params.param2,
			logtype: this.props.params.param4
		},
		function(result) {
			this.setState({
                content: result.maintenance
			});
		  
			jQuery('#loader').stop().fadeOut(300);
			jQuery(ReactDOM.findDOMNode(this)).fadeIn(500);
		}.bind(this));
	},
    
	render() {
		return (
            <div id="app-maintenance">
                <div id="app-maintenance-container" dangerouslySetInnerHTML={{__html: this.state.content}}></div>
                <div id="app-maintenance-navigation">
			  		<button onClick={() => { window.close(); }}>Close</button>
				</div>
            </div>
		);
	}
});


module.exports = Maintenance;