INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Tom', 'Adams', 001, 010),
    ('Susan', 'Clark', 002, 010),
    ('James', 'Newman', 010, 010);

INSERT INTO roles
    (title, salary, department_id)
VALUES
    ('Developer', 60000, 01),
    ('Manager', 80000, 01);

INSERT INTO departments
    (name)
VALUES
    ('Software Support');