'use strict';

var appUrl = window.location.origin;
var ajaxFunctions = {
   ready: function ready (fn) {
      if (typeof fn !== 'function') {
         return;
      }

      if (document.readyState === 'complete') {
         return fn();
      }

      document.addEventListener('DOMContentLoaded', fn, false);
   },
   ajaxRequest: function ajaxRequest (method, url, callback) {
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
           console.log('in Ajax function, this is xmlhttp.response', xmlhttp.response);
            callback(xmlhttp.response);
         }
      };
      console.log('ajax function method:', method, ' URL', url, ' callback:', callback);
      xmlhttp.open(method, url, true);
      xmlhttp.send();
   }
};