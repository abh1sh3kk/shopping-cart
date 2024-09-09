import { cartDocs, cartSchema } from "./cart.swagger";
import { userDocs, userSchema } from "./user.swagger";
import { productDocs, productSchema } from "./product.swagger";

export const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Shopping cart",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Abhishek Acharya",
        email: "th3.abh1sh3k@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    paths: {
      ...userDocs,
      ...cartDocs,
      ...productDocs,
    },
    components: {
      schemas: {
        ...userSchema,
        ...cartSchema,
        ...productSchema,
      },
    },
  },
  apis: ["./routes/user.route.ts", "./routes/product.route.ts", "./routes/cart.route.ts"],
};