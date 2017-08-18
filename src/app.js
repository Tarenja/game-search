//requiring all used modules, initializing express
const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const session = require('express-session');
const bcrypt = require('bcrypt');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

//configuring and initializing modules
const app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
const sequelize = new Sequelize('groupshop', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
  storage: './session.postgres'
});
app.use(session({
  store: new SequelizeStore({
  db: sequelize,
  checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
  expiration: 24 * 60 * 60 * 1000 // The maximum age (in milliseconds) of a valid session.
  }),
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

function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;
  this.add = function (item, id) {
    let storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = {item: item, qty: 0, price: 0};
    }
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.totalPrice += storedItem.item.price;
  };
  this.generateArray = function() {
    let arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
};

//Routing, login form is on index page
app.get('/', (req,res) => {
  res.render('index', {
    message: req.query.message,
    user: req.session.user
  })
});

app.get('/look4games', (req,res) => {
  res.render('look4games');
});

app.get('/profile', (req,res) => {
  res.render('profile2');
});

app.get('/merchandise', (req,res) => {
  res.render('merch');
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
        res.redirect('/profile');          //if they exist and info is correct, start session for user
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

app.get('/logout', (req, res) =>{
	req.session.destroy(function(error) {    //logging out user and destorying session
		if(error) {
			throw error;
		}
		res.redirect('/?message=' + encodeURIComponent("Successfully logged out."));
	})
});

app.get('/add-to-cart/:id', (req,res) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart: {});

  Product.findOne({
    where: {id: productId}
  })
  .then((result) => {
    // console.log(result);
    cart.add(result, result.id); //product, product.id
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  })
  .catch((err) => {
    console.error(err)
    return res.redirect('/');
  })
});

const server = app.listen(3000, () => {
  console.log('Example app listening on port: ' + server.address().port);
})
