/* jslint node: true */
'use strict';

var url = require('url');
var request = require('request');
var extend = require('deep-extend');

function Tradedesk (options) {
  if (!(this instanceof Tradedesk)) return new Tradedesk(options);

  this.options = extend({
    login: null,
    password: null,
    token: null,
    base_url: 'https://apisb.thetradedesk.com/v3',
    request_options: {
      headers: {
        'Accept': '*/*',
        'content-type': 'application/json',
      }
    }
  }, options);

  if (this.options.token !== null) {
    this.request = request.defaults(
      extend(
        this.options.request_options,
        {
          'TTD-Auth': this.options.token
        }
      )
    );
  }
  else {
    // [TODO]: Do TDD auth steps
    var auth_url = this.options.base_url + '/authentication';
    var auth_params = {
      "Login": this.options.login,
      "Password": this.options.password
    };
    console.log(this.__request('post', auth_url, auth_params));
    this.request = request.defaults(this.options.request_options);
  }
}

Tradedesk.prototype.__buildEndpoint = function(path) {
  var endpoint = this.options.base_url;
  if (url.parse(path).protocol !== null) {
    endpoint = path;
  }
  else {
    endpoint += (path.charAt(0) === '/') ? path : '/' + path;
  }

  return endpoint;
};

Tradedesk.prototype.__request = function(method, path, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = {};
  }

  var options = {
    method: method.toLowerCase(),
    url: this.__buildEndpoint(path)
  };

  // Parameters passed in URL
  if (method == 'get') {
    options.qs = params;
  }

  // JSON parameters
  // [TODO]: ?????
  if (method === 'post') {
    options.json = true;
  }

  console.log(options);
  this.request(options, function(error, response, data) {
    if (error) {
      callback(error, data, response);
    }
    else {
      try {
        data = JSON.parse(data);
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
