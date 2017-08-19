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
    type: Sequelize.FLOAT(4,2)
  },
  description: {
    type: Sequelize.TEXT
  },
}, {
  timestamps: false
});

//syncing database and manually inserting products, we didn't know how to do data migration
sequelize.sync({force: true})
.then(() => {
  Product.create({
    name: "Pacdude Glasses",
    price: 99.99,
    description: "Lorem ipsum dolor sit amet"
  })
})
.then(() => {
  Product.create({
    name: "Pacdude Cup",
    price: 19.99,
    description: "Lorem ipsum dolor sit amet"
  })
})
.then(() => {
  Product.create({
    name: "Pacdude T-shirt",
    price: 25.00,
    description: "Lorem ipsum dolor sit amet"
  })
})
.then(() => {
  Product.create({
    name: "Pacdude Mini-Arcade",
    price: 59.99,
    description: "Lorem ipsum dolor sit amet"
  })
})
.then(() => {
  Product.create({
    name: "PACDUDE",
    price: 49.99,
    description: "Lorem ipsum dolor sit amet"
  })
})
.then(() => {
  Product.create({
    name: "MISS PACDUDE",
    price: 29.99,
    description: "Lorem ipsum dolor sit amet"
  })
})
.then(() => {
  Product.create({
    name: "FLASHMAN",
    price: 9.99,
    description: "Lorem ipsum dolor sit amet"
  })
})
.then(() => {
  Product.create({
    name: "TAPMAN",
    price: 13.50,
    description: "Lorem ipsum dolor sit amet"
  })
});

//creating a Class for the shopping cart globally so it can be used in multiple places
function Cart(oldCart) {
  this.items = oldCart.items || {};  //using oldCart to check if there is already a shopping cart, and adding to it if there is
  this.totalQty = oldCart.totalQty || 0; //if there is not setting the cart to an empty object with 0 items and value
  this.totalPrice = oldCart.totalPrice || 0;
  this.add = function (item, id) {  //telling it what to do when adding a new item to the cart
    let storedItem = this.items[id]; //storing the id of the object being added
    if (!storedItem) {
      storedItem = this.items[id] = {item: item, qty: 0, price: 0};
    }
    storedItem.qty++;
    storedItem.price = (storedItem.item.price * storedItem.qty);
    this.totalQty++;
    this.totalPrice += storedItem.item.price; //making sure the price and qty of the items is iterated
  };
  this.reduceByOne = function(id) { //function to remove a single item from the cart, basically the reverse of the add function
    this.items[id].qty--;
    this.items[id].price -= this.items[id].item.price;
    this.totalQty--;
    this.totalPrice -= this.items[id].item.price;
    if (this.items[id].qty <= 0) {
      delete this.items[id];
    }
  };
  this.removeItem = function(id) {
    this.totalQty -= this.items[id].qty;
    this.totalPrice -= this.items[id].price;
    delete this.items[id];
  }
  this.generateArray = function() { //generates an array to count all the items in the cart object
    let arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]); //pushes each item it can find in the cart into the array
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
      })
      .then(() => {
        res.redirect('/profile')
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

  User.findOne({
    where: {
      username: req.body.username //verifying if user exists
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
		res.redirect('/logged_out');
	})
});

app.get('/logged_out', (req,res) => {
  res.render('logged_out');
});

app.get('/games', (req,res) => {
  res.render('games');
});

app.get('/profile', (req,res) => {
  const user = req.session.user;
  if (user === undefined) {
    res.redirect('/?message=' + encodeURIComponent("Please log in"));
  } else {
    res.render('profile', {
      user: user
    })
  }
});

app.get('/merchandise', (req,res) => {
  res.render('merch');
});

app.get('/shopcart', (req,res) => {
    const user = req.session.user;
    if (user === undefined) {
      res.redirect('/?message=' + encodeURIComponent("Please log in"));
    } else {
      if (!req.session.cart) {
        res.render('shopcart', {
          user: user,
        });
      } else {
        var cart = new Cart(req.session.cart);
        var products = cart.generateArray();
        const user = req.session.user;
        if (user === undefined) {
          res.redirect('/?message=' + encodeURIComponent("Please log in"));
        } else {
          res.render('shopcart', {
            user: user,
            totalPrice: cart.totalPrice.toFixed(2),
            products: products
          })
          console.log(products)
        }
      }
    }
});

app.get('/purch', (req, res) => {
  const user = req.session.user;
  if (user === undefined) {
    res.redirect('/?message=' + encodeURIComponent("Please log in"));
  } else {
    req.session.cart = null;
    res.render('purchasecomplete')
  }
});

app.get('/add-to-cart/:id', (req,res) => {
  const user = req.session.user;
  if (user === undefined) {
    res.redirect('/?message=' + encodeURIComponent("Please log in"));
  } else {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart: {});
    Product.findOne({
      where: {id: productId}
    })
    .then((result) => {
      cart.add(result, result.id); //product, product.id
      req.session.cart = cart;
      console.log(req.session.cart)
    })
    .then(() => {
      res.redirect('/shopcart');
    })
    .catch((err) => {
      console.error(err)
      return res.redirect('/');
    })
  }
});

app.get('/reduce/:id', (req,res) => {
  const user = req.session.user;
  if (user === undefined) {
    res.redirect('/?message=' + encodeURIComponent("Please log in"));
  } else {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart: {});
    cart.reduceByOne(productId)
    req.session.cart = cart;
  }
    res.redirect('/shopcart')
});

app.get('/remove/:id', (req,res) => {
  const user = req.session.user;
  if (user === undefined) {
    res.redirect('/?message=' + encodeURIComponent("Please log in"));
  } else {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart: {});
    cart.removeItem(productId)
    req.session.cart = cart;
  }
  res.redirect('/shopcart')
});

const server = app.listen(3000, () => {
  console.log('Example app listening on port: ' + server.address().port);
})
