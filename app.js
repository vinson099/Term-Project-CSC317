const express = require("express")
const path = require("path")
const db= require("./data/db")
const session = require('express-session');

const registerRoutes = require('./routes/register');
const authRoutes = require("./routes/login")
const products = require('./routes/front')
const product=require('./routes/front')
const cartRoutes = require('./routes/cart');

const profileRoutes = require("./routes/profile");
const logoutRouter = require('./routes/logout');

const app = express();
const PORT = 3000;

// Session middleware configuration
app.use(session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge:  60 * 60 * 1000 
    }
}));

app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.static("public"));
app.use('/profile', profileRoutes);
app.use('/logout', logoutRouter);
app.use('/cart', cartRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use(express.static(path.join(__dirname,'public')));

app.use('/register',registerRoutes);
app.use('/login',authRoutes);
app.use('/',products)
app.use('/product',product)



// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "login.html"));
//   });

  





app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
 });