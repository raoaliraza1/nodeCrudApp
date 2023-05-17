// Import dependencies
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crudapp'
});

connection.connect((err) => {
  if (err) {
    console.error('Error in connecting to MySQL database:', err);
    return;
  }
  console.log('Successfully connected to MySQL database');
});

// Configure body-parser middleware
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

//API's
// Create a new record
app.post('/addUserData', (req, res) => {
    var { name, email, age, gender } = req.body;
    console.log(req.body);
    var sql = 'INSERT INTO user_detail (name, email, age, gender) VALUES (?, ?, ?, ?)';
    connection.query(sql, [name, email, age, gender], (err, result) => {
      if (err) {
        console.error('Error creating record:', err);
        res.status(500).json({ error: err });
      } else {
        res.status(201).json({ message: 'User data added successfully' });
      }
    });
});

// Get a single record by ID
app.get('/getUserData/:id', (req, res) => {
    var { id } = req.params;
    var sql = 'SELECT * FROM user_detail WHERE id = ?';
    connection.query(sql, [id], (err, results) => {
      if (err) {
        console.error('Error fetching record:', err);
        res.status(500).json({ error: err });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'User data not found' });
      } else {
        res.status(200).json(results[0]);
      }
    });
});

// Get a single record by name
app.get('/getUserDataByName/:name', (req, res) => {
  var { name } = req.params;
  console.log(req.params);
  var sql = 'SELECT * FROM user_detail WHERE name = ?';
  connection.query(sql, [name], (err, results) => {
    if (err) {
      console.error('Error fetching record:', err);
      res.status(500).json({ error: err });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'User data not found' });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

// update a record
app.put('/updateUserData/:id', (req, res) => {
    var { id } = req.params;
    var { name, email, age, gender } = req.body;
    var sql = 'UPDATE user_detail SET name = ?, email = ?, age = ?, gender = ? WHERE id = ?';
    connection.query(sql, [name, email, age, gender, id], (err, result) => {
      if (err) {
        console.error('Error updating record:', err);
        res.status(500).json({ error: err });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'User data not found' });
      } else {
        res.status(200).json({ message: 'user data Update Successfully'});
      }
    });
});

// Delete a record
app.delete('/deleteUserData/:id', (req, res) => {
    var { id } = req.params;
    var sql = 'Delete FROM  user_detail WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
      if (err) {
        console.error('Error deleting record:', err);
        res.status(500).json({ error: err });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'User data not found' });
      } else {
        res.status(200).json({ message: 'User data deleted Successfully'});
      }
    });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});