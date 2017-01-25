jQuery(window).click(function() {
    jQuery('#activities #activity-overlay').hide();
});

/* Returns the new index of an element for ordering an array by name */

function compareName(a, b) {
    if (a.app_name < b.app_name)
        return -1;
    if (a.app_name > b.app_name)
        return 1;
    return 0;
}


/* Returns an object with one property for each tag containing an array of related items */

function getTags(groups, more) {
    var tags = {};
    
    for (var i = 0; i < groups.length; i++) {
        for (var j = 0; j < groups[i].group_members.length; j++) {
            for (var k = 0; k < groups[i].group_members[j].tags.length; k++) {
                if(typeof(tags[groups[i].group_members[j].tags[k]]) != 'undefined') {
                    tags[groups[i].group_members[j].tags[k]].push(groups[i].group_members[j]);
                }
                else {
                    tags[groups[i].group_members[j].tags[k]] = [groups[i].group_members[j]];
                }
            }
            if(more) {
                // tags[groups[i].group_members[j].app_name] = [groups[i].group_members[j]];
                tags[groups[i].group_members[j].app_dispay_name] = [groups[i].group_members[j]];
            }
        }
    }
    
    return tags;
}


/* Returns an object with one property for each tag containing an array of related items */

function getInstanceTags(apps) {
    var tags = {};
    
    for (var i = 0; i < apps.length; i++) {
        for (var j = 0; j < apps[i].tags.length; j++) {
            if(typeof(tags[apps[i].tags[j]]) != 'undefined') {
                tags[apps[i].tags[j]].push(apps[i]);
            }
            else {
                tags[apps[i].tags[j]] = [apps[i]];
            }
        }
        tags[apps[i].instancename] = [apps[i]];
        tags[apps[i].instanceshortname ] = [apps[i]];
    }
    
    return tags;
}


/* Cleans the tags provided by the Tagger component */

function cleanTags(tags) {
    var result = [];
    
    tags.forEach(function(tag) {
        result.push(tag.text);
    });
    
    return result;
}


/*
    Returns all non-empty groups and their apps that match the given tags
    If no tags are passed, all groups containing apps will be returned
*/

function filterCurrent(groups, tags) {
    // Create an array to store the filtered results
    var filtered = {};
    
    // Remove all duplicates from tags array
    var tags = removeDuplicates(tags);
    
    // Loop through all groups
    groups.forEach(function(group, key) {
        
        // If no tags are passed, return all groups containing apps
        if(tags.length == 0 && group.group_members.length > 0) {
            filtered[group.group_name] = group;
        }
        
        // Otherwise...
        else {
            group.group_members.forEach(function(app) {
                
                // Check whether the app's tags, name, shortname or description contain one of the tags
                tags.every(function(tag) {
                    
                    if(substringExists(app.tags, tag)                                        // Check app tags
                //  || app.app_name.toLowerCase().indexOf(tag.toLowerCase()) !== -1          // Check app name
                    || app.app_dispay_name.toLowerCase().indexOf(tag.toLowerCase()) !== -1   // Check app shortname
                //  || app.description.toLowerCase().indexOf(tag.toLowerCase()) !== -1) {    // Check app description
                    ) {
                        // If the matching group is not yet in the filtered results...
                        if(typeof(filtered[group.group_name]) == 'undefined') {

                            // ...add the group to the results along with the matching app
                            filtered[group.group_name] = {
                                group_name: group.group_name,
                                group_members: [app]
                            };
                        }
                        else {
                            // If the group is already in the resuts, only add the matching app to it
                            filtered[group.group_name].group_members.push(app);
                        }
                        return false;
                    }
                    return true;
                });
            });
        }
    });
    
    // Finally return the matching groups and apps
    return filtered;
}


/* Checks for each app instance, whether the filter tags match their name or tags and returns the matching app instances */

function filterAppInstances(apps, tags) {
    var filtered = [];
    var tags = removeDuplicates(tags);
    
    if(tags.length == 0 && apps.length > 0) {
        filtered = apps;
    }
    else {
        apps.forEach(function(app) {
            tags.every(function(tag) {
                if(substringExists(app.tags, tag)
                || app.instancename .toLowerCase().indexOf(tag.toLowerCase()) !== -1
                || app.instanceshortname.toLowerCase().indexOf(tag.toLowerCase()) !== -1) {
                    filtered.push(app);
                    
                    return false;
                }
                return true;
            });
        });
    }
    
    return filtered;
}


/* Checks whether a string is a substring of one of the array elements */

function substringExists(array, string) {
    var result = false;
    
    array.forEach(function(element) {
        if(element.toLowerCase().indexOf(string.toLowerCase()) !== -1) {
            result = true;
        }
    });
    
    return result;
}


/* Remove duplicates from array */

function removeDuplicates(input) {
    var output = input.filter(function(item, pos) {
        return input.indexOf(item) == pos;
    });
    
    return output;
}


/* Generate authentiaction token */

function make_base_auth(user, password) {
    var tok = user + ':' + password;
    var hash = btoa(tok);
    return 'Basic ' + hash;
}


/* Make AJAX GET request */

function get(jQuery, url, data, callback) {
    if(typeof(Liferay) != 'undefined') {
        data.p_auth = Liferay.authToken;
    }
    else {
        url = basedomain + url;
    }
    
    jQuery.ajax({
        dataType: 'json',
        contentType: 'application/json',
        headers: {'Access-Control-Allow-Origin': '*'},
        type: 'GET',
        url: url,
        data: data,
        success: function (result) {
            callback(result);
        }
    });
}


/* Make AJAX POST request */

function post(jQuery, url, data, callback) {
    if(typeof(Liferay) != 'undefined') {
        url += '?p_auth=' + Liferay.authToken;
    }
    else {
        url = basedomain + url;
    }
    
    jQuery.ajax({
        dataType: 'json',
        contentType: 'application/json',
        headers: {'Access-Control-Allow-Origin': '*'},
        type: 'POST',
        url: url,
        data: JSON.stringify(data),
        success: function (data) {
            callback(data);
        }
    });
}