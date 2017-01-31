import React    from 'react';
import jQuery   from 'jquery';
import Message  from './message.react';


/* Renders the base structure of the overlay */

const StoreOverlay = React.createClass({
    render() {
        return (
            <div id="overlay-wrapper">
                <img id="overlay-loader" src={datastore + '/js/images/loading_light.gif'} />
                <div id="overlay-inner">
                    <div id="overlay-close-wrapper">
                        <div id="overlay-close-body" onClick={this.props.reset}>
                            <img src={datastore + '/js/images/close.png'} />
                        </div>
                    </div>
                    <div id="overlay-body">
                        <OverlayWrapper app={this.props.app} />
                    </div>
                </div>
            </div>
        );
    }
});


/* Wrapping component for switching between app details and installer form */

const OverlayWrapper = React.createClass({
    getInitialState() {
        return {
            error:      false,
            message:    'The application data could not be loaded. Please try again later.',
            app: {
                name:               '',
                short_name:         '',
                installable:        false,
                decoration:         '',
                description:        '',
                versions:           [],
                catalogue_url:      '',
                application_url:    '',
                github_url:         '',
                tags:               [],
                docker_version:     ''
            }
        }
    },
    
    componentDidMount() {
        this.getDetails(this.props.app.name, this.props.app.latest);
    },
    
    versionChange(event) {
        this.getDetails(this.props.app.name, event.target.value);
    },
    
    getDetails(name, version) {
        jQuery('#overlay-loader').stop().fadeIn(500);
        jQuery('#overlay-inner').stop().fadeOut(300);
        
        // Get the details of a specific app
        get(jQuery, '/api/jsonws/BIBBOXDocker-portlet.get-application-store-item',
            { applicationname: name, version: version }, function(result) {
            if(typeof(result.name) == 'undefined') {
                this.setState({ error: true });
            }
            else {
                result.applicationname = name;
                result.docker_version = version;
                result.installable = this.props.app.installable;
                result.versions = this.props.app.versions;
                result.tags = this.props.app.tags;
                this.setState({app: result});
            }
            
            jQuery('#overlay-loader').stop().fadeOut(300);
            jQuery('#overlay-inner').stop().fadeIn(500);
        }.bind(this));
    },
    
    render: function() {
        if(this.state.error) {
            return (
                <div id="overlay-content">
                    <Message text={this.state.message} />
                </div>
            );
        }
        else {
            const button = (this.state.app.installable && this.state.app.user.role == 'admin')
                ?   <button
                        id="overlay-install"
                        onClick={() => { const win = window.open('/install/id/' + this.state.app.applicationname + '/' + this.state.app.docker_version, '_blank'); window.location='/instances'; win.focus(); }}
                    >Install</button>
                :   '';
            
            return (
                <div id="overlay-content">
                    {button}
                    <OverlayDetail app={this.state.app} versionChange={this.versionChange} />
                </div>
            );
        }
    }
});


/* Renders the app details within the overlay */

const OverlayDetail = React.createClass({
    render: function() {
        const version = (this.props.app.docker_version == 'development') ? 'master' : this.props.app.docker_version;
        
        return (
            <div id="app-detail">
                <label className="app-detail-label">Name</label>
                <span className="app-detail-value">{this.props.app.name}</span>
                <label className="app-detail-label">Shortname</label>
                <span className="app-detail-value">{this.props.app.short_name}</span>
                <label className="app-detail-label">Docker versions</label>
                <span className="app-detail-value">
                    <select value={this.props.app.docker_version} onChange={this.props.versionChange}>
                    {
                        this.props.app.versions.map(version => {
                            return (
                                <option key={version.docker_version} value={version.docker_version}>
                                    {
                                        version.docker_version
                                        + ' (App version '
                                        + version.version
                                        + ')'
                                    }
                                </option>
                            );
                        })
                    }
                    </select>
                </span>
                <label className="app-detail-label">Docker versions</label>
                <span className="app-detail-value">{this.props.app.version}</span>
                <label className="app-detail-label">GitHub URL</label>
                <span className="app-detail-value">
                    <a href={'https://github.com/bibbox/' + this.props.app.applicationname + '/tree/' + version} target="_blank">
                        {'https://github.com/bibbox/' + this.props.app.applicationname + '/tree/' + version}
                    </a>
                </span>
                <label className="app-detail-label">Catalogue URL</label>
                <span className="app-detail-value">
                    <a href={this.props.app.catalogue_url} target="_blank">{this.props.app.catalogue_url}</a>
                </span>
                <label className="app-detail-label">Application URL</label>
                <span className="app-detail-value">
                    <a href={this.props.app.application_url} target="_blank">{this.props.app.application_url}</a>
                </span>
                <label className="app-detail-label">Tags</label>
                <span className="app-detail-value">
                {
                    this.props.app.tags.map(tag => {
                        return (
                            <button key={tag} className="tag">{tag}</button>
                        );
                    })
                }
                </span>
                <label className="app-detail-label">Description</label>
                <span className="app-detail-value">{this.props.app.description}</span>
            </div>
        );
    }
});


module.exports = StoreOverlay;