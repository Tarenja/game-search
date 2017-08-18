const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const session = require('express-session');

const sequelize = new Sequelize('gamesearch', process.env.POSTGRES_USER, null, {
	host: 'localhost',
	dialect: 'postgres'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public')));

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
	res.render('index');
	});
