import { Schema, model } from "mongoose";

const productSchema = new Schema({
  id: {
    type: String,
    require: true,
    unique: true,
  },
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    default: "",
  },
  availableQty: {
    type: Number,
    require: true,
  },
  price: {
    type: String,
    require: true,
  },
  images: {
    type: [String],
    default: [],
  },
});

const cartSchema = new Schema({
  c_id: {
    type: String,
    require: true,
    unique: true,
  },
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
const productData = model("products", productSchema);

export { userData, productData };
