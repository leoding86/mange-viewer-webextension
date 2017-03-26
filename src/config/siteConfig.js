const siteConfig = {
    readcomics_tv: {
        parser: 'readcomics_tv',
        pattern: /^https?:\/{2}w{3}\.readcomics\.tv\/[^\/]+\/chapter-[\d]+/i,
        site: 'readcomics.tv',
        logo: 'http://www.readcomics.tv/images/site/front/logo4.png',
        origins: []
    },

    readcomiconline_to: {
        parser: 'readcomiconline_to',
        pattern: /^https?:\/{2}readcomiconline\.to\/Comic\/[^\/]+\/[^\/]+\?id=[\d]+/i,
        site: 'readcomiconline.to',
        logo: 'http://readcomiconline.to/Content/images/logo.png',
        origins: []
    },

    dm5_com: {
        parser: 'dm5_com',
        pattern: /^https?:\/{2}w{3}\.dm5\.com\/m([\d]+)(?:-p[\d]+)?\/?/i,
        site: 'dm5.com',
        logo: 'http://js16.tel.cdndm.com/v201703101145/default/images/newImages/index_main_logo.png',
        origins: []
    },

    mangapanda_com: {
        parser: 'mangapanda_com',
        pattern: /^(https?:\/{2}(?:w{3}\.)?mangapanda\.com\/[^\/]+\/\d+)(?:\/\d+)?/i,
        site: 'www.mangapanda.com',
        logo: 'http://s5.mangapanda.com/sup/images/dark.813ab89088.png',
        origins: []
    },

    /* diff domain readms.com */
    mangastream_com: {
        parser: 'mangastream_com',
        pattern: /^(https?:\/{2}(?:w{3}?\.)?(?:mangastream\.com|readms\.com)\/r\/[^\/]+\/[^\/]+\/\d+)(?:\/\d+)?\/?/i,
        site: 'mangastream.com',
        logo: 'http://mangastream.com/assets/img/logo.png',
        origins: []
    },

    eatmanga_com: {
        parser: 'eatmanga_com',
        pattern: /^https?:\/{2}(?:w{3}\.)?eatmanga\.com\/Manga-Scan\/([^\/]+)\/([^\/]+)/i,
        site: 'eatmanga.com',
        logo: 'http://cdn.eatmanga.com/media/logo.png',
        origins: []
    },

    kissmanga_com: {
        parser: 'kissmanga_com',
        pattern: /^https?:\/{2}kissmanga\.com\/Manga\/[^\/]+\/[^\/]+\?id=\d+/i,
        site: 'kissmanga.com',
        logo: 'http://kissmanga.com/Content/images/logo.png',
        origins: []
    },

    mangadoom_co: {
        parser: 'mangadoom_co',
        pattern: /^https?:\/{2}mangadoom\.co\/[^\/]+\/\d+/i,
        site: 'mangadoom.do',
        logo: 'http://mangadoom.co/assets/img/lgo.png',
        origins: []
    }
}

export default siteConfig;