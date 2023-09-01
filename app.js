const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=>{
    User.findByPk(1)
    .then(user=>{
        //we can add a new user field to our request.
        req.user = user
        next()
    })
    .catch((err)=>console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//we are creating associations or relations between tables.
// A.belongsTo(B) means a one to one association where, foreign key is defined in A.

Product.belongsTo(User, { constraints : true, onDelete : 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through : CartItem });
Product.belongsToMany(Cart, { through : CartItem });

sequelize.sync()          // {force: true} inside sync is used to overwrite the tables.
//now we create and manage a dummy user.
.then(result=>{
    // console.log(result);
    return User.findByPk(1)
})
.then(user=>{
    if(!user){
        User.create({name:'Ramu', email: 'test@test.com'})
    }
    return user;
})
.then(user=>{
    return user.createCart()
})
.then(cart=>{
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
})

