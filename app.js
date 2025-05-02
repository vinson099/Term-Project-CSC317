const express = require("express")
const path = require("path")

const registerRoutes = require('./routes/register');
const authRoutes = require("./routes/login")

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,'public')));


app.use('/register',registerRoutes);
app.use('/login',authRoutes);



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
  });


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
 });