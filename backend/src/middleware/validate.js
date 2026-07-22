// Usage:
//   router.post("/login", validate(loginSchema), postLogin);
//   router.get("/products", validate(listProductsQuerySchema, "query"), getProducts);

const validate = (schema, target = "body") => (req, res, next) => {
  req[target] = schema.parse(req[target]);
  next();
};

module.exports = validate;