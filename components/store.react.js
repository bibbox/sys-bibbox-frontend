import React        from 'react';
import ReactDOM     from 'react-dom';
import jQuery       from 'jquery';
import TagSearch    from './tag-search.react';
import FacetSearch  from './facet-search.react';
import StoreOverlay from './store-overlay.react';
import Message      from './message.react';


/* Wrapping component for the store GUI  */

const Store = React.createClass({
    getInitialState: function() {
        return {
            all:        [],
            current:    [],
            selected:   null,
            taggertags: [],
            facettags:  [],
            error:      false,
            message:    'Application store could not be updated. Please try again later.'
        }
    },
    
    componentDidMount: function() {
        this.updateApps();
    },
    
    select: function(selection) {
        let latest_version = selection.versions[0].docker_version;
        
        this.setState({
            selected: {
                name:           selection.app_name,
                installable:    selection.installable,
                latest:         latest_version,
                versions:       selection.versions,
                tags:           selection.tags
            }
        });
    },
    
    reset: function() {
        this.setState({
            selected: null
        });
    },
    
    setTaggerTags: function(tags) {
        this.refreshApps(this.state.all, tags, this.state.facettags);
    },
    
    setFacetTags: function(tags) {
        this.refreshApps(this.state.all, this.state.taggertags, tags);
    },
    
    updateApps: function() {
        jQuery('#loader').stop().show();
        // Read local apps and send API call for updating the list
        get(jQuery, '/api/jsonws/BIBBOXDocker-portlet.get-application-store-list', {}, function(result) {
            switch(result.status) {
                case 'error':
                    this.setState({error: true});
                    this.fadeIn();
                    break;
                default: this.refreshApps(result.groups);
            }
            
            // Send request for updated list and refresh again
            get(jQuery, '/api/jsonws/BIBBOXDocker-portlet.get-updated-application-store-list', {}, function(result) {
                switch(result.status) {
                    case 'uptodate': break;
                    case 'error': this.setState({error: true}); break;
                    default: this.refreshApps(result.groups);
                }
            }.bind(this));
        }.bind(this));
    },
    
    refreshApps: function(all = [], taggertags = [], facettags = []) {
        let merged_tags = taggertags.concat(facettags);
        
        this.setState({
            all:        all,
            current:    filterCurrent(all, merged_tags),
            taggertags: taggertags,
            facettags:  facettags
        });
        
        this.fadeIn();
    },
    
    fadeIn: function() {
        jQuery('#loader').stop().fadeOut(300);
        jQuery(ReactDOM.findDOMNode(this)).fadeIn(500);
    },
    
    render: function() {
        let overlay = (this.state.selected != null) ? <StoreOverlay app={this.state.selected} reset={this.reset} /> : '';
        let message = (this.state.error) ? <Message text={this.state.message} /> : '';
        let suggestions = Object.keys(getTags(this.state.all, true)).sort();
        
        return (
            <div id="app-store">
                {message}
                <TagSearch all={this.state.all} setTags={this.setTaggerTags} suggestions={suggestions} />
                <FacetSearch label="Tags" tags={getTags(this.state.all)} return={this.setFacetTags} count={false} />
                <StoreApps
                    select={this.select}
                    current={this.state.current}
                    selected={this.state.selected}
                />
                {overlay}
            </div>
        );
    }
});

        
/* Renders the list of available apps */

const StoreApps = React.createClass({
    getInitialState: function() {
        return {view: 'tiles'}
    },
    
    select: function(appname) {
        this.props.select(appname);
    },
    
    render: function() {
        let items = [];
        let current = this.props.current;
        let keys = Object.keys(current);
        
        for(let i = 0; i < keys.length; i++) {
            items.push(current[keys[i]]);
        }
        
        return (
            <div id="store-results">
                {
                    items.map(function(group) {
                        return (
                            <div key={group.group_name} className="store-group">
                                <span className="store-group-name">{group.group_name}</span>
                                {
                                    group.group_members.map(function(app) {
                                        let highlight = (this.props.selected == app.app_name) ? " highlight" : "";
                                        let decoration = (app.decoration != '') ? <span className="decoration"><img src={"/o/BIBBOXDocker-portlet/images/" + app.decoration + ".png"} /></span> : '';

                                        return (
                                            <div
                                                key={app.app_name}
                                                className={"store-app" + highlight}
                                                onClick={this.select.bind(this, app)}
                                            >
                                                {decoration}
                                                {/* <span className="character">{app.app_dispay_name.charAt(0)}</span> */}
                                                <span className="icon">
                                                    <img src={"https://raw.githubusercontent.com/bibbox/" + app.app_name + "/master/icon.png"} />
                                                </span>
                                                <span className="name">{app.app_dispay_name }</span>
                                                {/* <AppTags tags={app.tags} /> */}
                                                <span
                                                    title="Example short description"
                                                    className="description"
                                                >
                                                    {app.short_description}
                                                </span>
                                            </div>
                                        );
                                    }.bind(this))
                                }
                            </div>
                        );
                    }.bind(this))
                }
            </div>
        );
    }
});


/* Renders the tags of a app */

const AppTags = React.createClass({
    render: function() {
        return (
            <div className="tags">
            {
                this.props.tags.sort(compareName).map(function(tag) {
                    return (
                        <button key={tag} className="tag">{tag}</button> 
                    );
                }.bind(this))
            }
            </div>
        );
    }
});


module.exports = Store;