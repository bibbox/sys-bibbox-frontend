import React    from 'react';
import ReactDOM from 'react-dom';
import jQuery   from 'jquery';


/* Renders the log of an instance */

const Log = React.createClass({
	getInitialState() {
		return {
            log: '',
            break: true,
            autoScroll: true
		}
	},
  
	componentDidMount() {
        get(jQuery, '/api/jsonws/BIBBOXDocker-portlet.get-instance-log', {
			instanceId: this.props.params.param2,
			logtype: this.props.params.param4
		},
		function(result) {
			this.setState({ log: result.log });
		  
			jQuery('#loader').stop().fadeOut(300);
			jQuery(ReactDOM.findDOMNode(this)).fadeIn(500);
            
            const container = jQuery(ReactDOM.findDOMNode(this)).find('#app-log-container');
            if(this.state.autoScroll) {
                container.animate({scrollTop: container[0].scrollHeight - container.height()}, 1000, () => {
                    this.setState({ break: false });
                });
            }
            
            setInterval(() => {
                get(jQuery, '/api/jsonws/BIBBOXDocker-portlet.get-instance-log', {
                    instanceId: this.props.params.param2,
                    logtype: this.props.params.param4
                },
                function(result) {
                    const isBreak = (this.state.autoScroll) ? true : false;
                    
                    this.setState({
                        log: result.log,
                        break: isBreak
                    });
                    
                    if(isBreak) {
                        container.animate({scrollTop: container[0].scrollHeight - container.height()}, 1000, () => {
                            this.setState({ break: false });
                        });
                    }
                }.bind(this));
            }, 3000);
		}.bind(this));
	},
    
    scrollEvent(e) {
        if(!this.state.break) {
            const container = jQuery(ReactDOM.findDOMNode(this)).find('#app-log-container');
            const autoScroll = (container.scrollTop() >= parseInt(container[0].scrollHeight - container.height()) - 50) ? true : false;
            
            this.setState({ autoScroll: autoScroll });
        }
    },
    
	render() {
		return (
            <div id="app-log">
                <div id="app-log-container" onScroll={this.scrollEvent} dangerouslySetInnerHTML={{__html: this.state.log.replace(/\n/gi, "<br />")}}></div>
                <div id="app-log-navigation">
			  		<button onClick={() => { window.close(); }}>Close</button>
				</div>
            </div>
		);
	}
});


module.exports = Log;