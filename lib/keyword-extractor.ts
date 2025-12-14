export interface Tag {
    text: string;
    category: 'company' | 'person' | 'country' | 'concept';
}

// Common company suffixes and patterns
const COMPANY_PATTERNS = [
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(Inc|Corp|Ltd|LLC|SA|SpA|AG|GmbH|SL|SRL)\b/g,
    /\b(Apple|Google|Microsoft|Amazon|Meta|Facebook|Tesla|Netflix|Nvidia|Intel|AMD|IBM|Oracle|Salesforce|Adobe|Zoom|Uber|Airbnb|Twitter|X|TikTok|ByteDance|Alibaba|Tencent|Baidu|Samsung|Sony|Nintendo|Huawei|Xiaomi|OpenAI|Anthropic|DeepMind|SpaceX|Stripe|PayPal|Visa|Mastercard|JPMorgan|Goldman|Morgan Stanley|BlackRock|Berkshire|Walmart|Costco|Target|Nike|Adidas|Coca-Cola|Pepsi|McDonald|Starbucks|Disney|Warner|Universal|Paramount|HBO|Spotify|YouTube|Instagram|WhatsApp|LinkedIn|Reddit|Snapchat|Pinterest|Shopify|Square|Coinbase|Binance|FTX|Robinhood|Schwab|Fidelity|Vanguard|Boeing|Airbus|Lockheed|Raytheon|Northrop|General Electric|GE|Siemens|Philips|3M|Caterpillar|Deere|Ford|GM|Toyota|Honda|Volkswagen|BMW|Mercedes|Audi|Porsche|Ferrari|Lamborghini|Pfizer|Moderna|Johnson|AstraZeneca|Novartis|Roche|Merck|Eli Lilly|Bristol Myers|Abbott|Medtronic|Boston Scientific|Stryker|Intuitive Surgical|Illumina|Regeneron|Biogen|Gilead|Amgen|Vertex|CRISPR|Genentech|Sanofi|GSK|Bayer|BASF|Dow|DuPont|Chevron|ExxonMobil|Shell|BP|TotalEnergies|Schlumberger|Halliburton|ConocoPhillips|Marathon|Valero|Phillips 66|Enbridge|Kinder Morgan|NextEra|Duke Energy|Southern|Dominion|Exelon|PG&E|Edison|Sempra|AT&T|Verizon|T-Mobile|Sprint|Comcast|Charter|Dish|Liberty|Vodafone|Orange|Deutsche Telekom|Telefonica|BT|Sky|Discovery|ViacomCBS|Fox|NBC|CBS|ABC|CNN|BBC|Reuters|Bloomberg|Thomson Reuters|Dow Jones|Wall Street Journal|New York Times|Washington Post|Guardian|Financial Times|Economist|Forbes|Fortune|Time|Newsweek|Associated Press|AP|AFP|EFE)\b/gi,
];

// Common countries (Spanish and English)
const COUNTRIES = [
    'Chile', 'Argentina', 'Brasil', 'Brazil', 'Perú', 'Peru', 'Colombia', 'México', 'Mexico',
    'Venezuela', 'Ecuador', 'Bolivia', 'Paraguay', 'Uruguay', 'España', 'Spain',
    'Estados Unidos', 'United States', 'USA', 'EEUU', 'EE.UU.', 'China', 'Japón', 'Japan',
    'Alemania', 'Germany', 'Francia', 'France', 'Italia', 'Italy', 'Reino Unido', 'UK',
    'Rusia', 'Russia', 'India', 'Canadá', 'Canada', 'Australia', 'Corea', 'Korea',
    'Israel', 'Turquía', 'Turkey', 'Egipto', 'Egypt', 'Sudáfrica', 'South Africa',
    'Nigeria', 'Kenia', 'Kenya', 'Marruecos', 'Morocco', 'Arabia Saudita', 'Saudi Arabia',
    'Emiratos', 'Emirates', 'Catar', 'Qatar', 'Irán', 'Iran', 'Irak', 'Iraq',
    'Afganistán', 'Afghanistan', 'Pakistán', 'Pakistan', 'Indonesia', 'Tailandia', 'Thailand',
    'Vietnam', 'Filipinas', 'Philippines', 'Malasia', 'Malaysia', 'Singapur', 'Singapore',
    'Nueva Zelanda', 'New Zealand', 'Suiza', 'Switzerland', 'Suecia', 'Sweden',
    'Noruega', 'Norway', 'Dinamarca', 'Denmark', 'Finlandia', 'Finland', 'Holanda', 'Netherlands',
    'Bélgica', 'Belgium', 'Austria', 'Polonia', 'Poland', 'Ucrania', 'Ukraine',
    'Grecia', 'Greece', 'Portugal', 'Irlanda', 'Ireland'
];

// Topic concepts (Spanish and English)
const CONCEPTS = {
    'Tecnología': ['tecnología', 'technology', 'tech', 'digital', 'software', 'hardware', 'AI', 'IA', 'inteligencia artificial', 'artificial intelligence', 'machine learning', 'blockchain', 'cripto', 'crypto', 'metaverso', 'metaverse', 'cloud', 'nube', 'ciberseguridad', 'cybersecurity', 'datos', 'data', 'algoritmo', 'algorithm', 'robot', 'automatización', 'automation', '5G', 'internet', 'web3', 'NFT', 'realidad virtual', 'VR', 'AR'],
    'Finanzas': ['finanzas', 'finance', 'economía', 'economy', 'mercado', 'market', 'bolsa', 'stock', 'inversión', 'investment', 'banco', 'bank', 'crédito', 'credit', 'deuda', 'debt', 'inflación', 'inflation', 'PIB', 'GDP', 'fiscal', 'monetario', 'monetary', 'divisa', 'currency', 'dólar', 'dollar', 'euro', 'peso', 'trading', 'bursátil', 'financiero', 'financial'],
    'Política': ['política', 'politics', 'gobierno', 'government', 'elección', 'election', 'presidente', 'president', 'congreso', 'congress', 'senado', 'senate', 'diputado', 'legislación', 'legislation', 'ley', 'law', 'reforma', 'reform', 'partido', 'party', 'democracia', 'democracy', 'votación', 'vote', 'campaña', 'campaign'],
    'Negocios': ['negocio', 'business', 'empresa', 'company', 'corporación', 'corporation', 'startup', 'emprendimiento', 'entrepreneurship', 'CEO', 'director', 'ejecutivo', 'executive', 'fusión', 'merger', 'adquisición', 'acquisition', 'IPO', 'salida a bolsa', 'venture capital', 'capital de riesgo', 'inversores', 'investors'],
    'Energía': ['energía', 'energy', 'petróleo', 'oil', 'gas', 'renovable', 'renewable', 'solar', 'eólica', 'wind', 'nuclear', 'carbón', 'coal', 'electricidad', 'electricity', 'batería', 'battery', 'litio', 'lithium', 'hidrógeno', 'hydrogen'],
    'Salud': ['salud', 'health', 'medicina', 'medicine', 'hospital', 'médico', 'doctor', 'enfermedad', 'disease', 'vacuna', 'vaccine', 'tratamiento', 'treatment', 'farmacéutica', 'pharmaceutical', 'pandemia', 'pandemic', 'virus', 'bacteria', 'terapia', 'therapy'],
    'Educación': ['educación', 'education', 'universidad', 'university', 'escuela', 'school', 'estudiante', 'student', 'profesor', 'teacher', 'aprendizaje', 'learning', 'investigación', 'research', 'ciencia', 'science'],
    'Medio Ambiente': ['medio ambiente', 'environment', 'clima', 'climate', 'cambio climático', 'climate change', 'sostenibilidad', 'sustainability', 'contaminación', 'pollution', 'reciclaje', 'recycling', 'biodiversidad', 'biodiversity', 'deforestación', 'deforestation', 'emisiones', 'emissions', 'carbono', 'carbon']
};

export function extractKeywords(title: string, content?: string): Tag[] {
    const text = `${title} ${content || ''}`;
    const tags: Tag[] = [];
    const seen = new Set<string>();

    // Extract companies
    COMPANY_PATTERNS.forEach(pattern => {
        const matches = text.matchAll(pattern);
        for (const match of matches) {
            const company = match[0].trim();
            if (!seen.has(company.toLowerCase())) {
                tags.push({ text: company, category: 'company' });
                seen.add(company.toLowerCase());
            }
        }
    });

    // Extract countries
    COUNTRIES.forEach(country => {
        const regex = new RegExp(`\\b${country}\\b`, 'gi');
        if (regex.test(text) && !seen.has(country.toLowerCase())) {
            tags.push({ text: country, category: 'country' });
            seen.add(country.toLowerCase());
        }
    });

    // Extract concepts
    Object.entries(CONCEPTS).forEach(([concept, keywords]) => {
        const found = keywords.some(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            return regex.test(text);
        });
        if (found && !seen.has(concept.toLowerCase())) {
            tags.push({ text: concept, category: 'concept' });
            seen.add(concept.toLowerCase());
        }
    });

    // Extract potential person names (capitalized words, 2-3 words max)
    const personPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\b/g;
    const personMatches = text.matchAll(personPattern);
    for (const match of personMatches) {
        const name = match[0].trim();
        // Filter out common false positives
        if (name.length > 5 && !COUNTRIES.includes(name) && !seen.has(name.toLowerCase())) {
            // Limit person tags to avoid noise
            if (tags.filter(t => t.category === 'person').length < 3) {
                tags.push({ text: name, category: 'person' });
                seen.add(name.toLowerCase());
            }
        }
    }

    // Limit total tags
    return tags.slice(0, 10);
}
