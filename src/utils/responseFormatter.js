/**
 * Response Formatter Utilities
 * Standardizes API responses for consistency
 */

/**
 * Success response formatter
 * @param {Object} res - Express response object
 * @param {*} data - Data to send
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
function successResponse(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }
  
  /**
   * Error response formatter
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code (default: 400)
   * @param {*} errors - Additional error details (optional)
   */
  function errorResponse(res, message = 'An error occurred', statusCode = 400, errors = null) {
    const response = {
      success: false,
      message,
      ...(errors && { errors })
    };
    
    return res.status(statusCode).json(response);
  }
  
  /**
   * Validation error response formatter
   * @param {Object} res - Express response object
   * @param {Array} errors - Array of validation errors
   */
  function validationErrorResponse(res, errors) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.map(err => ({
        field: err.path || err.param,
        message: err.msg
      }))
    });
  }
  
  /**
   * Not found response formatter
   * @param {Object} res - Express response object
   * @param {string} resource - Name of the resource not found
   */
  function notFoundResponse(res, resource = 'Resource') {
    return res.status(404).json({
      success: false,
      message: `${resource} not found`
    });
  }
  
  /**
   * Paginated response formatter
   * @param {Object} res - Express response object
   * @param {Array} data - Data array
   * @param {number} page - Current page
   * @param {number} limit - Items per page
   * @param {number} total - Total items
   */
  function paginatedResponse(res, data, page, limit, total) {
    const totalPages = Math.ceil(total / limit);
    
    return res.status(200).json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  }
  
  /**
   * Created response formatter
   * @param {Object} res - Express response object
   * @param {*} data - Created resource data
   * @param {string} message - Success message
   */
  function createdResponse(res, data, message = 'Resource created successfully') {
    return res.status(201).json({
      success: true,
      message,
      data
    });
  }
  
  /**
   * No content response
   * @param {Object} res - Express response object
   */
  function noContentResponse(res) {
    return res.status(204).send();
  }
  
  /**
   * Unauthorized response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  function unauthorizedResponse(res, message = 'Unauthorized access') {
    return res.status(401).json({
      success: false,
      message
    });
  }
  
  /**
   * Forbidden response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  function forbiddenResponse(res, message = 'Access forbidden') {
    return res.status(403).json({
      success: false,
      message
    });
  }
  
  /**
   * Conflict response (e.g., duplicate entries)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  function conflictResponse(res, message = 'Resource conflict') {
    return res.status(409).json({
      success: false,
      message
    });
  }
  
  module.exports = {
    successResponse,
    errorResponse,
    validationErrorResponse,
    notFoundResponse,
    paginatedResponse,
    createdResponse,
    noContentResponse,
    unauthorizedResponse,
    forbiddenResponse,
    conflictResponse
  };