const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/employee', (req, res) => {
    const sql = `SELECT * FROM employee`

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(404).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

router.post('/employee', ({ body }, res) => {
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
    const params = [
        body.first_name,
        body.last_name,
        body.role_id,
        body.manager_id
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

module.exports = router;