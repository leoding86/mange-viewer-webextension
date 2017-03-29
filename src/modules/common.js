import siteConfig from '../config/siteConfig';

const _r = siteConfig;

const _ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.19 Safari/537.36';

function Matcher(url) {
    this.rule = null;
    this.setUrl(url);
}

Matcher.prototype.setUrl = function (url) {
    this.url = url;
}

Matcher.prototype.rules = _r;

Matcher.prototype.site = function (name) {
    return this.rules[name];
};

Matcher.prototype.is = function () {
    for (var name in this.rules) {
        if (this.rules[name].pattern.test(this.url)) {
            this.rule = this.rules[name];
            return this.rules[name].parser;
        }
    }
    return null;
};

Matcher.prototype.origin = function () {
    return '*://*.' + this.rule.site + '/*';
};

function TabStack () {
    this.stack = { };
}

TabStack.prototype.add = function (tabId, obj) {
    this.stack['tab' + tabId] = obj;
}

TabStack.prototype.get = function (tabId) {
    if (this.stack['tab' + tabId])
        return this.stack['tab' + tabId];
    else
        return null;
}

TabStack.prototype.set = function (tabId, name, value) {
    if (this.stack['tab' + tabId]) {
        this.stack['tab' + tabId][name] = value;
    }
}

TabStack.prototype.delete = function (tabId) {
    if (this.get(tabId))
        delete this.stack['tab' + tabId];
}

function UrlBuilder(baseUrl) {
    this.baseUrl = baseUrl;
    this.url = baseUrl;
}

UrlBuilder.prototype.setParams = function (params) {
    let paramArr = [];
    for (var name in params) {
        paramArr.push(name + "=" + encodeURIComponent(params[name]));
    }
    this.url = this.baseUrl + (this.baseUrl.indexOf('?') > -1 ? '&' : '?') + paramArr.join('&');
}

UrlBuilder.prototype.getParams = function () {
    let paramStr = this.url.substr(this.url.indexOf('?') + 1);

    if (paramStr.indexOf('#') > -1) {
        paramStr = paramStr.substr(0, paramStr.indexOf('#'));
    }

    let paramArr = paramStr.split('&');
    let result = {};

    paramArr.forEach((obj) => {
        let tmp = obj.split('=');
        if (tmp.length == 2) {
            result[tmp[0]] = decodeURIComponent(tmp[1]);
        }
    });

    return result;
}

UrlBuilder.prototype.toString = function () {
    return this.url;
}

function Magic() {
    this.randStr = randStr(16);
}

Magic.prototype.iDom = function(remove) {
    if (!remove) {
        let iDom = document.createElement('div');
        iDom.style.display = 'none';
        iDom.setAttribute('id', 'idom-' + this.randStr);
        return iDom;
    } else {
        document.querySelector('#idom-' + this.randStr).remove();
    }
}

Magic.prototype.iScript = function(remove) {
    if (!remove) {
        let iScript = document.createElement('script');
        iScript.style.display = 'none';
        iScript.setAttribute('id', 'ijs-' + this.randStr);
        return iScript;
    } else {
        document.querySelector('#ijs-' + this.randStr).remove();
    }
}

Magic.prototype.getVar = function(obj, type) {
    let iDom = this.iDom();

    document.documentElement.appendChild(iDom);
    var script = '(function(){';
    script += 'var __string = null;';
    script += 'var __objType = typeof ' + obj + ';';
    script += 'if (__objType == "string" || __objType == "number") { __string = ' + obj + '; }';
    script += 'else if (typeof ' + obj + ' == "object") { __string = JSON.stringify(' + obj + '); }';
    // script += 'console.log(typeof ' + obj +');';
    script += 'document.querySelector("#idom-' + this.randStr + '").setAttribute("data", __string);';
    script += '})()';

    let iScript = this.iScript();
    iScript[(iScript.innerText ? 'innerText' : 'textContent')] = script;
    document.documentElement.appendChild(iScript);
    var domData = iDom.getAttribute('data');

    this.clearup();

    if (type === 'string') {
        return domData;
    } else if (type === 'object' || type === 'json') {
        return JSON.parse(domData);
    } else {
        return null;
    }
}

Magic.prototype.getResult = function(callable, params) {

}

Magic.prototype.clearup = function() {
    this.iDom(true);
    this.iScript(true);
}

const randStr = function(len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i = 0; i < len; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

export { Matcher, TabStack, UrlBuilder, _r, _ua, randStr, Magic }