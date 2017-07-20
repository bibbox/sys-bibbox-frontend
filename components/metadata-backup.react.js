import React            from 'react';
import ReactDOM         from 'react-dom';
import                  'jquery';
import                  'bootstrap/dist/js/bootstrap';
import Form             from "react-jsonschema-form";


const URL = 'http://elastic-el.demo.bibbox.org';
const prefill_data = {
    "machine_id": "demo.bibbox.org",
    "instance_id": "oc.demo.bibbox.org",
    "app_id": "app-owncloud",
    "app_name": "ownCloud",
    "version": "v10.0",
    "url": "http://oc.demo.bibbox.org",
    "created": "1418737629",
    "last_update": "141897629"
};

export default class Metadata extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            groups: [
                {
                    key: 'instance-general',
                    title: 'General',
                    schema: {
                        "title": "Metadata",
                        "type": "object",
                        "properties": {
                            "visibility": {
                                "type": "string",
                                "title": "Visibility",
                                "enum": [
                                    "public",
                                    "private"
                                ],
                                "default": "public"
                            },
                            "contact": {
                                "type": "object",
                                "title": "Contact person",
                                "properties": {
                                    "foaf:firstName": {
                                        "type": "string",
                                        "title": "First name"
                                    },
                                    "foaf:familyName": {
                                        "type": "string",
                                        "title": "Last name"
                                    },
                                    "foaf:mbox": {
                                        "type": "string",
                                        "format": "email",
                                        "title": "E-Mail"
                                    }
                                }
                            },
                            "common": {
                                "type": "object",
                                "title": "General information",
                                "properties": {
                                    "machine_id": {
                                        "type": "string"
                                    },
                                    "instance_id": {
                                        "type": "string"
                                    },
                                    "app_id": {
                                        "type": "string"
                                    },
                                    "app_name": {
                                        "type": "string"
                                    },
                                    "version": {
                                        "type": "string"
                                    },
                                    "url": {
                                        "type": "string"
                                    },
                                    "created": {
                                        "type": "string"
                                    },
                                    "last_update": {
                                        "type": "string"
                                    },
                                    "data_type": {
                                        "type": "string",
                                        "title": "Data type",
                                        "enum": [
                                            "generic",
                                            "beta",
                                            "gamma"
                                        ],
                                        "default": "generic"
                                    },
                                    "data_visibility": {
                                        "type": "string",
                                        "title": "Data visibility",
                                        "enum": [
                                            "public",
                                            "private",
                                            "restricted"
                                        ],
                                        "default": "private"
                                    },
                                    "description": {
                                        "type": "string",
                                        "title": "Description"
                                    }
                                }
                            }
                        }
                    },
                    ui_schema: {
                        "common": {
                            "machine_id": {
                                "ui:widget": "hidden"
                            },
                            "instance_id": {
                                "ui:widget": "hidden"
                            },
                            "app_id": {
                                "ui:widget": "hidden"
                            },
                            "app_name": {
                                "ui:widget": "hidden"
                            },
                            "version": {
                                "ui:widget": "hidden"
                            },
                            "url": {
                                "ui:widget": "hidden"
                            },
                            "created": {
                                "ui:widget": "hidden"
                            },
                            "last_update": {
                                "ui:widget": "hidden"
                            },
                            "description": {
                                "ui:widget": "textarea"
                            }
                        }
                    },
                    form_data: {
                        "visibility": "public",
                        "contact": {},
                        "common": {
                            "machine_id": system_data.machine_id,
                            "instance_id": system_data.instance_id,
                            "app_id": system_data.app_id,
                            "app_name": system_data.app_name,
                            "version": system_data.version,
                            "url": system_data.url,
                            "created": system_data.created,
                            "last_update": system_data.last_update,
                            "data_type": "generic",
                            "data_visibility": "private"
                        }
                    }
                },
                {
                    key: 'instance-rdconnect',
                    title: 'RD Connect',
                    schema: {},
                    ui_schema: {},
                    form_data: {}
                },
                {
                    key: 'instance-bcnet',
                    title: 'BC NET',
                    schema: {},
                    ui_schema: {},
                    form_data: {}
                }
            ],
            active: 'General',
            application: 'app-owncloud',
            version: 'development',
            shortname: 'ownCloud',
            longname: 'ownCloud v.10',
            url: 'http://oc.dev.bibbox.org/'
        };
    }

    getData() {
        fetch(URL + '/path/to/api/' + this.props.params.param2)
            .then((response) => response.json())
            .then((json) => {
                console.log(json);

                let groups = [];

                for(let group of json.groups) {
                    if(group.title === 'General') {

                    }

                    groups.append({
                        title: group.title,
                        schema: group.schema,
                        ui_schema: group.ui_schema,
                        form_data: {...group.form_data, ...group.prefill_data}
                    });
                }

                this.setState({
                    schema: json['schema'],
                    ui_schema: json['ui_schema'],
                    form_data: json['form_data']
                });
            })
            .catch((error) => {
                alert("Could not get data");
                console.log(error);
            });
    }

    submitData(formData) {
        console.log("Submit data");
        console.log(formData);
    }

    componentDidMount() {
        jQuery('#portlet_bibboxjscontainer_WAR_BIBBOXDockerportlet .portlet-body > link').attr('href', datastore + '/js/css/metadata.css');

        console.log("Initialize form");
        // this.getData();

        jQuery('#loader').stop().fadeOut(300);
        jQuery(ReactDOM.findDOMNode(this)).fadeIn(500);
    }

    log(type) {
        console.log(console, type);
    }

    render() {
        return (
            <div id="app-metadata">
                <div className="app-metadata-header">
                    <span className="app-metadata-title" onClick={() => { const win = window.open(this.state.url, '_blank'); win.focus(); }}>
                        <img src={datastore + '/bibbox/' + this.state.application + '/blob/' + this.state.version + '/icon.png'} />
                        <h1>{this.state.shortname}</h1>
                        <h3>{this.state.longname}</h3>
                    </span>
                </div>

                <div id="tab-nav">
                    <span className="tab-nav-item">
                        <a href={'/instance/id/' + params.param2 + '/dashboard'}>
                            Dashboard
                        </a>
                    </span>
                    <span className="tab-nav-item">
                        <a href={'/instance/id/' + params.param2 + '/log'}>
                            Logs
                        </a>
                    </span>
                    <span className="tab-nav-item active">
                        <a href={'/instance/id/' + params.param2 + '/info'}>
                            Metadata
                        </a>
                    </span>
                </div>

                <h1>Metadata</h1>

                {
                    this.state.groups.map((group) => {
                        let active = (group === this.state.active) ? 'active' : '';

                        return (
                            <div key={group} className={'accordion-item ' + active}>
                                <div className="accordion-head" onClick={() => this.setState({ active: group })}>{group}</div>
                                <div className="accordion-body">
                                    <Form schema={this.state.schema}
                                          uiSchema={this.state.ui_schema}
                                          formData={this.state.form_data}
                                          onChange={() => this.log("changed")}
                                          onSubmit={(data) => this.submitData(data)}
                                          onError={() => this.log("errors")} />
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}