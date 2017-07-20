import React        from 'react';
import Info        	from './info.react';
import Metadata     from './metadata.react';
import Dashboard    from './dashboard.react';
import Log    		from './log.react';
import Maintenance  from './maintenance.react';


/**
 * Wrapping component for calling the different page components depending on url params
 */
const Instance = React.createClass({
	getComponent(param) {
		switch(param) {
			case 'info':
				return Metadata;
			case 'dashboard':
				return Dashboard;
			case 'log':
				return Log;
			case 'maintenance':
				return Maintenance;
			default:
				return Info;
		}
	},
	
	render: function() {
		let Component = this.getComponent(this.props.params.param3);
		
		return ( <Component params={this.props.params} /> );
	}
});


module.exports = Instance;