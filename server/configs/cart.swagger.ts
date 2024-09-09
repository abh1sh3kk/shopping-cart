const cartSchema = {

};

const cartDocs = {
  "/cart/add": {
    post: {
      description: "",
      tags: ["Carts"],
      responses: {
        "200": {
          description: "OK",
        },
        "401": {
          description: "Unauthorized",
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    },
  },
  "/cart/remove/{id}": {
    delete: {
      description: "",
      tags: ["Carts"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        "200": {
          description: "OK",
        },
        "401": {
          description: "Unauthorized",
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    },
  },
  "/checkout": {
    get: {
      description: "",
      tags: ["Carts"],
      responses: {
        "200": {
          description: "OK",
        },
        "401": {
          description: "Unauthorized",
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    },
  },
  "/history/thanos": {
    delete: {
      description: "",
      tags: ["Carts"],
      responses: {
        "200": {
          description: "OK",
        },
        "401": {
          description: "Unauthorized",
        },
        "404": {
          description: "Not Found",
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    },
  },
};

export { cartSchema, cartDocs };
