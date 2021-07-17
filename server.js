const express = require('express');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use apiRoutes
app.use('/api', apiRoutes);

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// Start server after DB connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

function viewDepartments (){
  const sql = `SELECT*FROM departments`;

  db.query(sql, (err, rows)=>{
      if(err) throw err;
      console.table('\n',rows,'\n');
  });    
  main();
};

function addDepartment(){
  return inquirer.prompt([
      {
          type:'input', 
          name: 'deptName',
          message: 'What is the name of the department to add?'
      }
  ]).then(newDept=>{
      const sql = `INSERT INTO departments(name) VALUES (?)`;
      const params = newDept.deptName;

      db.query(sql, params, (err, result)=>{
          if(err) throw err;
          console.log(`\n ${newDept.deptName} has been added.`)
          });
      main();
  });
};

function deleteDepartmenmt(){
  db.query(`SELECT*FROM departments`, (err, res)=>{
      if(err) throw err;
      const departmentList = res.map(departments => ({name:departments.name, value:departments.id}));
      return inquirer.prompt([
          {
              type:'list',
              name:'department',
              message:'What department do you wish to remove?',
              choices: departmentList
          }
      ]).then(delDept=>{
          const sql = `DELETE FROM departments WHERE id = ?`;
          const params = delDept.department
          db.query(sql, params, (err, result)=>{
              if(err) throw err;
              console.log(`\nDepartment Removed\n`)
          });
          main();
      })
  })
};

function viewRoles(){
  const sql = `SELECT*FROM roles LEFT JOIN departments ON roles.department_id = departments.id`;

  db.query(sql, (err, rows)=>{
      if(err){
          res.status(500).json({error:err.message});
          return;
      }
      console.table('\n',rows,'\n');
      });
  main();
};

function addRole(){
  db.query(`SELECT*FROM departments`, (err, res)=>{
      if(err) throw err;
      const departmentList = res.map(departments => ({name:departments.name, value:departments.id}));
      return inquirer.prompt([
          {
              type:'input',
              name:'title',
              message:'What is the name of the role to add?'
          },{
              type: 'number',
              name:'salary',
              message:'What is the associated salary for this role?'
          },{
              type:'list',
              name:'department',
              message:'What department does the role fall under?',
              choices: departmentList
          }
      ]).then(newRole=>{
          const sql = `INSERT INTO roles(title, salary, department_id) VALUES (?,?,?)`;
          const params = [newRole.title, newRole.salary, newRole.department];

          db.query(sql, params, (err, result)=>{
              if(err) throw err;
              console.log(`n${newRole.title} has been added.`);
          });
          userAction();
      })
  })    
}

function updateRole(){
  db.query(`SELECT*FROM roles`, (err, res)=>{
      if(err) throw err;
      const roleList= res.map(roles => ({name:roles.title, value:roles.id}));
      db.query(`SELECT*FROM employee`, (err, res)=>{
          if(err) throw err;
          const employeeList = res.map(employees => ({name: employees.first_name+' '+employees.last_name, value:employees.id}));
          return inquirer.prompt([
              {
                  type:'list',
                  name:'employee',
                  message:'Which employee requires role adjustment?',
                  choices:employeeList
              },{
                  type:'list',
                  name:'role',
                  message:"What is the employee's new role?",
                  choices:roleList
              }
          ]).then(updateEmploy=>{
              const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
              const params = [updateEmploy.role, updateEmploy.employee];

              db.query(sql, params, (err, result)=>{
                  if(err)throw err
                  console.log('Employee role updated.');
              });
               main();
          })
      })
  });
};

function deleteRole(){
  db.query(`SELECT*FROM roles`, (err, res)=>{
      if(err) throw err;    
      const roleList = res.map(roles => ({name:roles.title, value: roles.id}));
          return inquirer.prompt([
              {
                  type:'list',
                  name:'role',
                  message:'What role do you wish to remove?',
                  choices: roleList
              }
          ]).then(delRole=>{
              const sql = `DELETE FROM roles WHERE id = ?`;
              const params = delRole.role
              db.query(sql, params, (err, result)=>{
                  if(err)throw err
                  console.log(`\nRole Removed\n`)
              });
              main();
          })
  })
};

function allEmployees() {
  const sql = 'SELECT employee.first_name, employee.last_name,  roles.title, roles.salary, departments.name FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id';

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table('\n', rows, '\n');
  });
  main();
};

function addEmployee(){
  db.query(`SELECT*FROM roles`, (err, res)=>{
      if(err) throw err;
      const roleList= res.map(roles => ({name:roles.title, value:roles.id}));
      db.query(`SELECT*FROM employee`, (err, res)=>{
          if(err) throw err;
          const managerList = res.map(employees => ({name: employees.first_name+' '+employees.last_name, value:employees.id}));
          return inquirer.prompt([
              {
                  type:'input',
                  name:'first_name',
                  message:"What is the employee's first name?"
              },{
                  type:'input',
                  name:'last_name',
                  message:"What is the employee's last name?"
              },{
                  type:'list',
                  name:'role',
                  message:"What is the employee's role?",
                  choices:roleList
              },{
                  type:'list',
                  name:'manager',
                  message:'Who will the employee report to?',
                  choices:managerList
              }
          ]).then(newEmployee=>{
              const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
              const params = [newEmployee.first_name, newEmployee.last_name, newEmployee.role, newEmployee.manager];

              db.query(sql, params, (err, result)=>{
                  if(err) throw err;
                  console.log(`${newEmployee,first_name} ${newEmployee.last_name} has been added.`)
              });
              main();
          })        
      })
  })
};

function deleteEmployee(){
  db.query(`SELECT*FROM employee`, (err, res)=>{
      if (err) throw err;
      const employeeList = res.map(employees => ({name: employees.first_name+' '+employees.last_name, value:employees.id}));
      return inquirer.prompt([
          {
              type:'list',
              name:'employee',
              message:'What employee would you like to remove?',
              choices: employeeList
          }
      ]).then(delEmploy=>{
          const sql = `DELETE FROM employee WHERE id = ?`;
          const params =delEmploy.employee
          db.query(sql, params, (err, result)=>{
              if(err) throw err;
              console.log(`\nEmployee Removed\n`)            
          });
          main();
      })
  })
};

function updateRoleSalary(){
  db.query(`SELECT*FROM roles`, (err, res)=>{
      if(err) throw err;
      const roleList= res.map(roles => ({name:roles.title, value:roles.id}));    
      return inquirer.prompt([
          {
              type:'list',
              name:'role',
              message:'Which role requires a salary update?',
              choices: roleList
          },{
              type:'number',
              name:'salary',
              message:'What is the new salary? Please DO NOT use $.'
          }
      ])
      .then(newSalary=>{
          const sql = `UPDATE roles SET salary = ? WHERE id = ?`;
          const params = [newSalary.salary, newSalary.role];

          db.query(sql, params, (err, result)=>{
              if(err) throw err;
              console.log('Salary updated')
          });
          main();
      }) 
  })
};

function main() {
  console.log('----------')
  return inquirer.prompt([
      {
      type:'list',
      name:'options',
      message:'What would you like to do?  To Exit: Use Ctrl+C',
      choices:['View All Departments','View All Roles','View All Employees', 
      'Add A Department','Add A Role','Add An Employee',
      'Delete A Department','Delete A Role','Delete An Employee',
      'Update A Salary','Update An Employee Role','Quit']
      }
  ]).then(actions=>{
      switch(actions.options){
          case 'View All Departments':
              viewDepartments();
              break;
          case "View All Roles":
              viewRoles();
              break;
          case "View All Employees":
              allEmployees();
              break;
          case "Add A Department":
              addDepartment();
              break;
          case "Add A Role":
              addRole();
              break;
          case "Add An Employee":
              addEmployee();
              break;
          case "Delete A Department":
              deleteDepartmenmt();
              break;
          case "Delete A Role":
              deleteRole();
              break;
          case "Delete An Employee":
              deleteEmployee();
              break;
          case "Update A Salary":
              updateRoleSalary();
              break;
          case "Update An Employee Role":
              updateRole();
              break;
          case "Quit":
              db.end();
              return;
      }})
};
main();

