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
//Route to display all cryptos in database
router.get("/", (req, res, next) => {
  Crypto.find().populate("exchanges")
  .then((allCryptos) => {
    res.render("cryptos/cryptos", {allCryptos});
  })
  .catch((error) => {
    next(error);
  });
});


//Route to display Crypto details
router.get("/:theId", (req, res, next) => {
  Crypto.findById(req.params.theId).populate("exchanges")
  .then((dbCrypto) => {
    res.render("cryptos/details-crypto", dbCrypto);
  })
  .catch(error => next(error));
});


//UPDATE
//Route GET to edit a Crypto
router.get("/:theId/edit", (req, res, next) => {
  Crypto.findById(req.params.theId).populate("exchanges")
  .then((dbCrypto) => {
    Exchange.find()
    .then((allExchanges) => {
      allExchanges.forEach(exchange => {
        dbCrypto.exchanges.forEach(exchangeMember => {
          if(exchange._id.equals(exchangeMember._id)){
            exchange.isinthelist = true;
          }
        })
      });
      res.render("cryptos/edit-crypto", {dbCrypto, allExchanges});
    })
    .catch(error => next(error));
  })
  .catch(error => next(error));
});


//Route POST to edit a Crypto
router.post("/:theId", (req, res, next) => {
  const {name, currentPrice, image, exchanges} = req.body;
  Crypto.findByIdAndUpdate(req.params.theId, {name, currentPrice, image, exchanges}, {new: true})
  .then((dbCrypto) => {
    console.log(typeof(exchanges));
    console.log(exchanges+"&&&&&&&&&&")
    if(typeof(exchanges) === 'string'){
      Exchange.findById(exchanges)
      .then((dbExchange) => {
        if(!dbExchange.cryptos.includes(dbCrypto._id)){
          dbExchange.cryptos.push(dbCrypto._id);
          dbExchange.save();
        }
      })
      .catch(error => next(error))
    }
    else {
        exchanges.forEach(exchangeMember => {
          Exchange.findById(exchangeMember)
          .then((dbExchange) => {
            if(!dbExchange.cryptos.includes(dbCrypto._id)){
              dbExchange.cryptos.push(dbCrypto._id);
              dbExchange.save();
            }
          })
          .catch(error => next(error));
        });
    }
    req.flash("successMessage", "Crypto successfully updated.");
    res.redirect(`/cryptos/${req.params.theId}`);
  })
  .catch(error => next(error));
});


//Delete
//Route to delete a Crypto
router.post("/:theId/delete", (req, res, next) => {
  Exchange.find()
  .then((dbExchange) => {
    dbExchange.forEach(theExchange => {
      theExchange.cryptos.forEach((crypto, index) => {
        if(crypto._id.equals(req.params.theId)){
          theExchange.cryptos.splice(index,1);
        }
      })
    })

    Crypto.findByIdAndDelete(req.params.theId)
    .then((dbCrypto) => {
      req.flash("successMessage", "Crypto successfully removed");
      res.redirect("/cryptos");
    })
    .catch((error) => {
      req.flash("errorMessage", "Something went wrong with removing Crypto.");
      next(error);
    });
  })
  .catch((error) => {
    req.flash("errorMessage", "Something went wrong with removing Crypto from Exchanges.");
    next(error);
  });
});

module.exports = router;