import { Request, Response } from "express";
import { ProductInCart } from "../configs/types";
import userData from "../models/user.model";
import productData from "../models/product.model";

export const addNewCartToDB = async (
  username: string,
  newCart: ProductInCart[]
): Promise<any> => {
  try {
    await userData.updateOne({ username }, { $set: { carts: newCart } });
  } catch (err) {
    console.error("Error adding data to the database:", err);
    throw new Error("Could not update cart");
  }
};

export const getCartFromDB = async (username: string): Promise<any> => {
  try {
    const user = await userData.findOne({ username }, { carts: 1 });
    return user?.carts || [];
  } catch (err) {
    console.error("Error fetching cart from database:", err);
    throw new Error("Could not retrieve cart");
  }
};

const fetchProducts = async (req: Request, res: Response) => {
  try {
    const products = await productData.find({});
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("An error occurred while fetching products");
  }
};

const fetchProduct = async (req: Request, res: Response) => {
  const productId = req.params.id;
  console.log("product id to search ", productId)

  try {
    const product = await productData.findOne({_id: productId });
    console.log("product i found is ", product);
    if (!product) return res.status(404).send("Product not found");

    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({
      error: "An error occurred while fetching the product",
    });
  }
};

const checkout = async (req: Request, res: Response) => {
  const username = req.cookies?.username;
  try {
    const user = await userData.findOne({ username });

    // @ts-ignore
    const { carts, history } = user;

    const updatedHistory = [...history, ...carts];

    await userData.updateOne(
      { username },
      {
        $set: {
          carts: [],
          history: updatedHistory,
        },
      }
    );

    res.status(200).send("Checkout successful");
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).send("An error occurred during checkout");
  }
};

const thanos = async (req: Request, res: Response) => {
  const username: string = req.cookies?.username;

  try {
    const user = await userData.findOne({ username });
    if (!user || !user.history || user.history.length === 0) {
      return res.status(404).send("No history found for user");
    }

    const shuffledHistory = user.history.sort(() => Math.random() - 0.5);

    const halfLength = Math.ceil(shuffledHistory.length / 2);
    const reducedHistory = shuffledHistory.slice(0, halfLength);

    await userData.updateOne({ username }, { $set: { history: reducedHistory } });

    res.status(200).send("Half of the history items were removed randomly");
  } catch (error) {
    console.error("Error processing history update:", error);
    res.status(500).send("An error occurred while updating the history");
  }
};

const addCart = async (req: Request, res: Response) => {
  const username: string = req.cookies?.username;

  try {
    const existingCart: ProductInCart[] = await getCartFromDB(username);
    const productToAddInCart: ProductInCart = req.body;

    console.log("existing and product to add are: ", existingCart, productToAddInCart);

    const newCart: ProductInCart[] = existingCart
      ? [...existingCart, productToAddInCart]
      : [productToAddInCart];

    await addNewCartToDB(username, newCart);

    res.status(200).send("Product added to cart successfully");
  } catch (error) {
    console.error("Error processing cart update:", error);
    res.status(500).send("An error occurred while updating the cart");
  }
};

const removeCart = async (req: Request, res: Response) => {
  const username = req.cookies["username"];
  const cartId = req.params.id;

  try {
    const result = await userData.updateOne(
      { username: username },
      { $pull: { carts: { _id: cartId } } }
    );

    if (result.modifiedCount > 0) {
      res.status(200).send("Removed product successfully").end();
    } else {
      res.send("No changes were made").end();
    }
  } catch (err) {
    console.log("Error occurred in removing the item from cart", err);
    res.send("Internal error occurred").end();
  }
};

export default { fetchProducts, fetchProduct, addCart, removeCart, thanos, checkout };
