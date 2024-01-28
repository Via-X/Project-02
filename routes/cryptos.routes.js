const router = require("express").Router();
const Crypto = require("../models/Crypto.model");
const Exchange = require("../models/Exchange.model");



//CREATE
//Route GET to Add New Crypto to DB
router.get("/create", (req, res, next) => {
  res.render("cryptos/new-crypto");
});

//Route POST to Add New Crypto to DB
router.post("/create", (req, res, next) => {
  Crypto.create({
    name: req.body.name,
    image: req.body.image,
    currentPrice: req.body.currentPrice
  })
  .then((dbCrypto) => {
    req.flash("successMessage", "Crypto successfully added to database");
    res.redirect("/cryptos");
  })
  .catch((error) => {
    req.flash("errorMessage", "Sorry something went wrong");
    res.redirect("/create");
  })
})


//READ
//Router to display all cryptos in database
router.get("/", (req, res, next) => {
  Crypto.find().populate("exchanges")
  .then((allCryptos) => {
    res.render("cryptos/cryptos", {allCryptos});
  })
  .catch((error) => {
    next(error);
  });
});







module.exports = router;