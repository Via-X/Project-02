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
//Router to display all Exchanges in database
router.get("/", (req, res, next) => {
  Exchange.find().populate("cryptos")
  .then((allExchanges) => {
    res.render("exchanges/exchanges", {allExchanges});
  })
  .catch((error) => {
    next(error);
  });
});

//Route to display Exchange details
router.get("/:theId", (req, res, next) => {
  Exchange.findById(req.params.theId).populate("cryptos")
  .then((dbExchange) => {
    console.log("pulled exch *******************************");
    res.render("exchanges/details-exchange", dbExchange)
  })
  .catch(error => next(error));
});


//UPDATE
//Route GET to edit an Exchange
router.get("/:theId/edit", (req, res, next) => {
  Exchange.findById(req.params.theId).populate("cryptos")
  .then((dbExchange) => {
    Crypto.find()
    .then((allCryptos) => {
      allCryptos.forEach(crypto => {
        dbExchange.cryptos.forEach(cryptoMember => {
          if(crypto._id.equals(cryptoMember._id)){
            crypto.isinthelist = true;
          }
        })
      });
      res.render("exchanges/edit-exchange", {dbExchange, allCryptos});
    })
    .catch(error => next(error));
  })
  .catch(error => next(error));
});

//Route POST to edit a Exchange
router.post("/:theId", (req, res, next) => {
  const {name, image, cryptos} = req.body;
  Exchange.findByIdAndUpdate(req.params.theId, {name, image, cryptos}, {new: true})
  .then((dbExchange) => {
    console.log(typeof(cryptos));
    console.log(cryptos+"&&&&&&&&&&");
    if(typeof(cryptos) === 'string'){
      Crypto.findById(cryptos)
      .then((dbCrypto) => {
        if(!dbCrypto.exchanges.includes(dbExchange._id)){
          dbCrypto.exchanges.push(dbExchange._id);
          dbCrypto.save();
        }
      })
      .catch(error => next(error));
    }
    else {
      cryptos.forEach(cryptoExchange => {
        Crypto.findById(cryptoExchange)
        .then((dbCrypto) => {
          if(!dbCrypto.exchanges.includes(dbExchange._id)){
            dbCrypto.exchanges.push(dbExchange._id);
            dbCrypto.save();
          }
        })
        .catch(error => next(error));
      })
    }
    req.flash("successMessage", "Exchange successfully updated");
    res.redirect(`/exchanges/${req.params.theId}`);
  })
  .catch(error => next(error));
});


//DELETE 
//Route to delete an Exchange
router.post("/:theId/delete", (req, res, next) => {
  Crypto.find()
  .then((dbCrypto) => {
    dbCrypto.forEach(theCrypto => {
      theCrypto.exchanges.forEach((exchange, index) => {
        if(exchange._id.equals(req.params.theId)){
          theCrypto.exchanges.splice(index, 1);
        }
      })
    })

    Exchange.findByIdAndDelete(req.params.theId) 
    .then((dbExchange) => {
      req.flash("successMessage", "Exchange successfully removed");
      res.redirect("/exchanges");
    })
    .catch((error) => {
      req.flash("errorMessage", "Something went wrong with removing Exchange.");
      next(error);
    })
  })
  .catch((error) => {
    req.flash("errorMessage", "Something went wrong with removing Exchange from Crypto Exchange List.");
    next(error);
  })
});











module.exports = router;

