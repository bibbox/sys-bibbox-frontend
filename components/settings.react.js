import React            from 'react';
import ReactDOM         from 'react-dom';
import                  'jquery';
import                  'bootstrap/dist/js/bootstrap';
import Form             from "react-jsonschema-form";


export default class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "form": {},
            "machine_id":   "",
            "active": ""
        };
    }

    getData() {
        Liferay.Service('/BIBBOXDocker-portlet.get-meta-data-information-machine', (result) => {
            result.active = "general";

            this.setState(result);
        }, (error) => {
            alert("Could not get settings");
            console.log(error);
        });
    }

    submitData(formData, type) {
        console.log("Submit data");

        Liferay.Service("/BIBBOXDocker-portlet.update-metadata-info-machine", {
            data: JSON.stringify(formData.formData),
            document_type: type
        }, (result) => {
            console.log(result);

            alert("Saved!");
        }, (error) => {
            alert("Could not save settings");
            console.log(error);
        });
    }

    componentDidMount() {
        jQuery('#portlet_bibboxjscontainer_WAR_BIBBOXDockerportlet .portlet-body > link').attr('href', datastore + '/js/css/metadata.css');

        console.log("Initialize form");
        this.getData();

        jQuery('#loader').stop().fadeOut(300);
        jQuery(ReactDOM.findDOMNode(this)).fadeIn(500);
    }

    onChange(data, type) {
        let form = this.state.form;
        form[type]["form_data.json"] = data.formData;

        this.setState({
            form: form
        });
    }

    log(type) {
        console.log(console, type);
    }

    render() {
        if(this.state.active !== "") {
            return (
                <div id="app-metadata">
                    <h1>Settings</h1>

                    {
                        (this.state.form.hasOwnProperty("general")) ?
                            <div className={(this.state.active === "general") ? 'accordion-item active' : 'accordion-item'}>
                                <div className="accordion-head" onClick={() => this.setState({"active": "general"})}>General</div>
                                <div className="accordion-body">
                                    <Form schema={this.state.form.general["schema.json"]}
                                          uiSchema={this.state.form.general["ui_schema.json"]}
                                          formData={this.state.form.general["form_data.json"]}
                                          onChange={(data) => this.onChange(data, "general")}
                                          onSubmit={(data) => this.submitData(data, "general")}
                                          onError={() => this.log("errors")}/>
                                </div>
                            </div> : null
                    }

                    {
                        (this.state.form.hasOwnProperty("specific")) ?
                            <div className={(this.state.active === "specific") ? 'accordion-item active' : 'accordion-item'}>
                                <div className="accordion-head" onClick={() => this.setState({"active": "specific"})}>Specific</div>
                                <div className="accordion-body">
                                    <Form schema={this.state.form.specific["schema.json"]}
                                          uiSchema={this.state.form.specific["ui_schema.json"]}
                                          formData={this.state.form.specific["form_data.json"]}
                                          onChange={(data) => this.onChange(data, "specific")}
                                          onSubmit={(data) => this.submitData(data, "specific")}
                                          onError={() => this.log("errors")}/>
                                </div>
                            </div> : null
                    }
                </div>
            );
        }
        else {
            return null;
        }
    }
}