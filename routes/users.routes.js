const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Crypto = require("../models/Crypto.model");
const Exchange = require("../models/Exchange.model");
const bcryptjs = require("bcryptjs");

//LOGOUT
//Route POST to logout
router.post("/logout", (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    }
    res.redirect("/login");
  });
});

//CREATE USER
//Route GET to create a User
router.get("/signup", (req, res, next) => {
  res.render("users/signup");
  return;
});

//Route POST to create a User
router.post("/signup", async (req, res, next) => {
  const saltRounds = 10;
  const { username, email, password } = req.body;
  try {
    const salt = await bcryptjs.genSalt(saltRounds);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });

    // const info = await transporter.sendMail({
    //   from: "movies_celebs_appe@mail.com", // sender address
    //   to: email,
    //   subject: "Thank you for signing up", // Subject line
    //   text: "Thank you for signing up", // plain text body
    //   html: `<b>Thank you for signing up, ${username}</b>`, // html body
    // });

    res.redirect("/login");
  } catch (err) {
    req.flash("errorMessage", "MAJOR ERROR" + err);
    next(err);
  }
});

//LOGIN
//Route GET to login user
router.get("/login", (req, res, next) => {
  res.render("users/login");
});

//Route POST to login user
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((dbUser) => {
      if (!dbUser) {
        req.flash("errorMessage", "User not found");
        res.redirect("/login");
      } else if (bcryptjs.compareSync(password, dbUser.password)) {
        req.flash("successMessage", "Successfully Logged in");
        // saves the entire session
        // req.session.currentUser = dbUser;
        req.session.currentUser = {
          _id: dbUser._id,
          username: dbUser.username,
          email: dbUser.email,
          admin: dbUser.admin,
          user: dbUser.user,
          guest: dbUser.guest,
        };

        res.redirect("/");
      } else {
        req.flash("errorMessage", "Email and password combination not found");
        res.redirect("/login");
      }
    })
    .catch((error) => next(error));
});

//Route POST display dashboard
router.get("/userdash", (req, res, next) => {
  User.findById(req.session.currentUser._id)
    .then((dbUser) => {
      res.render("users/userdash", { dbUser });
    })
    .catch((error) => {
      next(error);
    });
});

//DISPLAY ALL USERS
//Route GET to display all User Accounts
router.get("/users", (req, res, next) => {
  User.find()
    .then((allUsers) => {
      res.render("users/users", { allUsers });
    })
    .catch((error) => {
      next(error);
    });
});

//ADD WALLET
//Route GET to add wallet to User Account
router.get("/users/:theId", (req, res, next) => {
  Crypto.find()
  .then((allCryptos) => {
    Exchange.find()
    .then((allExchanges) => {
      User.findById(req.params.theId)
      .then((dbUser) => {
        console.log("****v*v*v*****");
        console.log(dbUser);
        res.render("users/new-wallet", {dbUser, allCryptos, allExchanges});
      })
      .catch((error) => {
        next(error);
      });
    })
    .catch(error => next(error));
  })
  .catch(error => next(error));
 
});


//Route POST to add wallet to User Account
router.post("/users/:theId", (req, res, next) => {
  User.findById(req.params.theId)
  .then((dbUser) => { 
      const newWallet = {
        cryptoId: req.body.crypto.split(',')[0],
        cryptoName: req.body.crypto.split(',')[1],
        exchangeId: req.body.exchange.split(',')[0],
        exchangeName: req.body.exchange.split(',')[1],
        amount: req.body.amount,
        purchasePrice: req.body.purchasePrice,
      }
      console.log(newWallet);
    dbUser.wallets.push(newWallet);
    dbUser.save();
    req.flash("successMessage", "Account successfully updated.");
    res.redirect("/userdash");
  })
  .catch ((error) => {
    req.flash("errorMessage", "MAJOR ERROR" + err);
    next(err);
  })
});


// //DISPLAY AND UPDATE USER DETAILS
// //Route to display User Account details
// router.get("/:theId", (req, res, next) => {
//   User.findById(req.params.theId)
//     .then((dbUser) => {
//       res.render("users/new-wallet", dbUser);
//     })
//     .catch((error) => {
//       next(error);
//     });
// });

// router.post("/:theId", async (req, res, next) => {
//   try{
//       const currentUser = await User.findByIdAndUpdate(req.params.theId, {
//           email: req.body.email,
//           admin: Boolean(req.body.admin),
//           user: Boolean(req.body.user),
//           guest: Boolean(req.body.guest)
//       }, {new: true})
//       req.flash("successMessage", "Account successfully updated.");
//       res.redirect(`/${req.params.theId}`);
//   } catch(err) {
//       req.flash("errorMessage", "MAJOR ERROR" + err);
//       next(err);
//   };
// });

module.exports = router;
