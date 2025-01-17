import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  productId: {
    type: String,
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
  },
});

const userSchema = new Schema({
  id: {
    type: String,
    require: true,
    unique: true,
  },
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  carts: {
    type: [cartSchema],
    defualt: [],
  },
  history: {
    type: [cartSchema],
    default: [],
  },
});

const userData = model("user", userSchema);

export default userData;

// const user = {
//   id: "ksdjfk23k4jk",
//   username: "abh1sh3k",
//   password: "something",
//   history: [{ c_id: "ksdj", productId: "3sdf", quantity: 4 }],
//   carts: [{ c_id: "ksdj", productId: "3sdf", quantity: 4 }],
// };
