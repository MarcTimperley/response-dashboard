# dashboard
Performance measurement dashboard with configurable metrics and end-point monitoring. Ideally suited to API microservices.

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![pipeline status](https://github.com/MarcTimperley/dashboard/badges/master/pipeline.svg)](https://gitlab.com/MarcTimperley/eplate/commits/master)

##### Why another API boilerplate?
This boilerplate doesn't rely on external libraries and allows you to simply add routes without worrying about filling the server index. Configuration is externalised into one file, making it simple to adopt and new routes are just dropped into the routes folder...

# Demo

## Getting Started

  1. Clone or download the project
  2. Modify the `config.js`
  3. Run `npm install` to get all the dependencies
  4. Run `npm start` to start the server

### Prerequisites

- node 8.x +
- npm 6.x +

### Installing

Follow the getting started steps and access the server on the configured port (http://localhost:4000) unless a different port has been specified in the `config.js` file.


## Using for your project

 - Follow the steps in _getting started_
 - Disconnect the git repo with `git init`
 - Add your own git repo using `git remote add origin [url]`
 - Push to your repo with `git push --set-upstream origin master`
 - Change the links in this readme.md file as required
 
## Running the tests

To run the tests, jest must be installed.

- run `npm test` to execute the tests. Shipped tests include validation that routes are loaded and the application has been built correctly.

You are _strongly_ encouraged to write your own tests for any functionality and routes you develop. Check `__tests__/example.test.js` for an example.

You should consider using TDD for the development as it can be very beneficial to reduce the coding effort and ensure the stability of the application itself.

## Contributing and Code of Conduct

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on the code of conduct, and the process for submitting pull requests.

## Authors

* **Marc Timperley** - *Initial work*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## ToDo

- [ ] Add css/scss
- [ ] Build all test cases
- [ ] Add security to web server front end
- [ ] Improve automation
- [ ] Test coverage
- [ ] Build admin UI
- [X] Move measurement config to JSON file
- [ ] Display current alerts on dashboard
- [ ] Build UI for alerts
- [ ] Write alerts to database
 

## Acknowledgments

*
