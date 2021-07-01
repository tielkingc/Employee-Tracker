INSERT INTO departments
    (name)
VALUES
    ('Software Support');

INSERT INTO roles
    (title, salary, department_id)
VALUES
    ('Developer', 60000, 1),
    ('Manager', 80000, 1);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Tom', 'Adams', 2, NULL),
    ('Susan', 'Clark', 1, 1),
    ('James', 'Newman', 1, 1);



