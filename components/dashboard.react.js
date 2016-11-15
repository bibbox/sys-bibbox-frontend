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
			cpu: [],
			ram: [],
			cpu_current: 0,
			ram_current: 0,
			cpu_max: 0,
			ram_max: 0,
			interval: {},
			options: {
				maintainAspectRatio: false,
				responsive: true,
				scales: {
					xAxes: [{
						display: false
					}],
					yAxes: [{
					  	ticks: {
							max: 100,
							min: 0,
							stepSize: 25
					  	}
				  	}]
			  	}
		  	}
		}
	},
  
	componentDidMount() {
        get(jQuery, '/api/jsonws/BIBBOXDocker-portlet.get-instance-dashboard', {
			instanceId : this.props.params.param2
		},
		function(result) {
            /*
                const interval = setInterval(function() {
                    let cpu = this.state.cpu;
                    let ram = this.state.ram;

                    let cpu_new = this.random(0, 100, 1)[0];
                    let ram_new = this.random(0, 100, 1)[0];

                    cpu.push(cpu_new);
                    ram.push(ram_new);

                    if(cpu.length > 20) cpu.splice(0, 1);
                    if(ram.length > 20) ram.splice(0, 1);

                    this.setState({
                        cpu: cpu,
                        ram: ram,
                        cpu_current: cpu_new,
                        ram_current: ram_new
                    });
                }.bind(this), 3000);
            */
            
            // ToDo: get admin notes from api
            
			this.setState({
                name: result.instancename,
                shortname: result.instanceshortname,
                status: result.status,
                maintenance: result.ismaintenance,
                maintenance_description: result.maintenance,
                short_description: result.shortdescription,
                notes: '',
                long_description: result.longdescription,
                applicationname: result.applicationname,
                version: result.version,
                // interval: interval
			});
		  
			jQuery('#loader').stop().fadeOut(300);
			jQuery(ReactDOM.findDOMNode(this)).fadeIn(500);
		}.bind(this));
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
            case false:
                this.setState({
                    confirm_text: 'Are you sure, you want to start this application?',
                    confirm_action: () => {alert('Starting application');}
                });
                break;
            default:
                this.setState({
                    confirm_text: 'Are you sure, you want to stop this application?',
                    confirm_action: () => {alert('Stopping application');}
                });
        }
    },
    
    confirmReset() {
        this.setState({
            confirm_text: null,
            confirm_action: null
        });
    },
    
    delete() {
        this.setState({
            confirm_text: 'Are you sure, you want to delete this application?',
            confirm_action: () => {
                    get(jQuery, '/api/jsonws/BIBBOXDocker-portlet.delete-instance-status', {
                    instanceId: this.props.params.param2
                },
                function() {
                    alert('The app has successfully been deleted!');
                    window.location = '/instances';
                }.bind(this))
            }
        });
    },
    
    maintenanceChange() {
        this.setState({ maintenance: !this.state.maintenance });
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
        this.setState({ long_description: e.target.getContent() });
    },
    
    nameChange(e) {
        this.setState({ name: e.target.value });
    },
    
    shortnameChange(e) {
        this.setState({ shortname: e.target.value });
    },
    
    save() {
		let data = [{ "/BIBBOXDocker-portlet.update-instance-info": {
            instanceId: this.props.params.param2,
            instancename: this.state.name,
            instanceshortname: this.state.shortname,
            description: this.state.long_description,
            shortdescription: this.state.short_description,
            ismaintenance: this.state.maintenance,
            maintenance: this.state.maintenance_description
        }}];
		
		post(jQuery, '/api/jsonws/invoke', data, function() {
			window.location = '/instance/id/' + this.props.params.param2 + '/dashboard';
		}.bind(this));
    },
	
	render() {
        /*
            var data = {
                labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
                datasets: [
                    {
                        label: 'My First dataset',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: '#6496b4',
                        borderColor: '#6496b4',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'transparent',
                        pointBackgroundColor: 'transparent',
                        pointBorderWidth: 0,
                        pointHoverRadius: 0,
                        pointHoverBackgroundColor: 'transparent',
                        pointHoverBorderColor: 'transparent',
                        pointHoverBorderWidth: 0,
                        pointRadius: 0,
                        pointHitRadius: 0,
                        data: this.state.cpu
                    },
                    {
                        label: 'My First dataset',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        borderColor: 'rgba(0, 0, 0, 0.4)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'transparent',
                        pointBackgroundColor: 'transparent',
                        pointBorderWidth: 0,
                        pointHoverRadius: 0,
                        pointHoverBackgroundColor: 'transparent',
                        pointHoverBorderColor: 'transparent',
                        pointHoverBorderWidth: 0,
                        pointRadius: 0,
                        pointHitRadius: 0,
                        data: this.state.ram
                    }
                ]
            };
        */
        
        const startstop = (this.state.status == 'running') ? 'Stop' : 'Start';
        const version = (this.state.version == 'development') ? 'master' : this.state.version;
        const status = (this.state.status) ? 'running' : 'stopped';
		
		return (
			<div id="app-dashboard">
                <div className="app-dashboard-header">
                    <span className="app-dashboard-title">
                        <img src={'http://datastore.development.bibbox.org/bibbox/' + this.state.applicationname + '/blob/' + this.state.version + '/icon.png'} />
                        <h1>{this.state.name}</h1>
                    </span>
                    <div className="app-dashboard-controls">
                        <button onClick={() => { window.location = '/instance/id/' + this.props.params.param2 + '/info'; }}>
                            <svg viewBox="0 0 1000 1000">
                                <path d="M500,0C223.857,0,0,223.857,0,500s223.857,500,500,500s500-223.857,500-500S776.143,0,500,0z M501,925.787C266.396,925.787,76.213,735.604,76.213,501C76.213,266.397,266.396,76.213,501,76.213S925.786,266.397,925.786,501C925.786,735.604,735.603,925.787,501,925.787z M591.202,690.972c1.115-1.341,2.378-2.558,5.256-5.632c-1.465,20.368,2.695,38.779-9.946,55.72c-20.156,27.01-39.918,54.186-66.5,75.436c-26.183,20.931-55.698,33.339-89.502,34.665c-1.192,0.046-2.358,0.71-3.537,1.086c-2.072,0-4.144,0-6.217,0c-5.363-1.603-10.761-3.099-16.086-4.822c-38.852-12.573-59.25-46.334-46.39-87.492c27.169-86.944,52.955-174.32,79.274-261.529c7.083-23.469,13.976-46.995,21.109-70.449c2.26-7.433,1.231-13.887-4.801-18.96c-6.23-5.241-12.695-2.41-17.756,1.462c-8.563,6.555-17.144,13.46-24.197,21.543c-18.368,21.049-35.885,42.84-53.832,64.26c-1.562,1.865-3.788,3.174-5.706,4.742c0-13.47,0-26.939,0-40.409c16.4-19.236,31.652-39.62,49.462-57.447c28.93-28.959,61.847-52.498,102.126-63.78c26.147-7.324,49.653-1.834,68.799,16.891c20.32,19.875,24.846,45.169,16.944,71.731c-28.114,94.496-56.952,188.778-85.529,283.136c-4.785,15.805-9.56,31.614-14.482,47.377c-2.338,7.481-2.25,14.435,4.179,19.816c6.39,5.348,13.467,2.967,18.583-1.25c10.885-8.977,21.621-18.388,30.972-28.908C559.919,729.602,575.322,710.078,591.202,690.972z M647.629,220.503c0,39.072-31.674,70.747-70.746,70.747c-39.074,0-70.748-31.675-70.748-70.747c0-39.073,31.674-70.748,70.748-70.748C615.955,149.755,647.629,181.43,647.629,220.503z" />
                            </svg>
                            <span className="text">App info</span>
                        </button>
                        <button onClick={this.delete}>
                            <svg viewBox="0 0 128 128">
                                <path d="M110.3,15.4c0,3-2.4,5.4-5.4,5.4H23.1c-3,0-5.4-2.4-5.4-5.4s2.4-5.4,5.4-5.4h30.5C53.8,4.5,58.4,0,64,0s10.2,4.5,10.4,10.1h30.5C107.9,10.1,110.3,12.5,110.3,15.4z M107.3,28.5c1,1.1,1.5,2.6,1.4,4.1l-7.1,90.5c-0.2,2.8-2.6,5-5.4,5H31.8c-2.8,0-5.1-2.2-5.4-5l-7.1-90.5c-0.1-1.5,0.4-3,1.4-4.1c1-1.1,2.5-1.7,4-1.7h78.6C104.8,26.8,106.2,27.4,107.3,28.5z M45.7,118.5l-5.8-78c-0.1-1.5-1.4-2.6-2.9-2.5c-1.5,0.1-2.6,1.4-2.5,2.9l5.8,78c0.1,1.4,1.3,2.5,2.7,2.5c0.1,0,0.1,0,0.2,0C44.7,121.2,45.8,120,45.7,118.5z M66.8,40.7c0-1.5-1.2-2.7-2.7-2.7s-2.7,1.2-2.7,2.7v78c0,1.5,1.2,2.7,2.7,2.7s2.7-1.2,2.7-2.7V40.7z M93.6,40.9c0.1-1.5-1-2.8-2.5-2.9c-1.5-0.1-2.8,1-2.9,2.5l-5.8,78c-0.1,1.5,1,2.8,2.5,2.9c0.1,0,0.1,0,0.2,0c1.4,0,2.6-1.1,2.7-2.5L93.6,40.9z"/>
                            </svg>
                            <span className="text">Delete</span>
                        </button>
                        <button onClick={this.startStop}>
                            <svg viewBox="0 0 1000 1000">
                              <path d="M451.523,528.59V47.615c0-26.233,21.267-47.5,47.5-47.5s47.5,21.267,47.5,47.5V528.59c0,26.233-21.267,47.5-47.5,47.5S451.523,554.823,451.523,528.59z M711.563,158.396c-23.034-12.554-51.885-4.056-64.438,18.98s-4.055,51.885,18.98,64.438c113.472,61.835,183.962,180.438,183.962,309.526c0,94.084-36.639,182.536-103.165,249.063c-66.527,66.527-154.979,103.166-249.063,103.166s-182.537-36.639-249.064-103.166S145.609,645.424,145.609,551.34c0-129.281,70.646-247.969,184.369-309.747c23.052-12.522,31.587-41.361,19.065-64.413c-12.522-23.052-41.362-31.586-64.413-19.065C140.281,236.53,50.609,387.206,50.609,551.34c0,60.354,11.831,118.929,35.165,174.097c22.528,53.261,54.769,101.085,95.826,142.143c41.057,41.057,88.881,73.298,142.143,95.825c55.167,23.334,113.742,35.165,174.097,35.165s118.93-11.831,174.097-35.165c53.261-22.527,101.085-54.769,142.142-95.826c41.058-41.057,73.298-88.881,95.825-142.143c23.334-55.167,35.165-113.741,35.165-174.096C945.068,387.45,855.595,236.883,711.563,158.396z" />
                            </svg>
                            <span className="text">{startstop}</span>
                        </button>
                        <span className={'status ' + status}></span>
                    </div>
                </div>
                {/*
                    <div className="app-dashboard-chart">
                        <Line
                            data={data}
                            options={this.state.options}
                            redraw={true}
                            width={600}
                            height={150}
                        />
                    </div>
                    <div className="app-performance">
                        <span className="two"> </span>
                        <span className="one">Current</span>
                        <span className="right">Max</span>
                        <br />
                        <span className="light two">CPU</span>
                        <span className="light one">{Math.round(this.state.cpu_current)}%</span>
                        <span className="light right">90%</span>
                        <br />
                        <span className="dark two">RAM</span>
                        <span className="dark one">{Math.round(this.state.ram_current)}%</span>
                        <span className="dark right">82%</span>
                    </div>
                    <br />
                */}
                <ul>
                    <li>
                        <a href={'https://github.com/bibbox/' + this.state.applicationname + '/blob/' + version + '/INSTALL-APP.md'} target='_blank'>
                            Install instructions
                        </a>
                    </li>
                    <li><a href={'/instance/id/' + this.props.params.param2 + '/log/install'} target='_blank'>Install log</a></li>
                    <li><a href={'/instance/id/' + this.props.params.param2 + '/log/general'} target='_blank'>General log</a></li>
                </ul>
                <br />
                <br />
                <label>Long name</label>
                <br />
                <input type="text" value={this.state.name} onChange={this.nameChange} />
                <br />
                <br />
                <label>Short name</label>
                <br />
                <input type="text" value={this.state.shortname} onChange={this.shortnameChange} />
                <br />
                <br />
                <label><input type="checkbox" onClick={this.maintenanceChange} checked={this.state.maintenance} /> Enable maintenance mode</label>
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