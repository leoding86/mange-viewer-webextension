import { Matcher } from './modules/common';

let matcher = new Matcher();
matcher.setUrl(window.location.href);

let parser = null;
if (parser = matcher.is()) {
    window._cvrContainer = {};
    window._cvrContainer.parser = parser;

    require('./app');
} else if (parser = matcher.isMH()) {
    window._cvrContainer = {};
    window._cvrContainer.parser = parser;

    require('./subscribeDetector');
}
