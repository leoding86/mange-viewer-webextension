const _r = {
    readcomics: /^https?:\/{2}w{3}\.readcomics\.tv\/[^\/]+\/chapter-[\d]+/i,
    readcomiconline: /^https?:\/{2}readcomiconline\.to\/Comic\/[^\/]+\/Issue-[\d]+\?id=[\d]+/
}

function Matcher(url) {
    this.setUrl(url);
}

Matcher.prototype.setUrl = function (url) {
    this.url = url;
}

Matcher.prototype.rules = {
    'readcomics': {
       pattern: _r.readcomics,
       site: 'readcomics.tv'
    },
    'readcomiconline': {
        pattern: _r.readcomiconline,
        site: 'readcomiconline.to'
    }
};

Matcher.prototype.site = function (name) {
    return this.rules[name].site;
};

Matcher.prototype.is = function () {
    for (var name in this.rules) {
        if (this.rules[name].pattern.test(this.url)) {
            return name;
        }
    }
    return null;
}

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
        return { };
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

export { Matcher, TabStack, UrlBuilder, _r }