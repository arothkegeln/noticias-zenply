import { NewsSource } from "@/types";

export interface CatalogItem extends Omit<NewsSource, 'id'> {
    id: string; // pre-defined ID for catalog
    language: 'es' | 'en';
    category: 'General' | 'Business' | 'Tech' | 'Sports' | 'Politics';
    description: string;
}

export const MEDIA_CATALOG: CatalogItem[] = [
    // --- ESPAÑOL ---
    {
        id: 'elpais-es',
        name: 'El País',
        url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada',
        type: 'rss',
        language: 'es',
        category: 'General',
        description: 'Noticias globales desde una perspectiva española e internacional.'
    },
    {
        id: 'bbc-mundo',
        name: 'BBC Mundo',
        url: 'https://feeds.bbci.co.uk/mundo/rss.xml',
        type: 'rss',
        language: 'es',
        category: 'General',
        description: 'Noticias internacionales y análisis de la BBC en español.'
    },
    {
        id: 'df-cl',
        name: 'Diario Financiero',
        url: 'https://www.df.cl/',
        type: 'web',
        selector: 'h2 a',
        language: 'es',
        category: 'Business',
        description: 'Líder en noticias financieras y de negocios en Chile.'
    },
    {
        id: 'df-cl-latest',
        name: 'DF - Últimas Noticias',
        url: 'https://www.df.cl/ultimasnoticias',
        type: 'web',
        selector: 'h2 a',
        language: 'es',
        category: 'Business',
        description: 'Sección de últimas noticias minuto a minuto de Diario Financiero.'
    },
    {
        id: 'emol',
        name: 'Emol',
        url: 'https://www.emol.com/rss/rss.asp',
        type: 'rss',
        language: 'es',
        category: 'General',
        description: 'El Mercurio Online. Noticias de actualidad en Chile.'
    },
    {
        id: 'xataka',
        name: 'Xataka',
        url: 'https://feeds.weblogssl.com/xataka2',
        type: 'rss',
        language: 'es',
        category: 'Tech',
        description: 'Publicación líder en tecnología y gadgets en español.'
    },
    {
        id: 'latercera',
        name: 'La Tercera',
        url: 'https://www.latercera.com/feed/',
        type: 'rss',
        language: 'es',
        category: 'General',
        description: 'Noticias nacionales e internacionales de Chile.'
    },
    {
        id: 'biobio',
        name: 'BioBioChile',
        url: 'https://www.biobiochile.cl/feed/',
        type: 'rss',
        language: 'es',
        category: 'General',
        description: 'Noticias de actualidad nacional de Chile.'
    },
    {
        id: 'meganoticias',
        name: 'Meganoticias',
        url: 'https://www.meganoticias.cl/',
        type: 'web',
        selector: 'h2 a',
        language: 'es',
        category: 'General',
        description: 'Noticias de Mega Chile.'
    },
    {
        id: 'cooperativa',
        name: 'Cooperativa',
        url: 'https://www.cooperativa.cl/',
        type: 'web',
        selector: 'h2 a',
        language: 'es',
        category: 'General',
        description: 'Noticias y actualidad minuto a minuto de Radio Cooperativa.'
    },
    {
        id: 'elmostrador',
        name: 'El Mostrador',
        url: 'https://www.elmostrador.cl/',
        type: 'web',
        selector: 'h2 a',
        language: 'es',
        category: 'Politics',
        description: 'Diario digital de análisis y opinión independiente.'
    },
    {
        id: 'publimetro',
        name: 'Publimetro',
        url: 'https://www.publimetro.cl/',
        type: 'web',
        selector: 'h2 a',
        language: 'es',
        category: 'General',
        description: 'Noticias de Chile y el mundo, estilo directo.'
    },
    {
        id: 'theclinic',
        name: 'The Clinic',
        url: 'https://www.theclinic.cl/feed/',
        type: 'rss',
        language: 'es',
        category: 'Politics',
        description: 'Sátira, humor, política y cultura pop chilena.'
    },
    {
        id: 'eldinamo',
        name: 'El Dínamo',
        url: 'https://www.eldinamo.cl/',
        type: 'web',
        selector: 'h2 a',
        language: 'es',
        category: 'Politics',
        description: 'Análisis político, actualidad y datos.'
    },
    {
        id: 'adnradio',
        name: 'ADN Radio',
        url: 'https://www.adnradio.cl/',
        type: 'web',
        selector: 'h2 a',
        language: 'es',
        category: 'General',
        description: 'Actualidad, deportes y noticias de Radio ADN.'
    },

    // --- ENGLISH ---
    {
        id: 'nyt',
        name: 'The New York Times',
        url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
        type: 'rss',
        language: 'en',
        category: 'General',
        description: 'Breaking news, multimedia, reviews & opinion.'
    },
    {
        id: 'wsj',
        name: 'Wall Street Journal',
        url: 'https://feeds.a.dj.com/rss/RSSWorldNews.xml', // Often requires sub for full content, but headers ok
        type: 'rss',
        language: 'en',
        category: 'Business',
        description: 'Definitive source of global business and financial news.'
    },
    {
        id: 'techcrunch',
        name: 'TechCrunch',
        url: 'https://techcrunch.com/feed/',
        type: 'rss',
        language: 'en',
        category: 'Tech',
        description: 'Startup and technology news.'
    },
    {
        id: 'theverge',
        name: 'The Verge',
        url: 'https://www.theverge.com/rss/index.xml',
        type: 'rss',
        language: 'en',
        category: 'Tech',
        description: 'Covers the intersection of technology, science, art, and culture.'
    },
    {
        id: 'cnn-top',
        name: 'CNN Top Stories',
        url: 'http://rss.cnn.com/rss/edition.rss',
        type: 'rss',
        language: 'en',
        category: 'General',
        description: 'Breaking news and top stories from CNN.'
    }
];
