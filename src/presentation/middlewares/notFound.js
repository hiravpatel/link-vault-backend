const ApiResponse = require('../../shared/ApiResponse');

function notFound(req, res) {
  return ApiResponse.error(res, 'Route not found', 404, [], 'ROUTE_NOT_FOUND');
}

module.exports = notFound;
