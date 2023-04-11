const swaggerAutogen = require("swagger-autogen");

const outputfile = "./option.json";
const read = ["./server.js"];

const secureityDifinations = {
  basic: {
    type: "basic",
  },
  apiKey: {
    type: "apiKey",
    name: "authorization",
    in: "header",
  },
};

const doc = {
  info: {
    title: "MY API",
    version: "1.0.0",
  },
  secureityDifinations: secureityDifinations,
};

swaggerAutogen(outputfile, read, doc);