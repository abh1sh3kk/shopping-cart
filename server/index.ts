import express, { Express, Request, Response } from "express";
import "./configs/db";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { userData, productData } from "./models/user.model";
import { authenticateUser } from "./middlewares/authenticate";
import { randomUUID } from "crypto";
import UserController from "./controllers/user.controller";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const jsonParser = bodyParser.json();
app.use(cookieParser());
app.use(jsonParser);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to my server");
});

// ------------------------------------------------------------------------------------------------

app.post("/login", jsonParser, UserController.login);
app.get("/logout", UserController.logout);

// ------------------------------------------------------------------------------------------------

app.get("/products", (req: Request, res: Response) => {
  // try {
  // const products = await productData.find({})
  // } catch (err) {}

  // res.send(products);
  res.end();
});

// const getUserData = async (req: Request, res: Response) => {
//   // get the user from the cookie
//   const username = req.cookies?.username;
//   if (!username) {
//     res.send("Login not successful, please try again");
//     return;
//   }

//   try {
//     const userdata = await userData.findOne(
//       { username: username },
//       { id: 1, username: 1, carts: 1, history: 1 }
//     );

//     if (!userdata) {
//       res.status(404).send("User not found");
//       return;
//     }

//     console.log("user data i got is ", userdata);
//     res.json(userdata);
//   } catch (err) {
//     console.error("Error fetching user data:", err);
//     res.send("Failed to fetch user data");
//     return;
//   }
// };
// ------------------------------------------------------------------------------------------------

app.get("/user", UserController.getUserData);

app.post("/user/add", async (req: Request, res: Response) => {
  const user = req.body;
  console.log("user request should be ", req.body);
  try {
    const replaced = await userData.findOneAndReplace({ username: user.username }, user, {
      upsert: true,
    });
    // @ts-ignore
    if (replaced?.lastErrorObject?.updatedExisting) {
      res.status(200).send("User updated successfully");
    } else {
      res.status(201).send("New user added successfully");
    }
  } catch (error) {
    console.error("Error adding/updating user:", error);
    res.status(500).send("An error occurred while adding/updating the user");
  }
});

// ------------------------------------------------------------------------------------------------
type ProductInCart = {
  id: string;
  productId: string;
  quantity: number;
};

const getCartFromDB = async (username: string): Promise<any> => {
  try {
    // Simulate fetching the cart from the database
    const user = await userData.findOne({ username }, { projection: { carts: 1 } });
    return user?.carts;
  } catch (err) {
    console.error("Error fetching cart from database:", err);
    throw new Error("Could not retrieve cart");
  }
};

const addNewCartToDB = async (
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

app.post("/cart/add", authenticateUser, async (req: Request, res: Response) => {
  const username: string = req.cookies?.username;

  if (!username) {
    return res.status(401).send("User not authenticated");
  }

  try {
    const existingCart: ProductInCart[] = await getCartFromDB(username);
    const productToAddInCart: ProductInCart = req.body;

    let cartUpdated = false;

    const newCart: ProductInCart[] = existingCart.map((currentProduct: ProductInCart) => {
      if (currentProduct.productId === productToAddInCart.productId) {
        cartUpdated = true;
        return {
          ...currentProduct,
          quantity: currentProduct.quantity + productToAddInCart.quantity,
        };
      }
      return currentProduct;
    });

    if (!cartUpdated) {
      newCart.push(productToAddInCart);
    }

    await addNewCartToDB(username, newCart);

    res.status(200).send("Product added to cart successfully");
  } catch (error) {
    console.error("Error processing cart update:", error);
    res.status(500).send("An error occurred while updating the cart");
  }
});

app.delete("/cart/remove/:id", authenticateUser, async (req: Request, res: Response) => {
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
});

app.get("/history", (req: Request, res: Response) => {
  res.send("Fetched purchase history");
});

app.get("/checkout", authenticateUser, async (req: Request, res: Response) => {
  const username = req.cookies?.username;
  try {
    const user = await userData.findOne({ username });

    if (!user) {
      return res.status(404).send("User not found");
    }

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
});

// ------------------------------------------------------------------------------------------------
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// const user = {
//   id: "ksdjfk23k4jk",
//   username: "abh1sh3k",
//   password: "something",
//   history: [{ c_id: "ksdj", productId: "3sdf", quantity: 4 }],
//   carts: [{ c_id: "ksdj", productId: "3sdf", quantity: 4 }],
// };
