import React    from 'react';
import ReactDOM from 'react-dom';
import jQuery   from 'jquery';
import { defaults, Line }   from 'react-chartjs-2';


/* Renders the instance information screen */

defaults.global.animation = false;
defaults.global.legend.display = false;
defaults.global.tooltips.enabled = false;

const Info = React.createClass({
	getInitialState() {
		return {
            longname: '',
            shortname: '',
            url: '',
            description: '',
            applicationname: '',
            version: '',
            maintenance: false,
            user: {
                role: '',
                username: ''
            }
            /* application: {},
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
		  	} */
		}
	},
  
	componentDidMount() {
        get(jQuery, '/api/jsonws/BIBBOXDocker-portlet.get-instance-info', {
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
            
			this.setState({
                longname: result.instancename,
                shortname: result.instanceshortname,
                url: result.url,
                description: result.longdescription,
                applicationname: result.applicationname,
                version: result.version,
                user: result.user,
                maintenance: result.ismaintenance
                // application: result.application,
                // interval: interval
			});
		  
			jQuery('#loader').stop().fadeOut(300);
			jQuery(ReactDOM.findDOMNode(this)).fadeIn(500);
		}.bind(this));
	},
  
	componentWillUnmount() {
	  	clearInterval(this.state.interval);
	},
	
    /*
	random(min, max, num) {
		var rtn = [];
		while (rtn.length < num) {
		  	rtn.push((Math.random() * (max - min)) + min);
		}
		return rtn;
	},
    */
	
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
        
        const version = (this.state.version == 'development') ? 'master' : this.state.version;
        
        const open = (this.state.user.role == 'admin' || !this.state.maintenance)
            ? this.state.url
            : '/instance/id/' + this.props.params.param2 + '/maintenance';
		
		return (
			<div id="app-info">
				<div className="app-info-header">
					<span className="app-info-title" onClick={() => { const win = window.open(open, '_blank'); win.focus(); }}>
						<img src={'http://datastore.development.bibbox.org/bibbox/' + this.state.applicationname + '/blob/' + this.state.version + '/icon.png'} />
						<h1>{this.state.shortname}</h1>
                        <h3>{this.state.longname}</h3>
					</span>
				</div>
				
				<div className="app-info-body">
                    {/*
					<div className="app-info-left">
					  	<h2 className="margin-bottom">General information</h2>
					  
					  	<span>
							<h3>Short name</h3>
							<p>{this.state.shortname}</p>
						</span>
					  
					  	<span>
							<h3>Instance ID</h3>
							<p><a href={this.state.url} target="_blank">{this.state.url}</a></p>
						</span>					  
                        */}
					  	<span className="full-width">
							<div dangerouslySetInnerHTML={{__html: this.state.description}}></div>
						</span>
                        {/*
						<h2 className="margin-bottom">Application</h2>
						<span>
                            <h3>Long name</h3>
							<p>{this.state.application.name}</p>
						</span>
					  
					  	<span>
							<h3>Short name</h3>
							<p>{this.state.application.short_name}</p>
						</span>
					  
					  	<span>
							<h3>App ID</h3>
							<p>{this.state.applicationname}</p>
						</span>
					  
					  	<span>
							<h3>Docker version</h3>
							<p>{this.state.application.version}</p>
						</span>
					  
					  	<span className="full-width">
							<h3>Url</h3>
							<p><a href={this.state.application.application_url} target="_blank">{this.state.application.application_url}</a></p>
						</span>
					  
					  	<span className="full-width">
							<h3>Catalogue</h3>
							<p><a href={this.state.application.catalogue_url} target="_blank">{this.state.application.catalogue_url}</a></p>
						</span>
					  
					  	<span className="full-width">
							<h3>GitHub</h3>
							<p>
                                <a href={'https://github.com/bibbox/' + this.state.applicationname + '/tree/' + version} target="_blank">
                                    {'https://github.com/bibbox/' + this.state.applicationname + '/tree/' + version}
                                </a>
                            </p>
						</span>
						<span className="full-width">
                            <h3>Description</h3>
							<div dangerouslySetInnerHTML={{__html: this.state.application.description}}></div>
						</span>
					</div>
				  	<div className="app-info-right">
					  	<h2 className="margin-bottom">Performance</h2>
					  
						<div className="app-info-chart">
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
					  
						<div className="app-info-chart">
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
						<div className="app-info-chart">
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
					  
						<div className="app-info-chart">
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
					</div>
                    */}
				</div>
			</div>
		);
	}
});


module.exports = Info;