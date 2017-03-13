chrome.runtime.sendMessage({
    from: 'frontpage',
    data: {
        op: 'setComicTitle',
        title: document.querySelector('.chapter-title h1').innerText
    }
});