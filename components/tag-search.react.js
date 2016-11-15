import React from 'react';
import ReactDOM from 'react-dom';
import { WithContext as ReactTags } from 'react-tag-input';


/* Renders the tag search element */

const TagSearch = React.createClass({
    getInitialState() {
        return {
            tags: [],
            placeholder: 'Search...'
        }
    },
    
    handleDelete(i) {
        let tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({tags: tags});
        this.props.setTags(cleanTags(tags));
    },
    
    handleAddition(tag) {
        let tags = this.state.tags;
        tags.push({
            id: tags.length + 1,
            text: tag
        });
        this.setState({tags: tags});
        this.props.setTags(cleanTags(tags));
    },
    
    handleFilterSuggestions(textInputValue, possibleSuggestionsArray) {
        var lowerCaseQuery = textInputValue.toLowerCase()

        return possibleSuggestionsArray.filter(function(suggestion)  {
            return suggestion.toLowerCase().includes(lowerCaseQuery)
        })
    },
    
    render() {
        let tags = this.state.tags;
        let suggestions = this.props.suggestions;
        return (
            <div id="tagger">
                <ReactTags
                    tags={tags}
                    suggestions={suggestions}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    placeholder={this.state.placeholder}
                    handleFilterSuggestions={this.handleFilterSuggestions}
                />
            </div>
        )
    }
});


module.exports = TagSearch;