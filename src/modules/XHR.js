let XHR = () => {
    try {
        return XPCNativeWrapper(new window.wrappedJSObject.XMLHttpRequest());
    } catch (e) {
        return new XMLHttpRequest();
    }
}

export default XHR;