const { Schema, model } = require("mongoose");

const cryptoSchema = new Schema ({
  name: String,
  image: String,
  currentPrice: Number,
  exchanges: [{type: Schema.Types.ObjectId, ref: "Exchange"}]
});

const Crypto = model("Crypto", cryptoSchema);

module.exports = Crypto;