const express = require("express");
const router  = express.Router();
const db      = require('../data/db');

router.get("/", (req, res) => {
    db.all("SELECT * FROM store", (err, store) => {
      if (err) return res.status(500).send("Database error");
      res.render("index", { store });
    });
  });
  
  router.get("/:id", (req, res) => {
    db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, product) => {
      if (err) return res.status(500).send("Database error");
      if (!product) return res.status(404).send("Product not found");
      res.render("product", { product });
    });
  });
  module.exports = router;