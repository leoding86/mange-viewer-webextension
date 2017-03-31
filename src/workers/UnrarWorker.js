onmessage = (event) => {
    require(['../libs/unrar.min.js'], (UnRar) => {
        let fr = new FileReader();

        fr.onloadend = (event) => {
            let unrar = new UnRar(event.target.result);
            let entries = unrar.getEntries();
            let counter = 0;

            entries.forEach((entry) => {
                if (/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(entry.name)) {
                    counter++;
                }
            });

            postMessage({count: counter})

            entries.forEach((entry) => {
                if (/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(entry.name)) {
                    let data = unrar.decompress(entry.name);
                    postMessage({content: data});
                }
            });
        };

        fr.readAsArrayBuffer(event.data.file);
    });
}