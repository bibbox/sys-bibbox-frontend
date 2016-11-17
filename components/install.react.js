import React    from 'react';
import ReactDOM from 'react-dom';
import jQuery   from 'jquery';


/* Renders the installation form for an app */

const Install = React.createClass({
	getInitialState() {
		return {
			status: '',
		  	install: [],
			form: {
				applicationname: '',
				version: '',
				instancename: '',
				instanceid: '',
				data: {}
			}
		}
	},
	
	componentDidMount() {
		get(jQuery, '/api/jsonws/BIBBOXDocker-portlet.get-application-store-item', {
			applicationname: this.props.params.param2,
			version: this.props.params.param3
		},
		function(result) {
			let form = this.state.form;
		  
		  	form.applicationname = this.props.params.param2;
		  	form.version = this.props.params.param3;
		  
		  	result.install.forEach((item) => {
			  	form.data[item.id] = item.default_value;
			});
			
			this.setState({
			  	install: result.install,
			  	form: form
			});
		  
			jQuery('#loader').stop().fadeOut(300);
			jQuery(ReactDOM.findDOMNode(this)).fadeIn(500);
		}.bind(this));
	},
	
	fieldChange(id, regex = null, event) {
		let form = this.state.form;
        
        form[id] = event.target.value;
        
        if(regex == null || event.target.value == '') {
            jQuery(event.target).removeClass('right wrong');
        }
        else if(regex != null && event.target.value.match(new RegExp(regex, 'g')) != null) {
            jQuery(event.target).addClass('right').removeClass('wrong');
        }
        else {
            jQuery(event.target).addClass('wrong').removeClass('right');
        }
		
		this.setState({ form: form });
	},
	
	dataFieldChange(id, event) {
		let form = this.state.form;
		form.data[id] = event.target.value;
		
		this.setState({ form: form });
	},
	
    cancel(e) {
        e.preventDefault();
        window.close();
    },
    
	submit(e) {
		e.preventDefault();
		
		this.setState({ status: 'loading' });
		
		let data = [{ "/BIBBOXDocker-portlet.install-application": this.state.form }];
        
		post(jQuery, '/api/jsonws/invoke', data, function(result) {
			window.location = '/instance/id/' + this.state.form.instanceid + '/log/install';
		}.bind(this));
	},
	
	render: function() {
		if (this.state.status == 'loading') {
            return (
                <div id="app-install">
                    <div id="loading">
                        <img src="/o/BIBBOXDocker-portlet/images/loading_dark.gif" />
                        <span>Please wait while your application is being set up.<br />You will be redirected shortly...</span>
                    </div>
                </div>
            );
		}
		else {
			return (
			  	<div id="app-install">
					<form action="" onSubmit={this.submit}>
						<div className="app-install-text">
							<h2>{ this.state.form.applicationname + ' ' + this.state.form.version }</h2>
                            <span>Please fill out the form to install the aplication</span>
						</div>
						<input
							onChange={this.fieldChange.bind(this, 'applicationname')}
							type="hidden"
							name="applicationname"
							value={this.state.form.applicationname}
							readOnly
						/>
						<input
							onChange={this.fieldChange.bind(this, 'version')}
							type="hidden"
							name="version"
							value={this.state.form.version}
							readOnly
						/>
						<br />
						<label htmlFor="instanceid">Application ID</label>
						<input
                            onChange={this.fieldChange.bind(this, 'instanceid', '^[a-z0-9]{1}.[a-z0-9-]{0,62}.[a-z0-9]{1}$')}
                            value={this.state.form.instanceid}
                            type="text"
                            name="instanceid"
                            required
                        />
                        <span className="field-description">Subdomain of your application URL. <b>The application ID can not be changed after the installation.</b></span>
						<br />
						<label htmlFor="instancename">Application Name</label>
						<input
                            onChange={this.fieldChange.bind(this, 'instancename', '^[a-zA-Z0-9]{1}.[a-zA-Z0-9- ]{0,253}.[a-zA-Z0-9]{1}$')}
                            value={this.state.form.instancename}
                            type="text"
                            name="instancename"
                            required
                        />
                        <span className="field-description">Full name of your application, can be changed later on.</span>
						<br />
						{
							this.state.install.map((item) => {
								return (
									<div key={item.id} className="field-group">
										<label htmlFor={item.id}>{item.display_name}</label>
										<input
											type={item.type}
											pattern={".{" + item.min_length + "," + item.max_length + "}"}
											name={this.state.form.data[item.id]}
											value={this.state.form.data[item.id]}
											placeholder={item.default_value}
											title={item.tooltip}
											required={item.description}
											onChange={this.dataFieldChange.bind(this, item.id)}
										/>
										<span className="field-description" dangerouslySetInnerHTML={{__html: item.description}}></span>
									</div>
								);
							})
						}
						<br />
						<span className="install-submit">
							<button className="app-install-cancel" type="button" onClick={this.cancel}>Cancel</button>
							<button className="app-install-submit" type="submit">Install</button>
						</span>
					</form>
				</div>
			);
		}
	}
});


module.exports = Install;