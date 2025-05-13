const express = require("express")
const path = require("path")
const db= require("./data/db")

const registerRoutes = require('./routes/register');
const authRoutes = require("./routes/login")
const products = require('./routes/front')
const product=require('./routes/front')

const app = express();
const PORT = 3000;

app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.static("public"));



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