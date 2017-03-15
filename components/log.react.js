import React    from 'react';
import ReactDOM from 'react-dom';
import jQuery   from 'jquery';


/* Renders the log of an instance */

const Log = React.createClass({
	getInitialState() {
		return {
            logs: [],
            shortname: '',
            longname: '',
            application: '',
            version: '',
            url: ''
		}
	},
  
	componentDidMount() {
        get(jQuery, '/api/jsonws/BIBBOXDocker-portlet.get-instance-log', {
			instanceId: this.props.params.param2
		},
		function(result) {
            for(let i = 0; i < result.logs.length; i++) {
                result.logs[i].break = true;
                result.logs[i].autoScroll = true;
            }
            
			this.setState({
                logs: result.logs,
                shortname: result.instanceshortname,
                longname: result.longname,
                application: result.application,
                version: result.version,
                url: result.url
            });
		  
			jQuery('#loader').stop().fadeOut(300);
			jQuery(ReactDOM.findDOMNode(this)).fadeIn(500);
            
            this.state.logs.forEach((log, i) => {
                const container = jQuery(ReactDOM.findDOMNode(this)).find('.app-log-container.' + log.containername);
                
                if(this.state.logs[i].autoScroll) {
                    container.animate({scrollTop: container[0].scrollHeight - container.height()}, 1000, () => {
                        let state = this.state;
                        state.logs[i].break = false;
                        this.setState(state);
                    });
                }
            });
            
            setInterval(() => {
                get(jQuery, '/api/jsonws/BIBBOXDocker-portlet.get-instance-log', {
                    instanceId: this.props.params.param2
                },
                function(result) {
                    let state = this.state;
                    
                    for(let i = 0; i < state.logs.length; i++) {
                        state.logs[i].break = this.state.logs[i].autoScroll;
                        state.logs[i].log = result.logs[i].log;
                    }
                    
                    this.setState(state);
                    
                    this.state.logs.forEach((log, i) => {
                        const container = jQuery(ReactDOM.findDOMNode(this)).find('.app-log-container.' + log.containername);
                        
                        if(log.break) {
                            container.animate({scrollTop: container[0].scrollHeight - container.height()}, 1000, () => {
                                let state = this.state;
                                state.logs[i].break = false;
                                this.setState(state);
                            });
                        }
                    });
                }.bind(this));
            }, 3000);
		}.bind(this));
	},
    
    scrollEvent(e) {
        this.state.logs.forEach((log, i) => {
            if(!log.break) {
                const container = jQuery(ReactDOM.findDOMNode(this)).find('.app-log-container.' + log.containername);
                const autoScroll = (container.scrollTop() >= parseInt(container[0].scrollHeight - container.height()) - 50) ? true : false;

                let state = this.state;
                state.logs[i].autoScroll = autoScroll;
                this.setState(state);
            }
        });
    },
    
	render() {
		return (
            <div id="app-log">
                <div className="app-log-header">
                    <span className="app-log-title" onClick={() => { const win = window.open(this.state.url, '_blank'); win.focus(); }}>
                        <img src={datastore + '/bibbox/' + this.state.application + '/blob/' + this.state.version + '/icon.png'} />
                        <h1>{this.state.shortname}</h1>
                        <h3>{this.state.longname}</h3>
                    </span>
                </div>
                <div id="tab-nav">
                    <span className="tab-nav-item">
                        <a href={'/instance/id/' + params.param2 + '/dashboard'}>
                            Dashboard
                        </a>
                    </span>
                    <span className="tab-nav-item active">
                        <a href={'/instance/id/' + params.param2 + '/log'}>
                            Logs
                        </a>
                    </span>
                </div>
                {
                    this.state.logs.map((log) => {
                        const command = (log.cmd != '') ? <span className="app-log-command">{"$ " + log.cmd}</span> : '';
                        let lines = log.log.replace(/\n/gi, "<br />");
                        if(lines.startsWith("<br />")) {
                            lines = lines.substr(6);
                        }
            
                        return (
                            <div key={log.containername} className="app-log-item">
                                <span className="app-log-containername">{log.containername}</span>
                                {command}
                                <div
                                    className={"app-log-container " + log.containername}
                                    onScroll={this.scrollEvent}
                                    dangerouslySetInnerHTML={{__html: lines}}
                                ></div>
                            </div>
                        );
                    })
                }
            </div>
		);
	}
});


module.exports = Log;