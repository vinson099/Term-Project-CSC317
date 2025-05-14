const express = require("express")
const path = require("path")
const db= require("./db")

const registerRoutes = require('./routes/register');
const authRoutes = require("./routes/login")
const profileRoutes = require("./routes/profile");
const logoutRouter = require('./routes/logout');

const app = express();
const PORT = 3000;

app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.static("public"));
app.use('/profile', profileRoutes);
app.use('/logout', logoutRouter);




app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use(express.static(path.join(__dirname,'public')));


app.use('/register',registerRoutes);
app.use('/login',authRoutes);



// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "login.html"));
//   });

  app.get("/", (req, res) => {
    db.all("SELECT * FROM store", (err, store) => {
      if (err) return res.status(500).send("Database error");
      res.render("index", { store });
    });
  });
  
  app.get("/product/:id", (req, res) => {
    db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, product) => {
      if (err) return res.status(500).send("Database error");
      if (!product) return res.status(404).send("Product not found");
      res.render("product", { product });
    });
  });

// Search API endpoint
app.get("/api/search", (req, res) => {
  const query = req.query.q.toLowerCase();
  
  db.all("SELECT * FROM products", [], (err, products) => {
    if (err) {
      return res.json({ success: false, error: "Database error" });
    }

    const results = products.filter(product => {
      const searchableText = `${product.title} ${product.description} ${product.features}`.toLowerCase();
      return searchableText.includes(query);
    });

    res.json({ success: true, results });
  });
});





app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
 });