"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function(defaultFuncs, api, ctx) {
  return function httpGet(url, form, callback) {
    var resolveFunc = function(){};
    var rejectFunc = function(){};

    var returnPromise = new Promise(function (resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    form = form || {};

    callback = callback || function(err, data) {
        if (err) return rejectFunc(err);
        resolveFunc(data);
    };

    defaultFuncs
      .get(url, ctx.jar, form)
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function(resData) {
        callback(null, resData);
      })
      .catch(function(err) {
        log.error("httpGet", err);
        return callback(err);
      });

    return returnPromise;
  };
};