// Usage:
//   router.post("/login", validate(loginSchema), postLogin);

const validate = (schema) => (req, res, next) => {
  req.body = schema.parse(req.body);
  next();
};

module.exports = validate;