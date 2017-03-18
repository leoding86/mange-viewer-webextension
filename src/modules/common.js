const _r = {
    readcomics: /^https?:\/{2}w{3}\.readcomics\.tv\/[^\/]+\/chapter-[\d]+/i,
    readcomiconline: /^https?:\/{2}readcomiconline\.to\/Comic\/[^\/]+\/[^\/]+\?id=[\d]+/i,
    dm5: /^https?:\/{2}w{3}\.dm5\.com\/m([\d]+)(?:-p[\d]+)?\/?/i,
    hentai2read: /^https?:\/{2}hentai2read\.com\/[^\/]+\/\d+(?:\/\d+)?\/?/i,
    mangapanda: /^(https?:\/{2}(?:w{3}\.)?mangapanda\.com\/[^\/]+\/\d+)(?:\/\d+)?/i,
    mangastream: /^(https?:\/{2}(?:w{3}?\.)?mangastream\.com\/r\/[^\/]+\/\d+\/\d+)(?:\/\d+)?\/?/i
}

const _ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.19 Safari/537.36';

function Matcher(url) {
    this.rule = null;
    this.setUrl(url);
}

Matcher.prototype.setUrl = function (url) {
    this.url = url;
}

Matcher.prototype.rules = {
    'readcomics': {
       pattern: _r.readcomics,
       site: 'readcomics.tv',
       logo: 'http://www.readcomics.tv/images/site/front/logo4.png'
    },
    'readcomiconline': {
        pattern: _r.readcomiconline,
        site: 'readcomiconline.to',
        logo: 'http://readcomiconline.to/Content/images/logo.png'
    },
    'dm5': {
        pattern: _r.dm5,
        site: 'dm5.com',
        logo: 'http://js16.tel.cdndm.com/v201703101145/default/images/newImages/index_main_logo.png'
    },
    'hentai2read': {
        pattern: _r.hentai2read,
        site: 'hentai2read.com',
        logo: 'https://hentaicdn.com/cdn/v2/assets/img/favicons/favicon-192x192.png'
    },
    'mangapanda': {
        pattern: _r.mangapanda,
        site: 'http://www.mangapanda.com',
        logo: 'http://s5.mangapanda.com/sup/images/dark.813ab89088.png'
    },
    'mangastream': {
        pattern: _r.mangastream,
        site: 'mangastream.com',
        logo: 'http://mangastream.com/assets/img/logo.png'
    }
};

Matcher.prototype.site = function (name) {
    return this.rules[name];
};

Matcher.prototype.is = function () {
    for (var name in this.rules) {
        if (this.rules[name].pattern.test(this.url)) {
            this.rule = this.rules[name];
            return name;
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

export { Matcher, TabStack, UrlBuilder, _r, _ua }