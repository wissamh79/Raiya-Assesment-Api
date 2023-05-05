const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api");

class noContentError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NO_CONTENT;
  }
}

module.exports = noContentError;
