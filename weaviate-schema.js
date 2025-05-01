const productClass = {
  class: "Product",
  vectorizer: "text2vec-openai",
  moduleConfig: {
    "text2vec-openai": {
      model: "ada",
      modelVersion: "002",
      type: "text",
    },
  },
  properties: [
    {
      name: "name",
      dataType: ["text"],
    },
    {
      name: "description",
      dataType: ["text"],
    },
    {
      name: "price",
      dataType: ["number"],
    },
    {
      name: "productId",
      dataType: ["int"],
    },
  ],
};

const reviewClass = {
  class: "Review",
  vectorizer: "text2vec-openai",
  moduleConfig: {
    "text2vec-openai": {
      model: "ada",
      modelVersion: "002",
      type: "text",
    },
  },
  properties: [
    {
      name: "content",
      dataType: ["text"],
    },
    {
      name: "rating",
      dataType: ["number"],
    },
    {
      name: "productId",
      dataType: ["int"],
    },
    {
      name: "createdAt",
      dataType: ["date"],
    },
  ],
};

module.exports = {
  productClass,
  reviewClass,
};
