import Vue from 'vue'

if (window.cvrDebugEvent === undefined) {
    window.cvrDebugEvent = new Vue();
}

let CvrDebugEvent = {
    on (callback) {
        window.cvrDebugEvent.$on('debug', callback);
    },

    emit (text) {
        console.log(text);
        window.cvrDebugEvent.$emit('debug', text);
    }
}

export default CvrDebugEvent;