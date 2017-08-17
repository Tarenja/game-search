//requiring all used modules, initializing express
const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const session = require('express-session');
const bcrypt = require('bcrypt');

//configuring and initializing modules
const app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.urlencoded({ extended: true }));
const sequelize = new Sequelize('groupshop', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
});
app.use(session({
  secret: "such secret, many wows",
  saveUninitialized: true,
  resave: false
}));

//MODEL DEFINITION
const User = sequelize.define('users', {
  firstname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});

const Product = sequelize.define('products', {
  name: {
    type: Sequelize.STRING
  },
  price: {
    type: Sequelize.FLOAT
  },
  description: {
    type: Sequelize.TEXT
  },
  amount: {
    type: Sequelize.INTEGER
  },
  cover: {
    type: Sequelize.STRING  //image url
  }
}, {
  timestamps: false
});

const Key = sequelize.define('keys', {
  key: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false
});

// const Purchase = sequelize.define('purchases', {
// });
//
// User.hasMany(Purchase);
// Product.hasMany(Purchase);
// Purchase.belongsTo(User);
// Purchase.belongsTo(Product);

sequelize.sync()

//Routing, login form is on index page
app.get('/', (req,res) => {
  res.render('index', {
    message: req.query.message,
    user: req.session.user
  })
});

app.get('/register', (req,res) => {
  res.render('register');
});

app.post('/register', (req,res) => {
  if (req.body.password === req.body.password2) {
    const password = req.body.password;
    bcrypt.hash(password, 8)
    .then((hash) => {
      User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: hash
      })
      .then((user) => {
        req.session.user = user;
        res.redirect('/')
      })
    })
    .catch((error) => {
      console.error(error);
      res.redirect('/?message=' + encodeURIComponent('Error has occurred. Please check the server.'));
    })
  } else {
    res.render('register',
    {message: "The passwords don't match!"
    })
  };
});

app.post('/login', (req, res) => {
  if (req.body.username.length === 0) {
    res.redirect('/?message=' + encodeURIComponent("Please fill in your username."))
    return;                                                //checking if user has filled in both fields
  }
  if (req.body.password.length === 0) {
    res.redirect('/?message=' + encodeURIComponent("Please fill in your password."))
    return;
  }
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  User.findOne({
    where: {
      username: req.body.username,
      email: req.body.email    //verifying if user exists
    }
  })
  .then((user) => {
    const hash = user.password;
    bcrypt.compare(password, hash)
    .then((result) => {
      if (user !== null && result === true) {
        req.session.user = user;
        res.redirect('/');          //if they exist and info is correct, start session for user
      } else {
        res.redirect('/?message=' + encodeURIComponent("Invalid email or password.")); //if incorrect showing error to user
      }
    })
  .catch((error) => {
    console.error(error);           //if any error occurs showing an invalid message to user
    res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
  });
  });
});

const server = app.listen(3000, () => {
  console.log('Example app listening on port: ' + server.address().port);
})
