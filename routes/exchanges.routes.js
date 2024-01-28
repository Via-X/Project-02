const router = require("express").Router();
const Crypto = require("../models/Crypto.model");
const Exchange = require("../models/Exchange.model");

//CREATE
//Route GET to Add New Crypto to DB
router.get("/create", (req, res, next) => {
  res.render("exchanges/new-exchange");
});

//Route POST to Add New Crypto to DB
router.post("/create", (req, res, next) => {
  Exchange.create({
    name: req.body.name,
    image: req.body.image,
  })
  .then((dbExchange) => {
    req.flash("successMessage", "Exchange successfully added to database");
    res.redirect("/exchanges");
  })
  .catch((error) => {
    req.flash("errorMessage", "Sorry something went wrong");
    res.redirect("/create");
  })
})


//READ
//Router to display all cryptos in database
router.get("/", (req, res, next) => {
  Exchange.find().populate("cryptos")
  .then((allExchanges) => {
    res.render("exchanges/exchanges", {allExchanges});
  })
  .catch((error) => {
    next(error);
  });
});



















module.exports = router;

