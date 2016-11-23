import React        from 'react';
import ReactDOM     from 'react-dom';


const installIcon = "M1000,937.667c0,33.138-26.864,60.002-60.002,60.002H60.003C26.864,997.669,0,970.805,0,937.667c0-33.139,26.864-60.003,60.003-60.003h879.995C973.136,877.664,1000,904.528,1000,937.667z M500,817.443l273.352-273.285H575.003V75.003C575.003,33.58,541.423,0,500,0c-41.423,0-75.003,33.58-75.003,75.003v469.155H226.648L500,817.443z";
const startStopIcon = "M451.523,528.59V47.615c0-26.233,21.267-47.5,47.5-47.5s47.5,21.267,47.5,47.5V528.59c0,26.233-21.267,47.5-47.5,47.5S451.523,554.823,451.523,528.59z M711.563,158.396c-23.034-12.554-51.885-4.056-64.438,18.98s-4.055,51.885,18.98,64.438c113.472,61.835,183.962,180.438,183.962,309.526c0,94.084-36.639,182.536-103.165,249.063c-66.527,66.527-154.979,103.166-249.063,103.166s-182.537-36.639-249.064-103.166S145.609,645.424,145.609,551.34c0-129.281,70.646-247.969,184.369-309.747c23.052-12.522,31.587-41.361,19.065-64.413c-12.522-23.052-41.362-31.586-64.413-19.065C140.281,236.53,50.609,387.206,50.609,551.34c0,60.354,11.831,118.929,35.165,174.097c22.528,53.261,54.769,101.085,95.826,142.143c41.057,41.057,88.881,73.298,142.143,95.825c55.167,23.334,113.742,35.165,174.097,35.165s118.93-11.831,174.097-35.165c53.261-22.527,101.085-54.769,142.142-95.826c41.058-41.057,73.298-88.881,95.825-142.143c23.334-55.167,35.165-113.741,35.165-174.096C945.068,387.45,855.595,236.883,711.563,158.396z";
const restartIcon = "M992.001,507.999c0,66.4-13.015,130.838-38.683,191.522c-24.782,58.593-60.251,111.205-105.421,156.375s-97.782,80.639-156.375,105.421C630.838,986.985,566.4,1000,500,1000s-130.838-13.015-191.523-38.683c-58.592-24.782-111.204-60.251-156.373-105.421c-45.171-45.17-80.64-97.782-105.422-156.375C21.014,638.837,7.999,574.399,7.999,507.999c0-94.006,26.612-185.405,76.962-264.315c32.16-50.405,72.985-94.28,120.361-129.74l-65.975-97.322L459.096,0L325.479,291.191l-69.749-102.89c-37.34,28.562-69.592,63.569-95.152,103.63c-41.137,64.473-62.881,139.188-62.881,216.068c0,107.459,41.848,208.486,117.832,284.471C291.514,868.455,392.541,910.302,500,910.302s208.486-41.847,284.471-117.832c75.985-75.984,117.831-177.012,117.831-284.471c0-65.419-16.042-130.34-46.392-187.744c-29.407-55.622-72.15-104.294-123.606-140.756c-20.21-14.321-24.983-42.314-10.663-62.524c14.321-20.21,42.315-24.984,62.524-10.664c62.867,44.548,115.097,104.031,151.042,172.018C972.361,348.603,992.001,428.021,992.001,507.999z";
const deleteIcon = "M861.436,120.218c0,23.419-18.73,42.154-42.149,42.154H180.718c-23.419,0-42.153-18.734-42.153-42.154s18.734-42.154,42.153-42.154h238.097C420.373,35.129,456.283,0,500,0c43.713,0,79.627,35.129,81.189,78.846h238.097C842.705,78.846,861.436,97.58,861.436,120.218z M838.017,222.483c7.807,8.588,11.71,20.298,10.932,32.007l-55.43,706.479c-1.556,21.863-20.294,39.031-42.15,39.031H248.632c-21.856,0-39.81-17.168-42.154-39.031L151.052,254.49c-0.778-11.709,3.125-23.419,10.932-32.007c7.807-8.587,19.517-13.272,31.226-13.272h613.582C818.501,209.21,829.433,213.896,838.017,222.483z M357.145,925.062l-45.28-608.902c-0.781-11.709-10.928-20.297-22.638-19.516c-11.709,0.782-20.297,10.928-19.516,22.638l45.275,608.905c0.781,10.924,10.15,19.516,21.079,19.516c0.781,0,0.781,0,1.562,0C349.338,946.141,357.922,936.771,357.145,925.062z M521.856,317.723c0-11.71-9.369-21.079-21.075-21.079c-11.71,0-21.079,9.369-21.079,21.079v608.902c0,11.709,9.369,21.078,21.079,21.078c11.706,0,21.075-9.369,21.075-21.078V317.723z M731.067,319.282c0.785-11.71-7.807-21.856-19.517-22.638c-11.709-0.781-21.856,7.807-22.634,19.516l-45.275,608.902c-0.785,11.709,7.806,21.855,19.516,22.641c0.777,0,0.777,0,1.556,0c10.932,0,20.301-8.592,21.078-19.516L731.067,319.282z";
const maintenanceIcon = "M508.461,644.761c9.771,9.351,6.007,15.672,1.287,25.198c-28.07,56.666-61.301,109.324-104.846,155.96c-45.203,48.416-87.561,99.534-130.187,150.289c-13.901,16.557-30.232,24.049-51.073,23.785c-55.451,0.118-130.938-66.669-137.815-122c-2.489-20.021,4.187-37.004,17.511-51.715c63.182-69.754,125.223-140.596,190.056-208.781c29.371-30.892,71.061-46.046,106.302-69.661c7.725-5.18,11.834,0.455,16.439,5.064C446.818,583.614,477.106,614.745,508.461,644.761z M603.357,406.12c-5.879-9.308,8.673-15.571,14.986-21.875c67.247-67.112,134.915-133.805,202.521-200.555c9.291-9.172,20.08-17.083,12.802-33.149c-4.514-9.962,3.651-14.387,11.003-18.615c24.808-14.27,49.528-28.696,74.261-43.097c23.623-13.756,27.426,12.698,40.395,20.265c12.349,7.203,6.071,16.042-0.038,24.494c-11.98,16.576-24.018,33.145-35.16,50.282c-9.636,14.825-18.641,28.753-40.146,24.285c-10.6-2.203-15.541,7.791-21.594,13.964c-68.213,69.589-136.194,139.404-204.425,208.975c-4.885,4.98-8.571,12.03-18.643,13.51C627.468,432.374,612.725,420.946,603.357,406.12z M485.574,316.548c-28.429-28.289-43.506-60.784-41.328-100.997c0.979-18.115-1.087-35.942-4.824-53.674C414.447,43.385,279.865-31.684,172.242,13.1c2.268,8.547,9.75,12.903,15.369,18.576c33.462,33.779,66.722,67.781,101.031,100.683c11.156,10.697,13.919,20.753,8.297,34.71c-19.062,47.327-52.535,80.061-99.271,99.755c-14.577,6.143-25.285,3.005-36.721-8.99c-37.789-39.635-76.965-77.944-117.606-118.769C-4.187,277.737,98.948,417.521,242.535,414.136c36.301-0.855,68.912,6.76,94.684,32.339c105.849,105.053,215.092,206.666,318.084,314.625c48.08,50.396,96.999,100.018,146.469,149.05c29.506,29.243,65.495,35.967,104.33,21.702c38.462-14.126,58.418-43.541,62.373-83.557c3.505-35.465-13.02-62.549-37.414-86.857C782.4,613.307,634.326,464.587,485.574,316.548z M866.8,874.33c-21.998,0.255-40.201-18.544-39.425-40.708c0.753-21.337,18.438-38.07,39.747-37.607c21.161,0.463,38.957,18.41,38.761,39.089C905.685,855.597,887.261,874.091,866.8,874.33z";
const activityIcon = "M730.928,904.529c-0.928,0-1.875-0.039-2.812-0.107c-16.66-1.26-30.449-13.438-33.76-29.814L573.848,277.62L428.677,714.695c-4.868,14.658-18.267,24.795-33.696,25.498c-15.415,0.723-29.692-8.174-35.874-22.324L257.095,484.314l-73.193,121.055c-6.753,11.172-18.857,17.998-31.914,17.998H37.3c-20.601,0-37.3-16.699-37.3-37.295c0-20.605,16.699-37.305,37.3-37.305h93.652l99.575-164.683c7.212-11.924,20.479-18.833,34.375-17.915c13.906,0.918,26.143,9.512,31.719,22.285l91.919,210.439l158.716-477.881c5.332-16.045,20.781-26.504,37.666-25.474c16.875,1.025,30.947,13.276,34.287,29.849L741.26,729.998l63.438-173.926c5.371-14.717,19.365-24.517,35.039-24.517h122.969c20.596,0,37.295,16.704,37.295,37.3s-16.699,37.295-37.295,37.295H865.84l-99.883,273.857C760.557,894.812,746.494,904.529,730.928,904.529z";


/**
 * Wrapping component for the activy center
 */
var ActivityCenter = React.createClass({
    getInitialState() {
		return {
			activities: [],
            metadata: {}
		}
	},
    
    componentDidMount() {
	    this.getData();
	    
        setInterval(() => {
            this.getData();
        }, 3000);
    },
  
    getData() {
        get(jQuery, activitydomain + '/activities/api/v1.0/activities', { limit: 10 }, function(result) {
            this.setState({
                activities: result.content,
                metadata: result.metadata
            });
        }.bind(this));
    },
    
    toggle() {
        jQuery('#activities #activity-overlay').toggle();
    },
  
    formatDate(part) {
        if(part < 10) {
            return '0' + String(part);
        }
        else {
            return part;
        }
    },
    
    render: function() {
        const button = (this.state.metadata.pending > 0)
            ? <div id="activity-button" className="loading" onClick={this.toggle}>{this.state.metadata.pending}</div>
            : <div id="activity-button" onClick={this.toggle}><svg viewBox="0 0 1000 1000"><path d={activityIcon} /></svg></div>;
            
        return (
            <div id="activities">
                {button}
                <div id="activity-overlay">
                    <div id="activity-list">
                        {
                            this.state.activities.map((activity) => {
                                let state = '';
                                let icon = '';
                                let finished = '';
                                let start = new Date(activity.start_time);
                                let end = new Date(activity.finished_time);
                                const started = 'started: '
                                    + this.formatDate(parseInt(start.getMonth() + 1)) + '.'
                                    + this.formatDate(parseInt(start.getDate())) + '.'
                                    + String(start.getFullYear()).slice(-2) + ' '
                                    + this.formatDate(parseInt(start.getHours())) + ':'
                                    + this.formatDate(parseInt(start.getMinutes())) + ':'
                                    + this.formatDate(parseInt(start.getSeconds()));

                                switch(activity.state) {
                                    case 'RUNNING': state = 'loading_dark.gif'; break;
                                    case 'FINISHED': state = 'done.png'; break;
                                    case 'SUCCESS': state = 'done.png'; break;
                                    default: state = 'done.png';
                                }
                                switch(activity.type) {
                                    case 'INSTALLAPP': icon = installIcon; break;
                                    case 'STARTAPP': icon = startStopIcon; break;
                                    case 'STOPAPP': icon = startStopIcon; break;
                                    case 'RESTARTAPP': icon = restartIcon; break;
                                    case 'MAINTENANCEAPP': icon = maintenanceIcon; break;
                                    case 'DELETEAPP': icon = deleteIcon; break;
                                    default: icon = startStopIcon;
                                }
                                if(activity.state == 'FINISHED') {
                                    finished = 'finished: '
                                        + this.formatDate(parseInt(end.getMonth() + 1)) + '.'
                                        + this.formatDate(parseInt(end.getDate())) + '.'
                                        + String(end.getFullYear()).slice(-2) + ' '
                                        + this.formatDate(parseInt(end.getHours())) + ':'
                                        + this.formatDate(parseInt(end.getMinutes())) + ':'
                                        + this.formatDate(parseInt(end.getSeconds()));
                                }

                                return (
                                    <div key={activity.id} className="activity" onClick={() => { window.location = '/activities/id/' + activity.id; }}>
                                        <span className="activity-state">
                                            <img src={datastore + '/js/images/' + state} />
                                        </span>
                                        <span className="activity-icon">
                                            <svg viewBox="0 0 1000 1000">
                                                <path d={icon} />
                                            </svg>
                                        </span>
                                        <span className="activity-title">{activity.name}</span>
                                        <span className="activity-start-date">{started}</span>
                                        <span className="activity-end-date" onClick={() => { window.location = '/activities'; }}>{finished}</span>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <span id="activity-history-link" onClick={() => { window.location = '/activities'; }}>Show history</span>
                </div>
            </div>
        );
    }
});


/* Renders the application in the DOM */

ReactDOM.render(
  <ActivityCenter />,
  document.getElementById('activity-wrapper')
);