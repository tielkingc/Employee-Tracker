const inquirer = require('inquirer');
const fetch = require('node-fetch');
const db = require('../db/connection')

function newEmployee() {    
    fetch('http://localhost:3001/api/employee')
    .then(results => {
        return results.json()
    })
    .then(results => {
        fetch('http://localhost:3001/api/roles')
        .then(roles => {return roles.json()})
        .then(roles => {
            // const rolesList = roles.json();
            // console.log(rolesList)
        
            const employees = []
            for (var i = 0; i < results.data.length; i++) {
                employees.push(`${results.data[i].first_name} ${results.data[i].last_name}`);
            }

            const role = [];
            for (var x = 0; x < roles.data.length; x++) {
                role.push(`${roles.data[x].title}`);
            }
            console.log(typeof employees)
            return inquirer.prompt([
                {
                    type: 'input',
                    name: 'firs_name',
                    message: 'What is the employees first name?'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'What is the employees last name?'
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Who is the employees manager?',
                    choices: employees
                },
                {
                    type: 'rawlist',
                    name: 'role_id',
                    message: 'What is the employees role?',
                    choices: role
                }
            ])
            .then((employeeData, role) => {
                console.log(employeeData.role_id.choices)
                const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
                const params = [
                    employeeData.first_name,
                    employeeData.last_name,
                    employeeData.role_id.choices.indexOf(employeeData.role_id),
                    employeeData.manager_id
                ];

                db.query(sql, params, (err, result) => {
                    if (err) {
                        res.status(404).json({ error: err.message });
                        return;
                    }
                    res.json({
                        message: 'success',
                        data: body
                    })
                })
            })
        })
        
    })
    
    
}

module.exports = newEmployee