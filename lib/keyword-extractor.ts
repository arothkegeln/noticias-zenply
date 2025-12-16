export interface Tag {
    text: string;
    category: 'company' | 'person' | 'country' | 'concept';
}

// Common company suffixes and patterns
const COMPANY_PATTERNS = [
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(Inc|Corp|Ltd|LLC|SA|SpA|AG|GmbH|SL|SRL)\b/g,
    /\b(Apple|Google|Microsoft|Amazon|Meta|Facebook|Tesla|Nvidia|Intel|AMD|IBM|Oracle|Salesforce|Adobe|Zoom|Uber|Airbnb|Twitter|X|TikTok|ByteDance|Alibaba|Tencent|Baidu|Samsung|Sony|Nintendo|Huawei|Xiaomi|OpenAI|Anthropic|DeepMind|SpaceX|Stripe|PayPal|Visa|Mastercard|JPMorgan|Goldman|Morgan Stanley|BlackRock|Berkshire|Walmart|Costco|Target|Nike|Adidas|Coca-Cola|Pepsi|McDonald|Starbucks|Disney|Warner|Universal|Paramount|HBO|Spotify|YouTube|Instagram|WhatsApp|LinkedIn|Reddit|Snapchat|Pinterest|Shopify|Square|Coinbase|Binance|FTX|Robinhood|Schwab|Fidelity|Vanguard|Boeing|Airbus|Lockheed|Raytheon|Northrop|General Electric|GE|Siemens|Philips|3M|Caterpillar|Deere|Ford|GM|Toyota|Honda|Volkswagen|BMW|Mercedes|Audi|Porsche|Ferrari|Lamborghini|Pfizer|Moderna|Johnson|AstraZeneca|Novartis|Roche|Merck|Eli Lilly|Bristol Myers|Abbott|Medtronic|Boston Scientific|Stryker|Intuitive Surgical|Illumina|Regeneron|Biogen|Gilead|Amgen|Vertex|CRISPR|Genentech|Sanofi|GSK|Bayer|BASF|Dow|DuPont|Chevron|ExxonMobil|Shell|BP|TotalEnergies|Schlumberger|Halliburton|ConocoPhillips|Marathon|Valero|Phillips 66|Enbridge|Kinder Morgan|NextEra|Duke Energy|Southern|Dominion|Exelon|PG&E|Edison|Sempra|AT&T|Verizon|T-Mobile|Sprint|Comcast|Charter|Dish|Liberty|Vodafone|Orange|Deutsche Telekom|Telefonica|BT|Sky|Discovery|ViacomCBS|Fox|NBC|CBS|ABC|CNN|BBC|Reuters|Bloomberg|Thomson Reuters|Dow Jones|Wall Street Journal|New York Times|Washington Post|Guardian|Financial Times|Economist|Forbes|Fortune|Time|Newsweek|Associated Press|AP|AFP|EFE)\b/gi,
];

// High Priority VIP Entities to always extract atomically
const VIP_ENTITIES = [
    'Trump', 'Donald Trump',
    'Boric', 'Gabriel Boric',
    'Kast', 'José Antonio Kast',
    'Matthei', 'Evelyn Matthei',
    'Milei', 'Javier Milei',
    'Biden', 'Joe Biden',
    'Putin', 'Vladimir Putin',
    'Zelensky', 'Volodimir Zelensky',
    'Maduro', 'Nicolás Maduro',
    'Petro', 'Gustavo Petro',
    'Lula', 'Lula da Silva',
    'Bolsonaro', 'Jair Bolsonaro',
    'Xi Jinping',
    'Elon Musk', 'Musk',
    'Marcel', 'Mario Marcel',
    'Vallejo', 'Camila Vallejo',
    'Tohá', 'Carolina Tohá'
];

// Prefixes to strip from tags to make them atomic
const PREFIXES_TO_STRIP = [
    'Gira de', 'Gira del',
    'Dichos de', 'Dichos del',
    'Caso',
    'Crisis de', 'Crisis del',
    'Muerte de', 'Muerte del',
    'Gobierno de', 'Gobierno del',
    'Renuncia de', 'Renuncia del',
    'Caída de', 'Caída del',
    'Alza de', 'Alza del',
    'Impacto de', 'Impacto del',
    'Triunfo de', 'Triunfo del',
    'Visita de', 'Visita del',
    'Discurso de', 'Discurso del',
    'Entrevista a', 'Entrevista con'
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
    const fullText = `${title} ${content || ''}`;
    const candidates = new Map<string, { text: string, category: 'company' | 'person' | 'country' | 'concept', score: number }>();

    // Helper to add/update score
    const addCandidate = (text: string, category: 'company' | 'person' | 'country' | 'concept', points: number) => {
        const key = text.toLowerCase();
        const existing = candidates.get(key);
        if (existing) {
            existing.score += points;
        } else {
            candidates.set(key, { text, category, score: points });
        }
    };

    // 1. VIP Extraction (Always Include / High Score)
    VIP_ENTITIES.forEach(vip => {
        // Check Title
        if (new RegExp(`\\b${vip}\\b`, 'i').test(title)) {
            addCandidate(vip, 'person', 100); // Protagonist confirmed
        }
        // Check Body
        else if (new RegExp(`\\b${vip}\\b`, 'i').test(fullText)) {
            // If VIP is in body, give them a high base score so they likely pass, 
            // but maybe not 100 if they are just mentioned once?
            // Actually user setup VIPs to be "always extract", so let's give them pass.
            addCandidate(vip, 'person', 50);
        }

        // Shortname check (e.g. "Trump" from "Donald Trump")
        if (vip.includes(' ')) {
            const shortName = vip.split(' ').pop();
            if (shortName) {
                if (new RegExp(`\\b${shortName}\\b`, 'i').test(title)) {
                    addCandidate(shortName, 'person', 100);
                } else if (new RegExp(`\\b${shortName}\\b`, 'i').test(fullText)) {
                    addCandidate(shortName, 'person', 50);
                }
            }
        }
    });

    // 2. Process other entities
    // We will scan the FULL text, but score based on position

    // Companies
    COMPANY_PATTERNS.forEach(pattern => {
        const matches = fullText.matchAll(pattern);
        for (const match of matches) {
            const company = match[0].trim();
            const index = match.index || 0;
            let points = 1;

            if (index < title.length) points = 50; // In Title
            else if (index < title.length + 200) points = 10; // In Lead

            addCandidate(company, 'company', points);
        }
    });

    // Countries
    COUNTRIES.forEach(country => {
        // Use matchAll to find all occurrences and score frequency
        const regex = new RegExp(`\\b${country}\\b`, 'gi');
        const matches = fullText.matchAll(regex);
        for (const match of matches) {
            const index = match.index || 0;
            let points = 1;
            if (index < title.length) points = 50;
            else if (index < title.length + 200) points = 10;

            addCandidate(country, 'country', points);
        }
    });

    // Concepts
    Object.entries(CONCEPTS).forEach(([concept, keywords]) => {
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            const matches = fullText.matchAll(regex);
            for (const match of matches) {
                // Determine if we add the *Concept* category or the specific keyword?
                // The requirements usually imply the high-level concept (e.g. "Technology")
                // But typically tags are specific. Here the code previously added "Technology" if "AI" found.
                // Let's stick to adding the Concept Name (key)
                const index = match.index || 0;
                let points = 1;
                if (index < title.length) points = 50;
                else if (index < title.length + 200) points = 10;

                addCandidate(concept, 'concept', points); // Aggregate score to the Concept
            }
        });
    });

    // Roles & Persons (Contextual)
    const ROLES = ['Presidente', 'Presidenta', 'Ministro', 'Ministra', 'Senador', 'Senadora', 'Diputado', 'Diputada', 'Director', 'Directora', 'Gerente', 'Candidato', 'Candidata', 'Alcalde', 'Alcaldesa', 'Gobernador', 'Gobernadora'];
    const rolePattern = new RegExp(`\\b(${ROLES.join('|')})\\s+((?:[A-Z][a-záéíóúñ]+\\s*){1,3})`, 'g');
    const roleMatches = fullText.matchAll(rolePattern);
    for (const match of roleMatches) {
        const name = match[2].trim();
        if (name.length > 3) {
            const index = match.index || 0;
            let points = 1;
            if (index < title.length) points = 50;
            else if (index < title.length + 200) points = 10;

            addCandidate(name, 'person', points + 5); // Bonus for having a Role
        }
    }

    // Proper Nouns (General)
    const STOP_WORDS = new Set([
        'El', 'La', 'Los', 'Las', 'Un', 'Una', 'Unos', 'Unas',
        'Y', 'O', 'Pero', 'Si', 'No', 'En', 'De', 'Por', 'Para', 'Con', 'Sin',
        'Sobre', 'Ante', 'Bajo', 'Cabe', 'Contra', 'Desde', 'Entre', 'Hacia', 'Hasta',
        'Segun', 'Tras', 'Durante', 'Mediante', 'Versus', 'Via',
        'A', 'Al', 'Del', 'Lo', 'Se', 'Su', 'Sus', 'Mi', 'Mis', 'Tu', 'Tus',
        'Que', 'Quien', 'Quienes', 'Cual', 'Cuales', 'Como', 'Cuando', 'Donde',
        'Este', 'Esta', 'Estos', 'Estas', 'Ese', 'Esa', 'Esos', 'Esas',
        'Ayer', 'Hoy', 'Mañana', 'Ahora', 'Antes', 'Despues', 'Siempre', 'Nunca',
        'Mas', 'Menos', 'Muy', 'Mucho', 'Poco', 'Todo', 'Nada', 'Algo',
        'The', 'A', 'An', 'In', 'On', 'At', 'For', 'To', 'Of', 'With', 'By', 'From',
        'And', 'Or', 'But', 'If', 'So', 'Because', 'While', 'When', 'Where', 'Who', 'What',
        'This', 'That', 'These', 'Those', 'It', 'He', 'She', 'They', 'We', 'You',
        'New', 'Old', 'Good', 'Bad', 'Big', 'Small', 'High', 'Low', 'Best', 'Worst',
        'Top', 'Key', 'Major', 'Main', 'First', 'Last', 'Next', 'Previous'
    ]);
    const properNounPattern = /\b([A-Z][a-záéíóúñ]+(?:\s+(?:de|del|la|las|el|los|y|&)\s+)?[A-Z][a-záéíóúñ]+(?:\s+[A-Z][a-záéíóúñ]+)?)\b/g;
    const properMatches = fullText.matchAll(properNounPattern);

    for (const match of properMatches) {
        let phrase = match[0].trim();
        const index = match.index || 0;

        // Atomization Cleanup
        const lowerPhrase = phrase.toLowerCase();
        for (const prefix of PREFIXES_TO_STRIP) {
            if (lowerPhrase.startsWith(prefix.toLowerCase() + ' ')) {
                phrase = phrase.substring(prefix.length).trim();
                break;
            }
        }

        if (phrase.split(' ')[0] && STOP_WORDS.has(phrase.split(' ')[0])) continue;
        if (!phrase.includes(' ') && STOP_WORDS.has(phrase)) continue;
        if (Object.keys(CONCEPTS).some(c => c.toLowerCase() === phrase.toLowerCase())) continue;

        if (phrase.length > 3) {
            let points = 1;
            if (index < title.length) points = 50;
            else if (index < title.length + 200) points = 10;

            addCandidate(phrase, 'person', points);
        }
    }

    // FILTER & SORT
    const minScore = 5; // Must be in Title OR Lead OR mentioned 5 times
    const tags = Array.from(candidates.values())
        .filter(c => c.score >= minScore)
        .sort((a, b) => b.score - a.score) // Sort by relevance
        .map(c => ({ text: c.text, category: c.category }));

    // De-duplicate (e.g. if we have "Trump" and "Donald Trump", keep "Trump"?)
    // Or if we have "Gabriel Boric" and "Boric".
    // Simple dedup: if a text is contained in another, keep the shorter one if it has high score?
    // Actually usually simpler is better. Let's just return unique texts.
    // The Map logic already merges exact matches.

    // Final limit
    return tags.slice(0, 8);
}
