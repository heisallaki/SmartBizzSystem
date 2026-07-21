class ApiResponse {
  static send(res, statusCode, data, meta) {
    const body = { success: true, data };
    if (meta) body.meta = meta;
    return res.status(statusCode).json(body);
  }

  static ok(res, data, meta) {
    return ApiResponse.send(res, 200, data, meta);
  }

  static created(res, data, meta) {
    return ApiResponse.send(res, 201, data, meta);
  }

  static noContent(res) {
    return res.status(204).send();
  }
}

module.exports = ApiResponse;