# SYS BIBBOX FRONTEND
## Instructions
1. Clone or download repository
2. Open terminal and navigate to repository directory
3. Install dependencies by running `npm install` in terminal
4. Compile JS components and SASS stylesheets by running `Webpack` in terminal

## Folder structure
| Folder     | Contents                                                                                  |
| ---------- |:------------------------------------------------------------------------------------------|
| components | Contains all react components for rendering different parts of the GUI                    |
| css        | Will contain the compiled stylesheets and linked images                                   |
| images     | Contains all images used by the GUI                                                       |
| js         | Contains external libraries as well as helper functions and the compiled react components |
| sass       | Contains all uncompiled stylesheets of the GUI                                            |

## Workflow
- When the GUI is loaded by an Liferay portlet, the portlet must pass it the url paremeters as an JS object
`params: {param1: x, param2: y, param3: ...}`
- The 'wrapper' component will check the first parameter and load the corresponding component, e.g. 'instances'
- This is how the url parameters are used to navigate between screens -- **bold** params are dynamic:
  - store
  - store /id/ **app-name** / **app-version**
  - instances
  - instance /id/ **instance-id** / info
  - instance /id/ **instance-id** / dashboard
  - instance /id/ **instance-id** / maintenance
  - instance /id/ **instance-id** / log / install
  - instance /id/ **instance-id** / log / general

## Components
The following table shortly explains the different components:

| Component     | Description |
| ------------- | ----------- |
| wrapper       | Renders the different screens of the UI depending on url parameter  |
| store         | Renders the application store                                       |
| store-overlay | Renders the overlay for detailed information on an app in the store |
| install       | Renders a dynamic form for installing a specific application        |
| log           | Renders the content of different log files                          |
| tag-search    | Renders a search input field                                        |
| facet-search  | Renders a facetted filter                                           |
| instances     | Renders a list of installed applcations                             |
| instance      | Renders the different screens for each installed application        |
| info          | Renders the general information screen of an installed application  |
| dashboard     | Renders the administration dashboard of an installed application    |
| maintenance   | Renders the maintenance screen of an installed application          |
| message       | Renders a warning message                                           |
| confirm       | Renders a confirmation popup                                        |

## GUI patterns

## Content
### Store
#### Install
### Instances (Applications)
#### Info Window (User)
#### Admin Dashboard (Admin)