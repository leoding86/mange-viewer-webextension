import { Matcher } from './modules/common';

let matcher = new Matcher();
matcher.setUrl(window.location.href);
let parser = matcher.is();

if (parser) {
    window._cvrContainer = {};
    window._cvrContainer.parser = parser;

    require('./app');
}
