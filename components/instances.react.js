import React                from 'react';
import ReactDOM             from 'react-dom';
import jQuery               from 'jquery';
import {defaults, Line}   	from 'react-chartjs-2';
import TagSearch            from './tag-search.react';


const Instances = React.createClass({
	getInitialState() {
		return {
			all: [],
			current: [],
            user: {},
            tags: []
		}
	},
    
	componentDidMount() {
        get(jQuery, '/api/jsonws/BIBBOXDocker-portlet.get-instance-list', {}, function (result) {
			this.setState({
				all: result.instances,
				current: result.instances,
				user: result.user
			});
	  
            jQuery('#loader').stop().fadeOut(300);
            jQuery(ReactDOM.findDOMNode(this)).fadeIn(500);
            
            setInterval(() => {
                get(jQuery, '/api/jsonws/BIBBOXDocker-portlet.get-instance-list', {}, function (result) {
                    const current = filterAppInstances(result.instances, this.state.tags);
                    
                    this.setState({
                        all: result.instances,
                        current: current
                    });
                }.bind(this));
            }, 3000);
		}.bind(this));
    },
  
	setTags(tags) {
		// Get the filtered list of app instances
		const current = filterAppInstances(this.state.all, tags);
		
		this.setState({
		  	current: current,
            tags: tags
		});
	},
  
	render() {
		let suggestions = Object.keys(getInstanceTags(this.state.all)).sort();
		
		return (
			<div id="app-instances">
				<AppFilter
					setTags={this.setTags}
					all={this.state.all}
					suggestions={suggestions}
				/>
				<div id="instances">
					{
                        (this.state.current.length > 0) ?
                            this.state.current.map(app => {
                                return (
                                    <App key={app.instanceid} data={app} user={this.state.user} />
                                );
                            })
                            : <span id="no-items">No applications have been found.</span>
					}
				</div>
			</div>
		);
	}
});


/**
 * Renders the filter options for the app instance list
 */
const AppFilter = React.createClass({
	render() {
		return (
			<div id="app-filter">
				<TagSearch all={this.props.all} setTags={this.props.setTags} suggestions={this.props.suggestions} />
		  	</div>
		);
	}
});


defaults.global.animation = false;
defaults.global.legend.display = false;
defaults.global.tooltips.enabled = false;
/**
 * Renders an individual app instance block
 */
const App = React.createClass({
	getInitialState() {
		return {
			cpu: [],
			ram: [],
			cpu_current: 0,
			ram_current: 0,
			cpu_max: 0,
			ram_max: 0,
			interval: {},
			options: {
				maintainAspectRatio: true,
				responsive: true,
				scales: {
					xAxes: [{
					  	display: false
					}],
					yAxes: [{
						ticks: {
							max: 100,
							min: 0
						}
					}]
				}
			}
		}
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
	
	select(app) {
	  	this.props.select(app);
	},
  
	render() {
        const dashboard = (this.props.user.role == 'admin')
            ?   <span className="app-footer-button dashboard" title="Dashboard" onClick={() => { window.location = '/instance/id/' + this.props.data.instanceid + '/dashboard'; }}>
                    <span>
                        <span className="icon">
                            <svg viewBox="0 0 128 128">
                                <path d="M63.977,93.967c-16.489-0.009-29.96-13.498-29.951-29.987c0.009-16.498,13.498-29.969,29.987-29.96c16.489,0.018,29.969,13.507,29.96,29.996C93.964,80.495,80.466,93.976,63.977,93.967 M127.547,58.558c-0.136-0.813-0.479-1.102-1.12-1.292c-1.482-0.452-3.009-0.669-4.536-0.904c-2.873-0.443-5.801-0.497-8.629-1.301c-6.541-1.843-10.734-8.412-9.659-15.107c0.497-3.072,2.051-5.593,3.939-7.969c1.861-2.34,3.813-4.626,5.304-7.246c0.434-0.75,0.452-1.419,0.018-2.186c-1.726-3.045-4.093-5.439-7.093-7.228c-0.904-0.533-1.798-0.551-2.72-0.054c-1.22,0.651-2.313,1.491-3.415,2.304c-2.232,1.671-4.274,3.596-6.695,5.014c-7.978,4.698-17.79,0.551-20.103-8.222c-0.542-2.06-0.714-4.174-0.958-6.288c-0.244-2.105-0.56-4.201-1.057-6.27c-0.208-0.876-0.669-1.328-1.563-1.428c-1.003-0.117-2.015-0.172-3.009-0.389h-4.752c-0.858,0.307-1.78,0.352-2.647,0.407c-1.093,0.072-1.473,0.596-1.69,1.491c-0.515,2.069-0.822,4.165-1.048,6.279c-0.352,3.271-0.614,6.559-2.304,9.514c-2.692,4.68-7.725,7.454-13.444,6.74c-3.235-0.407-5.882-1.97-8.357-3.948c-2.34-1.861-4.626-3.813-7.237-5.313c-0.777-0.443-1.455-0.479-2.25-0.018c-3,1.726-5.367,4.057-7.147,7.002c-0.605,0.994-0.596,1.952-0.036,2.945c0.66,1.166,1.464,2.232,2.259,3.298c1.69,2.268,3.659,4.328,5.078,6.803c3.912,6.794,1.545,15.459-5.764,19.019c-2.765,1.346-5.764,1.563-8.737,1.897c-2.15,0.244-4.292,0.551-6.397,1.075c-0.84,0.217-1.283,0.614-1.373,1.563c-0.09,0.913-0.117,1.861-0.407,2.747V66.5c0.226,0.931,0.28,1.888,0.379,2.846c0.081,0.759,0.479,1.229,1.274,1.428c1.5,0.379,3.018,0.641,4.536,0.867c2.837,0.434,5.728,0.497,8.511,1.283c6.514,1.816,10.688,8.294,9.695,14.953c-0.47,3.135-2.006,5.701-3.912,8.114c-1.852,2.349-3.858,4.599-5.322,7.237c-0.434,0.786-0.461,1.455-0.009,2.259c1.491,2.674,3.56,4.825,6.053,6.541c2.168,1.5,2.9,1.419,5.069-0.099c2.015-1.409,3.921-2.964,5.846-4.49c3.352-2.656,6.948-4.292,11.484-3.912c5.132,0.434,10.399,4.996,11.583,10.128c0.47,2.087,0.687,4.192,0.94,6.297c0.253,2.15,0.56,4.292,1.102,6.397c0.199,0.795,0.66,1.202,1.428,1.274c0.958,0.09,1.906,0.154,2.846,0.379h4.752c0.994-0.217,2.006-0.271,3.009-0.389c0.885-0.099,1.355-0.533,1.563-1.409c0.334-1.419,0.587-2.855,0.804-4.292c0.443-2.882,0.506-5.81,1.301-8.638c2.385-8.457,12.215-12.441,19.778-8.014c1.662,0.967,3.153,2.168,4.662,3.361c1.952,1.545,3.876,3.144,6.099,4.328c0.632,0.334,1.193,0.343,1.825-0.009c3.162-1.771,5.665-4.21,7.472-7.355c0.425-0.741,0.434-1.5,0.081-2.277c-0.325-0.732-0.768-1.382-1.22-2.033c-1.545-2.232-3.361-4.246-4.969-6.424c-2.476-3.352-3.759-6.993-3.009-11.24c0.84-4.689,3.515-7.924,7.698-9.966c2.665-1.301,5.62-1.446,8.52-1.762c2.15-0.235,4.292-0.551,6.397-1.093c0.822-0.208,1.229-0.632,1.328-1.545c0.108-0.913,0.126-1.852,0.416-2.747v-4.499C127.719,60.871,127.737,59.706,127.547,58.558" />
                            </svg>
                        </span>
                    </span>
                </span>
            :   '';
        
        const logs = (this.props.user.role == 'admin')
            ?   <span className="app-footer-button logs" title="Logs" onClick={() => { window.location = '/instance/id/' + this.props.data.instanceid + '/log'; }}>
                    <span>
                        <span className="icon">
                            <svg viewBox="0 0 1000 1000">
                                <path d="M169.009,239.44c0-19.715,15.983-35.698,35.699-35.698h583.136c19.716,0,35.698,15.983,35.698,35.698c0,19.716-15.982,35.699-35.698,35.699H204.708C184.992,275.14,169.009,259.156,169.009,239.44z M202.328,625.498h583.136c19.716,0,35.7-15.981,35.7-35.697c0-19.717-15.984-35.7-35.7-35.7H202.328c-19.716,0-35.699,15.983-35.699,35.7C166.629,609.517,182.612,625.498,202.328,625.498z M202.328,450.319h583.136c19.716,0,35.7-15.983,35.7-35.699s-15.984-35.699-35.7-35.699H202.328c-19.716,0-35.699,15.983-35.699,35.699S182.612,450.319,202.328,450.319z M202.328,800.678h481.441c19.717,0,35.698-15.984,35.698-35.699c0-19.716-15.981-35.699-35.698-35.699H202.328c-19.716,0-35.699,15.983-35.699,35.699C166.629,784.693,182.612,800.678,202.328,800.678z M956.907,82.282V917.72c0,25.328-20.291,45.932-45.23,45.932H84.001c-24.94,0-45.23-20.604-45.23-45.932V82.282c0-25.328,20.29-45.933,45.23-45.933h827.675C936.616,36.35,956.907,56.955,956.907,82.282z M895.028,98.228H100.649v803.547h794.379V98.228z" />
                            </svg>
                        </span>
                    </span>
                </span>
            :   '';
	
        const open = (this.props.user.role == 'admin' || (this.props.data.status != 'maintenance' && this.props.data.status != 'installing'))
            ? this.props.data.url
            : '/instance/id/' + this.props.data.instanceid + '/maintenance';
        
		return (
			<div className={"app " + this.props.data.status}>
				<div className="app-header" onClick={() => { const win = window.open(open, '_blank'); win.focus(); }}>
					<img src={datastore + '/bibbox/' + this.props.data.application + '/blob/' + this.props.data.version + '/icon.png'} />
					<h1>{this.props.data.instanceshortname}</h1>
					<h2>{this.props.data.instancename}</h2>
				</div>
			     
				<div className="app-body">
					<div className="app-quickinfo" dangerouslySetInnerHTML={{__html: this.props.data.description}}></div>
				</div>
			  
                <div className="app-footer">
                    {dashboard}
                    {logs}
				    <span className="app-footer-button info" title="Info" onClick={() => { window.location = '/instance/id/' + this.props.data.instanceid + '/info'; }}>
					   <span>
						  <span className="icon">
							  <svg viewBox="0 0 1000 1000">
								  <path d="M500,0C223.857,0,0,223.857,0,500s223.857,500,500,500s500-223.857,500-500S776.143,0,500,0z M501,925.787C266.396,925.787,76.213,735.604,76.213,501C76.213,266.397,266.396,76.213,501,76.213S925.786,266.397,925.786,501C925.786,735.604,735.603,925.787,501,925.787z M591.202,690.972c1.115-1.341,2.378-2.558,5.256-5.632c-1.465,20.368,2.695,38.779-9.946,55.72c-20.156,27.01-39.918,54.186-66.5,75.436c-26.183,20.931-55.698,33.339-89.502,34.665c-1.192,0.046-2.358,0.71-3.537,1.086c-2.072,0-4.144,0-6.217,0c-5.363-1.603-10.761-3.099-16.086-4.822c-38.852-12.573-59.25-46.334-46.39-87.492c27.169-86.944,52.955-174.32,79.274-261.529c7.083-23.469,13.976-46.995,21.109-70.449c2.26-7.433,1.231-13.887-4.801-18.96c-6.23-5.241-12.695-2.41-17.756,1.462c-8.563,6.555-17.144,13.46-24.197,21.543c-18.368,21.049-35.885,42.84-53.832,64.26c-1.562,1.865-3.788,3.174-5.706,4.742c0-13.47,0-26.939,0-40.409c16.4-19.236,31.652-39.62,49.462-57.447c28.93-28.959,61.847-52.498,102.126-63.78c26.147-7.324,49.653-1.834,68.799,16.891c20.32,19.875,24.846,45.169,16.944,71.731c-28.114,94.496-56.952,188.778-85.529,283.136c-4.785,15.805-9.56,31.614-14.482,47.377c-2.338,7.481-2.25,14.435,4.179,19.816c6.39,5.348,13.467,2.967,18.583-1.25c10.885-8.977,21.621-18.388,30.972-28.908C559.919,729.602,575.322,710.078,591.202,690.972z M647.629,220.503c0,39.072-31.674,70.747-70.746,70.747c-39.074,0-70.748-31.675-70.748-70.747c0-39.073,31.674-70.748,70.748-70.748C615.955,149.755,647.629,181.43,647.629,220.503z" />
							  </svg>
						  </span>
					  </span>
				  </span>
				  <span className="app-footer-button open" title="Open" onClick={() => { const win = window.open(open, '_blank'); win.focus(); }}>
					  <span>
						  <span className="icon">
							  <svg viewBox="0 0 1000 1000">
								  <path d="M451.523,528.59V47.615c0-26.233,21.267-47.5,47.5-47.5s47.5,21.267,47.5,47.5V528.59c0,26.233-21.267,47.5-47.5,47.5S451.523,554.823,451.523,528.59z M711.563,158.396c-23.034-12.554-51.885-4.056-64.438,18.98s-4.055,51.885,18.98,64.438c113.472,61.835,183.962,180.438,183.962,309.526c0,94.084-36.639,182.536-103.165,249.063c-66.527,66.527-154.979,103.166-249.063,103.166s-182.537-36.639-249.064-103.166S145.609,645.424,145.609,551.34c0-129.281,70.646-247.969,184.369-309.747c23.052-12.522,31.587-41.361,19.065-64.413c-12.522-23.052-41.362-31.586-64.413-19.065C140.281,236.53,50.609,387.206,50.609,551.34c0,60.354,11.831,118.929,35.165,174.097c22.528,53.261,54.769,101.085,95.826,142.143c41.057,41.057,88.881,73.298,142.143,95.825c55.167,23.334,113.742,35.165,174.097,35.165s118.93-11.831,174.097-35.165c53.261-22.527,101.085-54.769,142.142-95.826c41.058-41.057,73.298-88.881,95.825-142.143c23.334-55.167,35.165-113.741,35.165-174.096C945.068,387.45,855.595,236.883,711.563,158.396z" />
							  </svg>
						  </span>
					  </span>
				  </span>
			  </div>
			</div>
		);
  	}
});


module.exports = Instances;