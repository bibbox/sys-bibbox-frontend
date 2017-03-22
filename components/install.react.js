import React    from 'react';
import ReactDOM from 'react-dom';
import jQuery   from 'jquery';


/* Renders the installation form for an app */

const Install = React.createClass({
	getInitialState() {
		return {
            name: '',
			status: '',
		  	install: [],
            usedinstanceids: [],
            idError: true,
            nameError: true,
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
                name: result.name,
			  	install: result.install,
                usedinstanceids: result.usedinstanceids,
			  	form: form
			});
		  
			jQuery('#loader').stop().fadeOut(300);
			jQuery(ReactDOM.findDOMNode(this)).fadeIn(500);
		}.bind(this));
	},
	
	fieldChange(id, regex = null, forbidden, event) {
		let form = this.state.form;
        let idError = this.state.idError;
        let nameError = this.state.nameError;
        
        form[id] = event.target.value;
        
        if(regex == null || event.target.value == '') {
            jQuery(event.target).removeClass('right wrong');
            
            if(id == 'instanceid') { idError = true; }
            else if(id == 'instancename') { nameError = true; }
        }
        else if(regex != null && event.target.value.match(new RegExp(regex, 'g')) != null && event.target.value != 'datastore' && (forbidden == null || !forbidden.includes(event.target.value))) {
            jQuery(event.target).addClass('right').removeClass('wrong');
            
            if(id == 'instanceid') { idError = false; }
            else if(id == 'instancename') { nameError = false; }
        }
        else {
            jQuery(event.target).addClass('wrong').removeClass('right');
            
            if(id == 'instanceid') { idError = true; }
            else if(id == 'instancename') { nameError = true; }
        }
		
		this.setState({
            form: form,
            idError: idError,
            nameError: nameError
        });
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
        
        let error = false;
        
        this.state.install.forEach((field) => {
            if(field.min_length > 0 && jQuery('.data-field-' + field.id).val() == '') {
                error = true;
            }
        });
        
        if(this.state.idError || this.state.nameError || error) {
            alert('One or more fields are empty or not not filled out correctly. Please correct the fields and try again.');
            return;
        }
		
		this.setState({ status: 'loading' });
		
		let data = [{ "/BIBBOXDocker-portlet.install-application": this.state.form }];
        
		post(jQuery, '/api/jsonws/invoke', data, function(result) {
            window.close();
		}.bind(this));
	},
	
	render: function() {
		if (this.state.status == 'loading') {
            return (
                <div id="app-install">
                    <div id="loading">
                        <img src={datastore + '/js/images/loading_dark.gif'} />
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
							<h2>{ this.state.name }</h2>
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
                            onChange={this.fieldChange.bind(this, 'instanceid', '^[a-z0-9]{1}[a-z0-9-]{0,62}[a-z0-9]{1}$', this.state.usedinstanceids)}
                            value={this.state.form.instanceid}
                            type="text"
                            name="instanceid"
                            required
                        />
                        <span className="field-description">Subdomain of your application URL. <b>The application ID can not be changed after the installation.</b></span>
						<br />
						<label htmlFor="instancename">Application Name</label>
						<input
                            onChange={this.fieldChange.bind(this, 'instancename', '^.{0,80}$', null)}
                            value={this.state.form.instancename}
                            type="text"
                            name="instancename"
                            required
                        />
                        <span className="field-description">Full name of your application, can be changed later on.</span>
						<br />
						{
							this.state.install.map((item) => {
                                const required = (item.min_length > 0) ? true : false;
                            
								return (
									<div key={item.id} className="field-group">
										<label htmlFor={item.id}>{item.display_name}</label>
										<input
                                            className={"data-field-" + item.id}
											type={item.type}
											pattern={".{" + item.min_length + "," + item.max_length + "}"}
											name={this.state.form.data[item.id]}
											value={this.state.form.data[item.id]}
											placeholder={item.default_value}
											title={item.tooltip}
											required={required}
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