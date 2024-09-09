const productSchema = {
  ProductList: {
    type: "array",
    items: {
      type: "object",
      required: ["name", "price", "description"],
      properties: {
        _id: {
          type: "string",
          description: "The unique identifier for the product",
        },
        name: {
          type: "string",
        },
        price: {
          type: "number",
        },
        description: {
          type: "string",
        },
      },
      example: {
        _id: "product1-82934u9h",
        name: "Gaaming Headset",
        price: 2500,
        description: "Fantastic headset",
      },
    },
  },
  ProductItem: {
    type: "object",
    required: ["_id", "name", "price", "description"],
    properties: {
      _id: {
        type: "string",
        description: "The unique identifier for the product",
      },
      name: {
        type: "string",
      },
      price: {
        type: "number",
      },
      description: {
        type: "string",
      },
    },
    example: {
      _id: "product1-82934u9h",
      name: "Gaaming Headset",
      price: 2500,
      description: "Fantastic headset",
    },
  },
};

const productDocs = {
  "/products": {
    get: {
      description: "",
      tags: ["Products"],
      responses: {
        "200": {
          description: "OK",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProductList",
              },
            },
          },
        },
      },
      "500": {
        description: "Internal Server Error",
      },
    },
  },
  "/product/{id}": {
    get: {
      description: "",
      tags: ["Products"],
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
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProductItem",
              },
            },
          },
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

export { productSchema, productDocs };
