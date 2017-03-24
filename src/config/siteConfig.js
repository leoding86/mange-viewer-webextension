const siteConfig = {
    readcomics_tv: {
        pattern: /^https?:\/{2}w{3}\.readcomics\.tv\/[^\/]+\/chapter-[\d]+/i,
        site: 'readcomics.tv',
        logo: 'http://www.readcomics.tv/images/site/front/logo4.png',
        origins: []
    },

    readcomiconline_to: {
        pattern: /^https?:\/{2}readcomiconline\.to\/Comic\/[^\/]+\/[^\/]+\?id=[\d]+/i,
        site: 'readcomiconline.to',
        logo: 'http://readcomiconline.to/Content/images/logo.png',
        origins: []
    },

    dm5_com: {
        pattern: /^https?:\/{2}w{3}\.dm5\.com\/m([\d]+)(?:-p[\d]+)?\/?/i,
        site: 'dm5.com',
        logo: 'http://js16.tel.cdndm.com/v201703101145/default/images/newImages/index_main_logo.png',
        origins: []
    },

    mangapanda_com: {
        pattern: /^(https?:\/{2}(?:w{3}\.)?mangapanda\.com\/[^\/]+\/\d+)(?:\/\d+)?/i,
        site: 'www.mangapanda.com',
        logo: 'http://s5.mangapanda.com/sup/images/dark.813ab89088.png',
        origins: []
    },

    mangastream_com: {
        pattern: /^(https?:\/{2}(?:w{3}?\.)?mangastream\.com\/r\/[^\/]+\/\d+\/\d+)(?:\/\d+)?\/?/i,
        site: 'mangastream.com',
        logo: 'http://mangastream.com/assets/img/logo.png',
        origins: []
    },

    eatmanga_com: {
        pattern: /^https?:\/{2}(?:w{3}\.)?eatmanga\.com\/Manga-Scan\/([^\/]+)\/([^\/]+)/i,
        site: 'eatmanga.com',
        logo: 'http://cdn.eatmanga.com/media/logo.png',
        origins: []
    },

    kissmanga_com: {
        pattern: /^https?:\/{2}kissmanga\.com\/Manga\/[^\/]+\/[^\/]+\?id=\d+/i,
        site: 'kissmanga.com',
        logo: 'http://kissmanga.com/Content/images/logo.png',
        origins: []
    }
}

export default siteConfig;