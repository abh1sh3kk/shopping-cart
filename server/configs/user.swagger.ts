const userSchema = {
  UserLoginSchema: {
    type: "object",
    required: ["username", "password"],
    properties: {
      username: {
        type: "string",
      },
      password: {
        type: "string",
      },
    },
    example: {
      username: "abh1sh3k",
      password: "abhishek",
    },
  },
  Userlist: {
    type: "array",
    items: {
      type: "object",
      required: ["username", "password"],
      properties: {
        username: {
          type: "string",
        },
        cart: {
          type: "string",
        },
        history: {
          type: "string",
        },
      },
      example: {
        username: "abh1sh3k",
        cart: [],
        history: [],
      },
    },
  },
  User: {
    type: "object",
    required: ["_id", "username", "password", "cart", "history"],
    properties: {
      _id: {
        type: "string",
        description: "The auto-generated id of the user",
      },
      username: {
        type: "string",
      },
      password: {
        type: "string",
      },
      cart: {
        type: "array",
        items: {
          $ref: "#/components/schemas/CartItem",
        },
      },
      history: {
        type: "array",
        items: {
          $ref: "#/components/schemas/CartItem",
        },
      },
    },
    example: {
      _id: "138fkjsk8492",
      username: "abh1sh3k",
      password: "abhishek",
      cart: [],
      history: [],
    },
  },
  AddUserSchema: {
    type: "object",
    properties: {
      username: {
        type: "string",
      },
      password: {
        type: "string",
      },
      cart: {
        type: "array",
        items: {
          $ref: "#/components/schemas/CartItem",
        },
      },
      history: {
        type: "array",
        items: {
          $ref: "#/components/schemas/CartItem",
        },
      },
    },
  },
  CartItem: {
    type: "object",
    properties: {
      _id: {
        type: "string",
      },
      productId: {
        type: "string",
      },
      quantity: {
        type: "number",
      },
    },
  },
};

const userDocs = {
  "/login": {
    post: {
      summary: "Log in existing user",
      tags: ["User"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UserLoginSchema",
            },
          },
        },
      },
      responses: {
        "200": {
          description: "User logged in.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserLoginSchema",
              },
            },
          },
        },
        "500": {
          description: "Some server error",
        },
      },
    },
  },
  "/list": {
    get: {
      summary: "List the users",
      tags: ["User"],
      responses: {
        "200": {
          description: "User list fetched.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Userlist",
              },
            },
          },
        },
        "500": {
          description: "Some server error",
        },
      },
    },
  },
  "/logout": {
    post: {
      summary: "Log out the user",
      tags: ["User"],
      responses: {
        "200": {
          description: "User logged out.",
        },
        "401": {
          description: "User not authenticated.",
        },
        "500": {
          description: "Some server error.",
        },
      },
    },
  },
  "/add": {
    post: {
      summary: "Add a new user",
      tags: ["User"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/AddUserSchema",
            },
          },
        },
      },
      responses: {
        "201": {
          description: "New user added successfully.",
        },
        "500": {
          description: "Some server error.",
        },
      },
    },
  },
};

export { userSchema, userDocs };
