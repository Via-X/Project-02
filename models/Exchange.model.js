const { Schema, model } = require("mongoose");

const exchangeSchema = new Schema ({
  name: String,
  image: String,
  cryptos: [{type: Schema.Types.ObjectId, ref: "Crypto"}]
});

const Exchange = model("Exchange", exchangeSchema);

module.exports = Exchange;