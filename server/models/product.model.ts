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

const productData = model("products", productSchema);

export default productData;

// const user = {
//   id: "ksdjfk23k4jk",
//   username: "abh1sh3k",
//   password: "something",
//   history: [{ c_id: "ksdj", productId: "3sdf", quantity: 4 }],
//   carts: [{ c_id: "ksdj", productId: "3sdf", quantity: 4 }],
// };
