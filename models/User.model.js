const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    admin: {
      type: Boolean,
      default: false
    },
    user: {
      type: Boolean,
      default: true
    },
    guest: {
      type: Boolean,
      default: false
    },
    wallets: [{
      crypto: {
        type: Schema.Types.ObjectId, 
        ref: "Crypto"
      },
      exchange: {
        type: Schema.Types.ObjectId,
        ref: "Exchange"
      },
      amount: {
        type: Number,
        required: true
      },
      purchasePrice: {
        type: Number,
        required: true
      } 
    }]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
