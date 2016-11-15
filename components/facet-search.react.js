import React from 'react';
import ReactDOM from 'react-dom';
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';


/* Renders facetted search navigation here */

const FacetSearch = React.createClass({
    getInitialState() {
        return {
            tags: []
        }
    },
    
    tagsChanged: function(newTags) {
        this.setState({
            tags: newTags
        });
        this.props.return(newTags);
    },
    
    render: function() {
        let total = 0;
        let items = [];
        let tags = this.props.tags;
        let keys = Object.keys(tags).sort();
        
        for(let i = 0; i < keys.length; i++) {
            total += tags[keys[i]].length;
            
            items.push({
                key:        keys[i],
                children:   tags[keys[i]]
            });
        }
        
        return (
            <div className="facet-wrapper">
                <span className="facet-title">{this.props.label}</span>
                <CheckboxGroup
                    name="tags"
                    value={this.state.tags}
                    onChange={this.tagsChanged}
                    className="facet-group"
                >
                    {
                        items.map((item) => {
                            return (
                                <FacetItem
                                    key={item.key}
                                    tag={item.key}
                                    items={item.children}
                                    count={this.props.count}
                                    percentage={item.children.length / total * 100}
                                />
                            );
                        })
                    }
                </CheckboxGroup>
            </div>
        );
    }
});


/* Renders an facet item */

const FacetItem = React.createClass({
    render: function() {
        let quantity = (this.props.count) ? ' (' + this.props.items.length + ')' : '';
        
        return (
            <nav className="facet-item">
                <label key={this.props.tag} className="facet-label">
                    <Checkbox value={this.props.tag} /> {this.props.tag + quantity}
                </label>
                <span
                    style={{width: this.props.percentage + '%'}}
                    className="facet-bar">
                </span>
            </nav>
        );
    }
});


module.exports = FacetSearch;