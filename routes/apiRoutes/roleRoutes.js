const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/roles', (req, res) => {
    const sql = `SELECT * FROM roles`

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

router.post('/roles', ({ body }, res) => {
    const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
    const params = [
        body.title,
        body.salary,
        body.department_id
    ];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        res.json({
            message: 'success',
            data: body
        });
    });
});

router.put('/employee/:id', (req, res) => {
    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`
    const params = [req.body.role_id, req.params.id]

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: req.body
        })
    })
})

module.exports = router;