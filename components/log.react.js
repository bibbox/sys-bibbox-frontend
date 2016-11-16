import React    from 'react';
import ReactDOM from 'react-dom';
import jQuery   from 'jquery';


/* Renders the log of an instance */

const Log = React.createClass({
	getInitialState() {
		return {
            log: '',
            applicationname: '',
            version: '',
            longname: ''
		}
	},
  
	componentDidMount() {
        get(jQuery, '/api/jsonws/BIBBOXDocker-portlet.get-instance-log', {
			instanceId: this.props.params.param2,
			logtype: this.props.params.param4
		},
		function(result) {
			this.setState({
                log: result.log,
                applicationname: result.applicationname,
                version: result.version,
                longname: result.instancename
			});
		  
			jQuery('#loader').stop().fadeOut(300);
			jQuery(ReactDOM.findDOMNode(this)).fadeIn(500);
		}.bind(this));
	},
    
	render() {
		return (
            <div id="app-log">
                <div className="app-log-header">
					<span className="app-log-title">
						<img src={'http://datastore.development.bibbox.org/bibbox/' + this.state.applicationname + '/blob/' + this.state.version + '/icon.png'} />
						<h1>{this.state.longname}</h1>
					</span>
				</div>
                <div id="app-log-container" dangerouslySetInnerHTML={{__html: this.state.log.replace(/\n/gi, "<br />")}}></div>
                <div id="app-log-navigation">
			  		<button onClick={() => { window.close(); }}>Close</button>
				</div>
            </div>
		);
	}
});


module.exports = Log;