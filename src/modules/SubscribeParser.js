class SubscribeParser {
    
    constructor () {
        this.parserInstances = {};
        this.subParserInstances = {};
    }

    getParser (parserName) {
        return new Promise((resolve, reject) => {
            if (this.subParserInstances[parserName]) {
                resolve(this.subParserInstances[parserName]);
            }

            let parser = require('subscribe_parsers/' + parserName);
            (new parser.default()).then((instance) => {
                this.subParserInstances[parserName] = instance;
                resolve(instance);
            });
        });
    }
}

export default SubscribeParser;
