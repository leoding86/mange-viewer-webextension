/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 53);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return Matcher; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"c\", function() { return TabStack; });\n/* unused harmony export UrlBuilder */\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"b\", function() { return _r; });\n/* unused harmony export _ua */\nvar _r = {\n    readcomics: /^https?:\\/{2}w{3}\\.readcomics\\.tv\\/[^\\/]+\\/chapter-[\\d]+/i,\n    readcomiconline: /^https?:\\/{2}readcomiconline\\.to\\/Comic\\/[^\\/]+\\/[^\\/]+\\?id=[\\d]+/i,\n    dm5: /^https?:\\/{2}w{3}\\.dm5\\.com\\/m([\\d]+)(?:-p[\\d]+)?\\/?/i,\n    mangapanda: /^(https?:\\/{2}(?:w{3}\\.)?mangapanda\\.com\\/[^\\/]+\\/\\d+)(?:\\/\\d+)?/i,\n    mangastream: /^(https?:\\/{2}(?:w{3}?\\.)?mangastream\\.com\\/r\\/[^\\/]+\\/\\d+\\/\\d+)(?:\\/\\d+)?\\/?/i,\n    eatmanga: /^https?:\\/{2}(?:w{3}\\.)?eatmanga\\.com\\/Manga-Scan\\/([^\\/]+)\\/([^\\/]+)/i,\n    kissmanga: /^https?:\\/{2}kissmanga\\.com\\/Manga\\/[^\\/]+\\/[^\\/]+\\?id=\\d+/i\n};\n\nvar _ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.19 Safari/537.36';\n\nfunction Matcher(url) {\n    this.rule = null;\n    this.setUrl(url);\n}\n\nMatcher.prototype.setUrl = function (url) {\n    this.url = url;\n};\n\nMatcher.prototype.rules = {\n    'readcomics': {\n        pattern: _r.readcomics,\n        site: 'readcomics.tv',\n        logo: 'http://www.readcomics.tv/images/site/front/logo4.png'\n    },\n    'readcomiconline': {\n        pattern: _r.readcomiconline,\n        site: 'readcomiconline.to',\n        logo: 'http://readcomiconline.to/Content/images/logo.png'\n    },\n    'dm5': {\n        pattern: _r.dm5,\n        site: 'dm5.com',\n        logo: 'http://js16.tel.cdndm.com/v201703101145/default/images/newImages/index_main_logo.png'\n    },\n    'mangapanda': {\n        pattern: _r.mangapanda,\n        site: 'www.mangapanda.com',\n        logo: 'http://s5.mangapanda.com/sup/images/dark.813ab89088.png'\n    },\n    'mangastream': {\n        pattern: _r.mangastream,\n        site: 'mangastream.com',\n        logo: 'http://mangastream.com/assets/img/logo.png'\n    },\n    'eatmanga': {\n        pattern: _r.eatmanga,\n        site: 'eatmanga.com',\n        logo: 'http://cdn.eatmanga.com/media/logo.png'\n    },\n    'kissmanga': {\n        pattern: _r.kissmanga,\n        site: 'kissmanga.com',\n        logo: 'http://kissmanga.com/Content/images/logo.png'\n    }\n};\n\nMatcher.prototype.site = function (name) {\n    return this.rules[name];\n};\n\nMatcher.prototype.is = function () {\n    for (var name in this.rules) {\n        if (this.rules[name].pattern.test(this.url)) {\n            this.rule = this.rules[name];\n            return name;\n        }\n    }\n    return null;\n};\n\nMatcher.prototype.origin = function () {\n    return '*://*.' + this.rule.site + '/*';\n};\n\nfunction TabStack() {\n    this.stack = {};\n}\n\nTabStack.prototype.add = function (tabId, obj) {\n    this.stack['tab' + tabId] = obj;\n};\n\nTabStack.prototype.get = function (tabId) {\n    if (this.stack['tab' + tabId]) return this.stack['tab' + tabId];else return null;\n};\n\nTabStack.prototype.set = function (tabId, name, value) {\n    if (this.stack['tab' + tabId]) {\n        this.stack['tab' + tabId][name] = value;\n    }\n};\n\nTabStack.prototype.delete = function (tabId) {\n    if (this.get(tabId)) delete this.stack['tab' + tabId];\n};\n\nfunction UrlBuilder(baseUrl) {\n    this.baseUrl = baseUrl;\n    this.url = baseUrl;\n}\n\nUrlBuilder.prototype.setParams = function (params) {\n    var paramArr = [];\n    for (var name in params) {\n        paramArr.push(name + \"=\" + encodeURIComponent(params[name]));\n    }\n    this.url = this.baseUrl + (this.baseUrl.indexOf('?') > -1 ? '&' : '?') + paramArr.join('&');\n};\n\nUrlBuilder.prototype.getParams = function () {\n    var paramStr = this.url.substr(this.url.indexOf('?') + 1);\n\n    if (paramStr.indexOf('#') > -1) {\n        paramStr = paramStr.substr(0, paramStr.indexOf('#'));\n    }\n\n    var paramArr = paramStr.split('&');\n    var result = {};\n\n    paramArr.forEach(function (obj) {\n        var tmp = obj.split('=');\n        if (tmp.length == 2) {\n            result[tmp[0]] = decodeURIComponent(tmp[1]);\n        }\n    });\n\n    return result;\n};\n\nUrlBuilder.prototype.toString = function () {\n    return this.url;\n};\n\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/modules/common.js\n// module id = 0\n// module chunks = 0 1 2 3\n\n//# sourceURL=webpack:///./src/modules/common.js?");

/***/ }),

/***/ 53:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("Object.defineProperty(__webpack_exports__, \"__esModule\", { value: true });\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_common__ = __webpack_require__(0);\n\n\nvar matcher = new __WEBPACK_IMPORTED_MODULE_0__modules_common__[\"a\" /* Matcher */]();\nvar tabStack = new __WEBPACK_IMPORTED_MODULE_0__modules_common__[\"c\" /* TabStack */]();\n\nchrome.webRequest.onCompleted.addListener(function (details) {\n    matcher.setUrl(details.url);\n    if (name = matcher.is()) {\n        if (details.tabId > 1) {\n            /* Change icon to active one */\n            setTimeout(function () {\n                chrome.browserAction.setIcon({\n                    path: {\n                        '38': '../assets/icon.png'\n                    },\n                    tabId: details.tabId\n                }, function () {\n                    console.log('icon has been setted');\n                });\n            }, 100);\n            tabStack.add(details.tabId, {\n                parser: name,\n                site: matcher.site(name).site,\n                url: details.url,\n                logo: matcher.site(name).logo\n            });\n\n            chrome.tabs.executeScript(details.tabId, { file: './build/bundle.app_cvr.js' });\n        }\n    }\n}, { urls: [\"<all_urls>\"], types: [\"main_frame\"] });\n\nchrome.tabs.onRemoved.addListener(function (tabId) {\n    tabStack.delete(tabId);\n});\n\nchrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {\n    if (request.from === 'popup' && request.data.op === 'needData') {\n        var responseData = tabStack.get(request.data.tabId);\n        if (responseData !== null) {\n            sendResponse({ data: responseData });\n        }\n    }\n});\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/background.js\n// module id = 53\n// module chunks = 3\n\n//# sourceURL=webpack:///./src/background.js?");

/***/ })

/******/ });