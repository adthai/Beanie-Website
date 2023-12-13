/**
 * Andy Thai, Thomas Lu
 * 11/4/2023
 * Section AE: Allison Ho, Kevin Wu
 * Server-side JS file, showcasing the eight different requests being made to
 * fulfill the user's needs. This includes the storage of sign up and login
 * information from users, the display of different beanies available to users,
 * filtering and searching items, adding items to a cart, and determining if
 * a transaction is successful or not.
 */

'use strict';
const express = require('express');
const app = express();
const multer = require('multer');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const cookieParser = require('cookie-parser');
const FOURHUNDRED = 400;
const FIVEHUNDRED = 500;
const THREETHOUSAND = 3000;

// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module

/** creation of cookies upon signing up */
app.get('/storage/:value', function(req, res) {
  let username = req.params.value;
  res.cookie('username', username, {expires: new Date('May 31, 2024 14:00:00')});
  res.type('text').send('success');
});

/** Returns the user's login information if present. */
app.post('/stuffies/login', async (req, res) => {
  try {
    let db = await getDBConnection();
    let userUsername = req.body.username;
    let userPassword = req.body.password;
    let query = 'SELECT username, password FROM customer WHERE username = ? AND password = ?';
    let result = await db.get(query, [userUsername, userPassword]);
    await db.close();
    if (!(result === undefined)) {
      res.type('json');
      res.send(result);
    } else {
      res.status(FOURHUNDRED).type('text');
      res.send('incorrect username or password.');
    }
  } catch (err) {
    res.type('text');
    res.status(FIVEHUNDRED).send("Something went wrong on the server");
  }
});

/** Creates new name, email, username, and password for new users. */
app.post('/stuffies/signup', async (req, res) => {
  try {
    let db = await getDBConnection();
    let name = req.body.name;
    let email = req.body.email;
    let userUsername = req.body.username;
    let userPassword = req.body.password;
    let query = 'SELECT email, username, password FROM customer WHERE email = ? AND username = ?;';
    let result = await db.get(query, [email, userUsername]);
    if (result === undefined) {
      let insert = 'INSERT INTO customer (name, email, username, password) VALUES (?,?,?,?);';
      let out = await db.run(insert, [name, email, userUsername, userPassword]);
      let id = out.lastID;
      let queryTwo = 'SELECT * FROM customer WHERE id = ?';
      let json = await db.get(queryTwo, id);
      await db.close();
      res.type('json');
      res.send(json);
    } else {
      res.status(FOURHUNDRED).type('text');
      res.send('email or username exists.');
    }
  } catch (err) {
    res.type('text');
    res.status(FIVEHUNDRED).send("Something went wrong on the server");
  }
});

/** Returns a result of the list of beanies when prompted in search. */
app.get('/stuffies/beanies', async (req, res) => {
  try {
    let db = await getDBConnection();
    let name = req.query.search;
    if (name) {
      let query = 'SELECT * FROM Others as a JOIN description as b ON a.id=b.id WHERE name';
      let queryAdd = ' LIKE ? OR beanie_description LIKE ? OR sub_category LIKE ? ORDER BY name;';
      let querySum = query + queryAdd;
      let result = await db.all(querySum, ["%" + name + "%", "%" + name + "%", "%" + name + "%"]);
      res.type('json');
      res.send({'page': result});
    } else {
      let ascquery = 'SELECT * FROM Others ORDER BY name';
      let result = await db.all(ascquery);
      await db.close();
      res.type('json');
      res.send({'page': result});
    }
  } catch (err) {
    res.type('text');
    res.status(FIVEHUNDRED).send(err);
  }
});

app.get('/stuffies/filtering', async (req, res) => {
  try {
    let db = await getDBConnection();
    let category = req.query.category;
    if (category) {
      let query = 'SELECT * FROM Others WHERE category = ? ORDER BY name;';
      let result = await db.all(query, category);
      await db.close();
      res.type('json');
      res.send({'page': result});
    } else {
      res.type('text');
      res.status(FOURHUNDRED).send("Category is invalid");
    }
  } catch (err) {
    res.type('text');
    res.status(FIVEHUNDRED).send("Something went wrong on the server");
  }
});

/** Returns the individual information of the beanies. */
app.get('/stuffies/user', async (req, res) => {
  let id = req.query.name;
  try {
    let result = await getUser(id);
    if (result.length === 0) {
      res.status(FOURHUNDRED).send('User does not exist.');
    } else {
      res.type('json');
      res.send(result);
    }
  } catch (err) {
    res.type('text');
    res.status(FIVEHUNDRED).send("Something went wrong on the server");
  }
});

/** Gets necessary item whenever user clicks on an item */
app.get('/stuffies/transaction/addItem', async (req, res) => {
  try {
    let db = await getDBConnection();
    let id = req.query.id;
    if (id) {
      let query = 'SELECT stock FROM Others WHERE id = ?;';
      let result = await db.get(query, id);
      if (result === 0) {
        res.type('text');
        res.status(FOURHUNDRED).send('One of your beanie items are out of stock.');
      } else {
        let queryTwo = 'SELECT * FROM Others WHERE id = ?;';
        let resultTwo = await db.get(queryTwo, id);
        await db.close();
        res.type('json');
        res.send(resultTwo);
      }
    }
  } catch (err) {
    res.type('text');
    res.status(FIVEHUNDRED).send("Something went wrong on the server");
  }
});

/** Returns the confirmation for a specific transaction when successful. */
app.post('/stuffies/transaction/success', async (req, res) => {
  let code = req.body.code;
  let cookie = req.body.cookie;
  let category = req.body.category;
  let subCat = req.body.subCategory;
  let name = req.body.name;
  let gen = req.body.generation;
  let des = req.body.description;
  let img = req.body.img;
  let price = req.body.price;
  let id = req.body.id;
  try {
    if (name) {
      let db = await getDBConnection();
      let query = 'SELECT stock FROM Others WHERE id = ?;';
      let result = await db.get(query, id);
      if (result.stock === 0) {
        res.type('text');
        res.status(FOURHUNDRED).send('One of your items are out of stock.');
      } else {
        await db.exec('UPDATE Others SET stock = stock - 1 WHERE id =' + id + ';');
        let queryTwo = 'INSERT INTO transactions (code, cookie, category, subCategory, name,';
        let queryTwoAdd = ' generation, description, img, price) VALUES (?,?,?,?,?,?,?,?,?)';
        let querySum = queryTwo + queryTwoAdd;
        await db.run(querySum, [code, cookie, category, subCat, name, gen, des, img, price]);
        await db.close();
        res.type('text').send(code);
      }
    }
  } catch (err) {
    res.type('text');
    res.status(FIVEHUNDRED).send("Something went wrong on the server");
  }
});

/** Returns all previous transactions to user. */
app.get('/stuffies/transaction/history', async (req, res) => {
  let cookie = req.query.cookie;
  if (cookie) {
    try {
      let db = await getDBConnection();
      let query = 'SELECT * FROM transactions WHERE cookie = ? ORDER BY id DESC';
      let results = await db.all(query, cookie);
      await db.close();
      res.type('json');
      res.send(results);
    } catch (err) {
      res.type('text');
      res.status(FIVEHUNDRED).send("Something went wrong on the server");
    }
  } else {
    res.type('text');
    res.status(FOURHUNDRED).send('Cookie or confirmation code was not found');
  }
});

/**
 * Selects all information from all rows from the Others table.
 * @param {string} id - name of the beanie.
 * @returns {object} result - resulting beanie description corresponding with
 * the specific beanie.
 */
async function getUser(id) {
  let db = await getDBConnection();
  let query = 'SELECT * FROM Others AS a JOIN description AS b ON a.id = b.id WHERE name = ?';
  let result = await db.all(query, id);
  await db.close();
  return result;
}

/**
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {Object} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'beanies.db',
    driver: sqlite3.Database
  });
  return db;
}

app.use(express.static('public'));
app.use(cookieParser);
const PORT = process.env.PORT || THREETHOUSAND;
app.listen(PORT);