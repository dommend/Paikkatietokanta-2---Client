/*!
* copy from is.js : https://is.js.org/
* Author: Aras Atasaygin
*/
var navigator = window && window.navigator;
var userAgent = (navigator && navigator.userAgent || '').toLowerCase();
var vendor = (navigator && navigator.vendor || '').toLowerCase();
var comparator = {
  '<': function(a, b) { return a < b; },
  '<=': function(a, b) { return a <= b; },
  '>': function(a, b) { return a > b; },
  '>=': function(a, b) { return a >= b; }
};
function compareVersion(version, range) {
  var string = (range + '');
  var n = +(string.match(/\d+/) || NaN);
  var op = string.match(/^[<>]=?|/)[0];
  return comparator[op] ? comparator[op](version, n) : (version == n || n !== n);
}
function opera(range) {
  var match = userAgent.match(/(?:^opera.+?version|opr)\/(\d+)/);
  return match !== null && compareVersion(match[1], range);
};
function chrome(range) {
  var match = /google inc/.test(vendor) ? userAgent.match(/(?:chrome|crios)\/(\d+)/) : null;
  return match !== null && !opera() && compareVersion(match[1], range);
};
function edge(range) {
  var match = userAgent.match(/edge\/(\d+)/);
  return match !== null && compareVersion(match[1], range);
};
function firefox(range) {
  var match = userAgent.match(/(?:firefox|fxios)\/(\d+)/);
  return match !== null && compareVersion(match[1], range);
};
function ie(range) {
  var match = userAgent.match(/(?:msie |trident.+?; rv:)(\d+)/);
  return match !== null && compareVersion(match[1], range);
};
function safari(range) {
  var match = userAgent.match(/version\/(\d+).+?safari/);
  return match !== null && compareVersion(match[1], range);
};

// redirect to un-support page if browser is not in our support range
if (chrome('<=49')) {
  document.location = './notsupported.html';
} else if (firefox('<=46')) {
  document.location = './notsupported.html';
} else if (safari('<=10')) {
  document.location = './notsupported.html';
} else if (ie('<=11')) {
  document.location = './notsupported.html';
} else if (edge('<=14')) {
  document.location = './notsupported.html';
} else {
}


