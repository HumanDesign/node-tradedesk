/* jslint node: true */
'use strict';

var url = require('url');
var request = require('request');
var extend = require('deep-extend');

function Tradedesk (options) {
  // Automagically return new instance when called
  if (!(this instanceof Tradedesk)) return new Tradedesk(options);

  // Augment default options with passed in values
  this.options = extend({
    login: null,
    password: null,
    token: null,
    base_url: 'https://apisb.thetradedesk.com/v3',
    request_options: {
      headers: {
        'Accept': '*/*',
      }
    }
  }, options);

  this.request = request.defaults(this.options.request_options);
}

// Method for retrieving an auth token given a login and password
Tradedesk.prototype.__getAuthToken = function(login, password, callback) {
  var auth_params = {
    "Login": login,
    "Password": password
  };

  this.__request('post', 'authentication', auth_params, function(error, data, response) {
    if (!data.Token) {
      throw new Error(data.Message);
    }
    else {
      callback(data.Token);
    }
  });
};

// Join the base url and provided endpoint into a full path.
Tradedesk.prototype.__buildEndpoint = function(path) {
  var endpoint = this.options.base_url;
  // If a full path was provided, do nothing
  if (url.parse(path).protocol !== null) {
    endpoint = path;
  }
  else {
    // Handle path leading slash
    endpoint += (path.charAt(0) === '/') ? path : '/' + path;
  }

  return endpoint;
};

// Perform a request of the API
Tradedesk.prototype.__request = function(method, path, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = {};
  }

  // Include the TDD authorization header
  var options = {
    method: method.toLowerCase(),
    url: this.__buildEndpoint(path),
    headers: {
      'TTD-Auth': this.options.token
    }
  };

  // Parameters passed in URL
  if (method === 'get') {
    if (Object.keys(params).length !== 0) {
      options.url = options.url.concat('/', params[Object.keys(params)[0]]);
    }
  }

  // JSON parameters passed in request body
  if (method === 'post' || method === 'put' || method === 'delete') {
    options.json = true;
    options.body = params;
  }

  this.request(options, function(error, response, data) {
    // Handle errors in response
    if (error) {
      callback(error, response, data);
    }
    else {
      try {
        if (typeof data !== 'object') {
          data = JSON.parse(data);
        }
      }
      catch(parseError) {
        callback(
          new Error('Status Code: ' + response.statusCode),
          data,
          response
        );

      }
      if (typeof data.errors !== 'undefined') {
        callback(data.errors, data, response);
      }
      else if(response.statusCode !== 200) {
        callback(
          new Error('Status Code: ' + response.statusCode),
          data,
          response
        );
      }
      else {
        callback(null, data, response);
      }
    }
  });
};

// Create the public methods for REST actions
Tradedesk.prototype.get = function(url, params, callback) {
  return this.__request('get', url, params, callback);
};

Tradedesk.prototype.post = function(url, params, callback) {
  return this.__request('post', url, params, callback);
};

Tradedesk.prototype.put = function(url, params, callback) {
  return this.__request('put', url, params, callback);
};

Tradedesk.prototype.delete = function(url, params, callback) {
  return this.__request('delete', url, params, callback);
};

module.exports = Tradedesk;
