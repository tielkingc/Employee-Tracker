const db = require('../db/connection');
const fetch = require('node-fetch');

function employeeQuery() {
    const employees = []
    return fetch('http://localhost:3001/api/employee')
    .then(empData => {
        return empData.json();
    })
    .then(empData => {
        for (var i = 0; i < empData.data.length; i++) {
            employees.push(`${empData.data[i].first_name} ${empData.data[i].last_name}`)
        }
        return employees;
    })
}

module.exports = employeeQuery;