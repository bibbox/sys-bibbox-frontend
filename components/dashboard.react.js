import React    from 'react';
import ReactDOM from 'react-dom';
import jQuery   from 'jquery';
import TinyMCE  from 'react-tinymce';
import { defaults, Line }   from 'react-chartjs-2';
import Confirm  from './confirm.react';


/* Renders the instance information screen */

defaults.global.animation = false;
defaults.global.legend.display = false;
defaults.global.tooltips.enabled = false;

const Dashboard = React.createClass({
	getInitialState() {
		return {
            name: '',
            shortname: '',
			shortnameError: false,
			nameError: false,
            status: 'stopped',
            maintenance: false,
            maintenance_description: null,
            short_description: null,
            long_description: null,
            notes: null,
            confirm_text: null,
            confirm_action: null,
            applicationname: '',
            version: '',
            url: '',
		  	log: ''
		}
	},
  
	componentDidMount() {
        get(jQuery, '/api/jsonws/BIBBOXDocker-portlet.get-instance-dashboard', {
			instanceId : this.props.params.param2
		},
		function(result) {
			this.setState({
                name: result.instancename,
                shortname: result.instanceshortname,
                status: result.status,
                maintenance: result.ismaintenance,
                maintenance_description: result.maintenance,
                short_description: result.shortdescription,
                notes: result.adminnode,
                long_description: result.longdescription,
                applicationname: result.applicationname,
                version: result.version,
                url: result.url
			});
		  
			jQuery('#loader').stop().fadeOut(300);
			jQuery(ReactDOM.findDOMNode(this)).fadeIn(500);
            
            this.updateStatus();
		}.bind(this));
	  
        this.getLog();
        
		setInterval(() => {
		  	this.getLog();
		}, 3000);
	},
  
  	getLog() {
		get(jQuery, '/api/jsonws/BIBBOXDocker-portlet.get-instance-log', {
			instanceId: this.props.params.param2,
			logtype: 'general',
		  	lines: 10
		},
		function(result) {
			this.setState({ log: result.log });
		}.bind(this));
	},
    
    updateStatus() {
        setInterval(() => {
            get(jQuery, '/api/jsonws/BIBBOXDocker-portlet.get-instance-dashboard', {
                instanceId : this.props.params.param2
            },
            function(result) {
                this.setState({ status: result.status });
            }.bind(this));
        }, 3000);
    },
  
	componentWillUnmount() {
	  	clearInterval(this.state.interval);
	},
	
	random(min, max, num) {
		var rtn = [];
		while (rtn.length < num) {
		  	rtn.push((Math.random() * (max - min)) + min);
		}
		return rtn;
	},
    
    startStop() {
        switch(this.state.status) {
            case 'stopped':
                this.setState({
                    confirm_text: 'Are you sure, you want to start this application?',
                    confirm_action: () => {
                        get(jQuery, '/api/jsonws/BIBBOXDocker-portlet.set-instance-status', {
                            instanceId: this.props.params.param2,
                            status: 'start'
                        },
                        function(result) {
                            this.setState({ status: result.status });
                            // alert('Application has started!');
                        }.bind(this))
                    }
                });
                break;
            default:
                this.setState({
                    confirm_text: 'Are you sure, you want to stop this application?',
                    confirm_action: () => {
                        get(jQuery, '/api/jsonws/BIBBOXDocker-portlet.set-instance-status', {
                            instanceId: this.props.params.param2,
                            status: 'stop'
                        },
                        function(result) {
                            this.setState({ status: result.status });
                            // alert('Application has stopped!');
                        }.bind(this))
                    }
                });
        }
    },
    
    restart() {
        this.setState({
            confirm_text: 'Are you sure, you want to restart this application?',
            confirm_action: () => {
                get(jQuery, '/api/jsonws/BIBBOXDocker-portlet.set-instance-status', {
                    instanceId: this.props.params.param2,
                    status: 'restart'
                },
                function(result) {
                    this.setState({ status: result.status });
                    // alert('Application has restarted!');
                }.bind(this));
            }
        });
    },
    
    toggleMaintenance() {
        get(jQuery, '/api/jsonws/BIBBOXDocker-portlet.toggle-instance-maintenance-status', {
            instanceId: this.props.params.param2
        },
        function(result) {
            this.setState({ maintenance: result.ismaintenance });
        }.bind(this));
    },
    
    delete() {
        this.setState({
            confirm_text: 'Are you sure, you want to delete this application?',
            confirm_action: () => {
                get(jQuery, '/api/jsonws/BIBBOXDocker-portlet.delete-instance-status', {
                    instanceId: this.props.params.param2
                },
                function() {
                    // alert('The app has successfully been deleted!');
                    window.location = '/instances';
                }.bind(this));
            }
        });
    },
    
    confirmReset() {
        this.setState({
            confirm_text: null,
            confirm_action: null
        });
    },
    
    maintenanceDescChange(e) {
        this.setState({ maintenance_description: e.target.getContent() });
    },
    
    shortDescChange(e) {
        this.setState({ short_description: e.target.getContent() });
    },
    
    longDescChange(e) {
        this.setState({ long_description: e.target.getContent() });
    },
    
    notesChange(e) {
        this.setState({ notes: e.target.getContent() });
    },
  
	fieldChange(id, regex = null, event) {
		let state = this.state;
		let shortnameError = this.state.shortnameError;
		let nameError = this.state.nameError;
		
		state[id] = event.target.value;
		
		if(regex == null || event.target.value == '') {
			jQuery(event.target).removeClass('right wrong');
			
			if(id == 'shortname') { shortnameError = true; }
			else if(id == 'name') { nameError = true; }
		}
		else if(regex != null && event.target.value.match(new RegExp(regex, 'g')) != null) {
			jQuery(event.target).addClass('right').removeClass('wrong');
			
			if(id == 'shortname') { shortnameError = false; }
			else if(id == 'name') { nameError = false; }
		}
		else {
			jQuery(event.target).addClass('wrong').removeClass('right');
			
			if(id == 'shortname') { shortnameError = true; }
			else if(id == 'instancename') { nameError = true; }
		}
		
		state.shortnameError = shortnameError;
		state.nameError = nameError;
		
		this.setState(state);
	},
    
    save() {
		if(this.state.shortnameError || this.state.nameError) {
			alert('One or more fields are not filled out correctly. Please correct the fields and try again.');
			return;
		}
	  
		let data = [{ "/BIBBOXDocker-portlet.update-instance-info": {
            instanceId: this.props.params.param2,
            instancename: this.state.name,
            instanceshortname: this.state.shortname,
            description: this.state.long_description,
            shortdescription: this.state.short_description,
            adminnode: this.state.notes,
            maintenance: this.state.maintenance_description
        }}];
		
		post(jQuery, '/api/jsonws/invoke', data, function() {
			window.location = '/instance/id/' + this.props.params.param2 + '/dashboard';
		}.bind(this));
    },
	
	render() {
        const startstop = (this.state.status == 'running') ? 'Stop' : 'Start';
        const version = (this.state.version == 'development') ? 'master' : this.state.version;
        const maintenance = (this.state.maintenance) ? 'Stop Maintenance' : 'Start Maintenance';
        let status = this.state.status;
        let controls = '';
        
        switch(status) {
            case 'installing':
                controls = <div className="app-dashboard-controls"><span className="installing">Currently installing...</span></div>;
                break;
            case 'starting':
                controls = <div className="app-dashboard-controls"><span className="starting">Currently starting...</span></div>;
                break;
            case 'stopping':
                controls = <div className="app-dashboard-controls"><span className="stopping">Currently stopping...</span></div>;
                break;
            case 'restarting':
                controls = <div className="app-dashboard-controls"><span className="restarting">Currently restarting...</span></div>;
                break;
            case 'deleting':
                controls = <div className="app-dashboard-controls"><span className="deleting">Currently deleting...</span></div>;
                break;
            default:
                status = (status == 'running' && this.state.maintenance) ? 'maintenance' : status;
                
                controls = <div className="app-dashboard-controls">
                    <span className={'status ' + status}> </span>
                    <button onClick={this.startStop}>
                        <svg viewBox="0 0 1000 1000">
                          <path d="M451.523,528.59V47.615c0-26.233,21.267-47.5,47.5-47.5s47.5,21.267,47.5,47.5V528.59c0,26.233-21.267,47.5-47.5,47.5S451.523,554.823,451.523,528.59z M711.563,158.396c-23.034-12.554-51.885-4.056-64.438,18.98s-4.055,51.885,18.98,64.438c113.472,61.835,183.962,180.438,183.962,309.526c0,94.084-36.639,182.536-103.165,249.063c-66.527,66.527-154.979,103.166-249.063,103.166s-182.537-36.639-249.064-103.166S145.609,645.424,145.609,551.34c0-129.281,70.646-247.969,184.369-309.747c23.052-12.522,31.587-41.361,19.065-64.413c-12.522-23.052-41.362-31.586-64.413-19.065C140.281,236.53,50.609,387.206,50.609,551.34c0,60.354,11.831,118.929,35.165,174.097c22.528,53.261,54.769,101.085,95.826,142.143c41.057,41.057,88.881,73.298,142.143,95.825c55.167,23.334,113.742,35.165,174.097,35.165s118.93-11.831,174.097-35.165c53.261-22.527,101.085-54.769,142.142-95.826c41.058-41.057,73.298-88.881,95.825-142.143c23.334-55.167,35.165-113.741,35.165-174.096C945.068,387.45,855.595,236.883,711.563,158.396z" />
                        </svg>
                        <span className="text">{startstop}</span>
                    </button>
                    {
                        (this.state.status != 'stopped') ?
                            <button onClick={this.restart}>
                                <svg viewBox="0 0 1000 1000">
                                    <path d="M992.001,507.999c0,66.4-13.015,130.838-38.683,191.522c-24.782,58.593-60.251,111.205-105.421,156.375s-97.782,80.639-156.375,105.421C630.838,986.985,566.4,1000,500,1000s-130.838-13.015-191.523-38.683c-58.592-24.782-111.204-60.251-156.373-105.421c-45.171-45.17-80.64-97.782-105.422-156.375C21.014,638.837,7.999,574.399,7.999,507.999c0-94.006,26.612-185.405,76.962-264.315c32.16-50.405,72.985-94.28,120.361-129.74l-65.975-97.322L459.096,0L325.479,291.191l-69.749-102.89c-37.34,28.562-69.592,63.569-95.152,103.63c-41.137,64.473-62.881,139.188-62.881,216.068c0,107.459,41.848,208.486,117.832,284.471C291.514,868.455,392.541,910.302,500,910.302s208.486-41.847,284.471-117.832c75.985-75.984,117.831-177.012,117.831-284.471c0-65.419-16.042-130.34-46.392-187.744c-29.407-55.622-72.15-104.294-123.606-140.756c-20.21-14.321-24.983-42.314-10.663-62.524c14.321-20.21,42.315-24.984,62.524-10.664c62.867,44.548,115.097,104.031,151.042,172.018C972.361,348.603,992.001,428.021,992.001,507.999z" />
                                </svg>
                                <span className="text">Restart</span>
                            </button>
                            : ''
                    }
                    {
                        (this.state.status != 'stopped') ?
                            <button onClick={this.toggleMaintenance}>
                                <svg viewBox="0 0 1000 1000">
                                    <path d="M508.461,644.761c9.771,9.351,6.007,15.672,1.287,25.198c-28.07,56.666-61.301,109.324-104.846,155.96c-45.203,48.416-87.561,99.534-130.187,150.289c-13.901,16.557-30.232,24.049-51.073,23.785c-55.451,0.118-130.938-66.669-137.815-122c-2.489-20.021,4.187-37.004,17.511-51.715c63.182-69.754,125.223-140.596,190.056-208.781c29.371-30.892,71.061-46.046,106.302-69.661c7.725-5.18,11.834,0.455,16.439,5.064C446.818,583.614,477.106,614.745,508.461,644.761z M603.357,406.12c-5.879-9.308,8.673-15.571,14.986-21.875c67.247-67.112,134.915-133.805,202.521-200.555c9.291-9.172,20.08-17.083,12.802-33.149c-4.514-9.962,3.651-14.387,11.003-18.615c24.808-14.27,49.528-28.696,74.261-43.097c23.623-13.756,27.426,12.698,40.395,20.265c12.349,7.203,6.071,16.042-0.038,24.494c-11.98,16.576-24.018,33.145-35.16,50.282c-9.636,14.825-18.641,28.753-40.146,24.285c-10.6-2.203-15.541,7.791-21.594,13.964c-68.213,69.589-136.194,139.404-204.425,208.975c-4.885,4.98-8.571,12.03-18.643,13.51C627.468,432.374,612.725,420.946,603.357,406.12z M485.574,316.548c-28.429-28.289-43.506-60.784-41.328-100.997c0.979-18.115-1.087-35.942-4.824-53.674C414.447,43.385,279.865-31.684,172.242,13.1c2.268,8.547,9.75,12.903,15.369,18.576c33.462,33.779,66.722,67.781,101.031,100.683c11.156,10.697,13.919,20.753,8.297,34.71c-19.062,47.327-52.535,80.061-99.271,99.755c-14.577,6.143-25.285,3.005-36.721-8.99c-37.789-39.635-76.965-77.944-117.606-118.769C-4.187,277.737,98.948,417.521,242.535,414.136c36.301-0.855,68.912,6.76,94.684,32.339c105.849,105.053,215.092,206.666,318.084,314.625c48.08,50.396,96.999,100.018,146.469,149.05c29.506,29.243,65.495,35.967,104.33,21.702c38.462-14.126,58.418-43.541,62.373-83.557c3.505-35.465-13.02-62.549-37.414-86.857C782.4,613.307,634.326,464.587,485.574,316.548z M866.8,874.33c-21.998,0.255-40.201-18.544-39.425-40.708c0.753-21.337,18.438-38.07,39.747-37.607c21.161,0.463,38.957,18.41,38.761,39.089C905.685,855.597,887.261,874.091,866.8,874.33z" />
                                </svg>
                                <span className="text">{maintenance}</span>
                            </button>
                            : ''
                    }
                    {
                        (this.state.status != 'running') ? 
                            <button onClick={this.delete}>
                                <svg viewBox="0 0 128 128">
                                    <path d="M110.3,15.4c0,3-2.4,5.4-5.4,5.4H23.1c-3,0-5.4-2.4-5.4-5.4s2.4-5.4,5.4-5.4h30.5C53.8,4.5,58.4,0,64,0s10.2,4.5,10.4,10.1h30.5C107.9,10.1,110.3,12.5,110.3,15.4z M107.3,28.5c1,1.1,1.5,2.6,1.4,4.1l-7.1,90.5c-0.2,2.8-2.6,5-5.4,5H31.8c-2.8,0-5.1-2.2-5.4-5l-7.1-90.5c-0.1-1.5,0.4-3,1.4-4.1c1-1.1,2.5-1.7,4-1.7h78.6C104.8,26.8,106.2,27.4,107.3,28.5z M45.7,118.5l-5.8-78c-0.1-1.5-1.4-2.6-2.9-2.5c-1.5,0.1-2.6,1.4-2.5,2.9l5.8,78c0.1,1.4,1.3,2.5,2.7,2.5c0.1,0,0.1,0,0.2,0C44.7,121.2,45.8,120,45.7,118.5z M66.8,40.7c0-1.5-1.2-2.7-2.7-2.7s-2.7,1.2-2.7,2.7v78c0,1.5,1.2,2.7,2.7,2.7s2.7-1.2,2.7-2.7V40.7z M93.6,40.9c0.1-1.5-1-2.8-2.5-2.9c-1.5-0.1-2.8,1-2.9,2.5l-5.8,78c-0.1,1.5,1,2.8,2.5,2.9c0.1,0,0.1,0,0.2,0c1.4,0,2.6-1.1,2.7-2.5L93.6,40.9z"/>
                                </svg>
                                <span className="text">Delete</span>
                            </button>
                            : ''
                    }
                </div>;
        }
        
        
		return (
			<div id="app-dashboard">
                
                <div className="app-dashboard-header">
                    <span className="app-dashboard-title" onClick={() => { const win = window.open(this.state.url, '_blank'); win.focus(); }}>
                        <img src={datastore + '/bibbox/' + this.state.applicationname + '/blob/' + this.state.version + '/icon.png'} />
                        <h1>{this.state.shortname}</h1>
                        <h3>{this.state.name}</h3>
                    </span>
                    {controls}
                </div>
                <div id="tab-nav">
                    <span className="tab-nav-item active">
                        <a href={'/instance/id/' + params.param2 + '/dashboard'}>
                            Dashboard
                        </a>
                    </span>
                    <span className="tab-nav-item">
                        <a href={'/instance/id/' + params.param2 + '/log'}>
                            Logs
                        </a>
                    </span>
                </div>
                <ul>
                    <li>
                        <a href={'https://github.com/bibbox/' + this.state.applicationname + '/blob/' + version + '/INSTALL-APP.md'} target='_blank'>
                            Install instructions
                        </a>
                    </li>
                </ul>
				<br />
				<br />
                <label>Short name</label>
                <br />
                <input type="text" className="right" value={this.state.shortname} onChange={this.fieldChange.bind(this, 'shortname', '^.{0,80}$')} />
                <br />
                <br />
                <label>Long name</label>
                <br />
                <input type="text" className="right" value={this.state.name} onChange={this.fieldChange.bind(this, 'name', '^.{0,80}$')} />
                <br />
                <br />
                <label>Maintenance description</label><br />
                {
                    (this.state.maintenance_description != null)
                    ?   <TinyMCE
                            content={this.state.maintenance_description}
                            config={{
                                plugins: 'link image code',
                                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
                            }}
                            onChange={this.maintenanceDescChange}
                        />
                    :   ''
                }
                <br />
                <label>Short description</label><br />
                {
                    (this.state.short_description != null)
                    ?   <TinyMCE
                            content={this.state.short_description}
                            config={{
                              plugins: 'link image code',
                              toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
                            }}
                            onChange={this.shortDescChange}
                        />
                    :   ''
                }
                <br />
                <label>Long description</label><br />
                {
                    (this.state.long_description != null)
                    ?   <TinyMCE
                            content={this.state.long_description}
                            config={{
                              plugins: 'link image code',
                              toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
                            }}
                            onChange={this.longDescChange}
                        />
                    :   ''
                }
                <br />
                <label>Admin notes</label><br />
                {
                    (this.state.notes != null)
                    ?   <TinyMCE
                            content={this.state.notes}
                            config={{
                              plugins: 'link image code',
                              toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
                            }}
                            onChange={this.notesChange}
                        />
                    :   ''
                }
                <span className="full-width">
                    <button className="app-dashboard-submit" onClick={this.save}>Save</button>
                </span>
                <Confirm text={this.state.confirm_text} action={this.state.confirm_action} reset={this.confirmReset} />
			</div>
		);
	}
});


module.exports = Dashboard;