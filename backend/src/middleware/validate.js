const validate = (schema, target = "body") => (req, res, next) => {
  req[target] = schema.parse(req[target]);
  next();
};

module.exports = validate;