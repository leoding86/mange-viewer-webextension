const _r = {
    readcomics: /^https?:\/{2}w{3}\.readcomics\.tv\/[^\/]+\/chapter-[\d]+/i,
    readcomiconline: /^https?:\/{2}readcomiconline\.to\/Comic\/[^\/]+\/[^\/]+\?id=[\d]+/i,
    dm5: /^https?:\/{2}w{3}\.dm5\.com\/m([\d]+)(?:-p[\d]+)?\/?/i,
    mangapanda: /^(https?:\/{2}(?:w{3}\.)?mangapanda\.com\/[^\/]+\/\d+)(?:\/\d+)?/i,
    mangastream: /^(https?:\/{2}(?:w{3}?\.)?mangastream\.com\/r\/[^\/]+\/\d+\/\d+)(?:\/\d+)?\/?/i,
    eatmanga: /^https?:\/{2}(?:w{3}\.)?eatmanga\.com\/Manga-Scan\/([^\/]+)\/([^\/]+)/i,
    kissmanga: /^https?:\/{2}kissmanga\.com\/Manga\/[^\/]+\/[^\/]+\?id=\d+/i
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
    'mangapanda': {
        pattern: _r.mangapanda,
        site: 'www.mangapanda.com',
        logo: 'http://s5.mangapanda.com/sup/images/dark.813ab89088.png'
    },
    'mangastream': {
        pattern: _r.mangastream,
        site: 'mangastream.com',
        logo: 'http://mangastream.com/assets/img/logo.png'
    },
    'eatmanga': {
        pattern: _r.eatmanga,
        site: 'eatmanga.com',
        logo: 'http://cdn.eatmanga.com/media/logo.png'
    },
    'kissmanga': {
        pattern: _r.kissmanga,
        site: 'kissmanga.com',
        logo: 'http://kissmanga.com/Content/images/logo.png'
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
    script += 'var string = null;';
    script += 'if (typeof ' + obj + ' == "string") string = ' + obj + ';';
    script += 'else if (typeof ' + obj + ' == "object") string = JSON.stringify(' + obj + ');';
    script += 'document.querySelector("#idom-' + this.randStr + '").setAttribute("data", string);';
    script += '})()';

    let iScript = this.iScript();
    iScript[(iScript.innerText ? 'innerText' : 'textContent')] = script;
    document.documentElement.appendChild(iScript);
    var domData = iDom.getAttribute('data');

    this.clearup();

    if (type === 'string')
        return domData;
    else if (type === 'object' || type === 'json')
        return JSON.parse(domData);
    else
        return null;
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