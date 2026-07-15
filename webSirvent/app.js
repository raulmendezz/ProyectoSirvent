/* app.js - Heladería Sirvent Informative Menu Functionality */

// --- GLOBAL APP STATE ---
const state = {
    currentLanguage: 'es',
    currentCategory: 'all',
    searchQuery: '',
    selectedLocation: 'levante', // 'levante' or 'poniente'
    openingHours: {
        openHour: 9,
        closeHour: 2 // 02:00 AM
    }
};

// --- TRANSLATION DICTIONARY (ES / EN) ---
const translations = {
    es: {
        nav_carta: "La Carta",
        nav_historia: "Nuestra Historia",
        nav_contacto: "Contacto",
        hero_badge: "Desde 1940 · Helados Artesanos",
        hero_title: "Tu momento sirvent en <span>Benidorm</span>",
        hero_desc: "Recetas tradicionales nacidas en Jijona y perfeccionadas a lo largo de generaciones. Disfruta del auténtico sabor artesanal con vistas al mar mediterráneo.",
        hero_cta_carta: "Ver la Carta",
        hero_cta_historia: "Nuestra Historia",
        history_subtitle: "Nuestra Tradición",
        history_title: "De la cuna del turrón a la costa de Benidorm",
        history_p1: "No es un casual, que la mayoría de la población de Jijona de finales de siglo XIX, aparte de la fabricación del turrón, a la que ya se dedicaba desde el siglo XIV, empezara la práctica de un nuevo oficio, el de heladero.",
        history_p1b: "Por aquel entonces, su población explotaba unos antiguos neveros ubicados en la sierra de la Carrasqueta, para transportar alimentos de manera refrigerada, con la nieve que acumulaban en ellos durante las épocas de invierno. Este privilegio, sirvió como detonante, para que sus gentes se inmiscuyeran en este oficio, ya que disponían de la materia imprescindible para su elaboración, el frío.",
        history_p2: "Hoy, más de 80 años después, mantenemos intacto el legado del iaio Luis Sirvent. Nuestra Horchata de Chufa de Alboraya premium y nuestros helados cremosos son el reflejo de un compromiso inquebrantable con la autenticidad y el sabor mediterráneo.",
        hist_h1: "MAESTROS HELADEROS ARTESANOS",
        hist_p1_highlight: "Tres generaciones elaborando helados con recetas secretas familiares.",
        hist_h2: "Ingredientes Premium",
        hist_p2_highlight: "Chufa de Alboraya seleccionada y turrón de Jijona de primera calidad.",
        carta_subtitle: "Heladería Sirvent",
        carta_title: "Nuestra Carta de Manjares",
        search_placeholder: "Busca tu helado o bebida favorita...",
        tab_all: "Todos",
        tab_helados: "Helados y Tarrinas",
        tab_granizados: "Granizados",
        tab_cocktails: "Cócteles Froozen",
        tab_frap: "Frap-Shakes",
        tab_horchata: "Horchata y Leche",
        tab_gofres: "Gofres y Crepes",
        tab_cafe: "Cafetería",
        tab_bebidas: "Bebidas",
        status_open: "Abierto ahora",
        status_closed: "Cerrado ahora",
        status_hours: "Horario: Todos los días de 09:00 a 02:00",
        contact_title: "Ven a vernos en Benidorm",
        location_levante: "Playa de Levante",
        location_poniente: "Playa de Poniente",
        contact_tel: "Teléfono de contacto",
        contact_email: "Correo electrónico",
        contact_addr: "Dirección",
        roulette_subtitle: "¿Indeciso?",
        roulette_title: "Gira la ruleta de sabores",
        roulette_desc: "¿No sabes qué sabor elegir? Deja que la suerte decida por ti entre todos nuestros sabores artesanales.",
        roulette_btn: "Girar la ruleta",
        roulette_btn_spinning: "Girando...",
        roulette_result_label: "Tu sabor es...",
        footer_desc: "Elaborando momentos felices y helados artesanales en Benidorm desde 1940. Recetas tradicionales directas de Jijona.",
        footer_links_title: "Navegación",
        footer_hours_title: "Nuestros Locales",
        footer_credit: "Diseñado con amor para <span>Heladería Sirvent</span>"
    },
    en: {
        nav_carta: "The Menu",
        nav_historia: "Our Story",
        nav_contacto: "Contact Us",
        hero_badge: "Since 1940 · Artisan Ice Cream",
        hero_title: "Your Sirvent moment in <span>Benidorm</span>",
        hero_desc: "Traditional recipes born in Jijona and perfected over generations. Enjoy the authentic artisan flavor with beautiful views of the Mediterranean Sea.",
        hero_cta_carta: "View the Menu",
        hero_cta_historia: "Our Story",
        history_subtitle: "Our Tradition",
        history_title: "From the cradle of nougat to the coast of Benidorm",
        history_p1: "It is no coincidence that, by the end of the 19th century, most of the population of Jijona — already devoted to nougat-making since the 14th century — began practicing a new trade: that of ice cream maker.",
        history_p1b: "Back then, the local population made use of old ice wells (\"neveros\") in the Carrasqueta mountains to transport food refrigerated, using the snow stored in them during the winter months. This advantage was the spark that drew the local people into this trade, since they already had access to the essential ingredient for making it: the cold.",
        history_p2: "Today, over 80 years later, we keep grandfather Luis Sirvent's legacy intact. Our premium Horchata de Chufa de Alboraya and our creamy ice creams are a reflection of our unwavering commitment to Mediterranean authenticity.",
        hist_h1: "MASTER ARTISAN ICE CREAM MAKERS",
        hist_p1_highlight: "Three generations crafting ice creams using secret family recipes.",
        hist_h2: "Premium Ingredients",
        hist_p2_highlight: "Selected Alboraya tigernuts and top-quality Jijona nougat.",
        carta_subtitle: "Sirvent Ice Cream Shop",
        carta_title: "Our Delightful Menu",
        search_placeholder: "Search for your favorite ice cream or drink...",
        tab_all: "All",
        tab_helados: "Ice Creams & Tubs",
        tab_granizados: "Slushes / Granizados",
        tab_cocktails: "Froozen Cocktails",
        tab_frap: "Frap-Shakes",
        tab_horchata: "Horchata & Milk",
        tab_gofres: "Waffles & Crepes",
        tab_cafe: "Coffee Shop",
        tab_bebidas: "Drinks",
        status_open: "Open now",
        status_closed: "Closed now",
        status_hours: "Hours: Every day from 09:00 AM to 02:00 AM",
        contact_title: "Come see us in Benidorm",
        location_levante: "Levante Beach",
        location_poniente: "Poniente Beach",
        contact_tel: "Phone number",
        contact_email: "Email address",
        contact_addr: "Address",
        roulette_subtitle: "Can't decide?",
        roulette_title: "Spin the flavor wheel",
        roulette_desc: "Not sure which flavor to pick? Let luck decide for you among all our artisan flavors.",
        roulette_btn: "Spin the wheel",
        roulette_btn_spinning: "Spinning...",
        roulette_result_label: "Your flavor is...",
        footer_desc: "Crafting happy moments and artisanal ice cream in Benidorm since 1940. Traditional recipes straight from Jijona.",
        footer_links_title: "Navigation",
        footer_hours_title: "Our Shops",
        footer_credit: "Designed with love for <span>Heladería Sirvent</span>"
    }
};

// --- PRODUCT TAG TRANSLATIONS (tags are stored in English, translated for ES display) ---
const tagTranslationsEs = {
    "100% Arabica": "100% Arábica",
    "Alcoholic": "Con alcohol",
    "Artisanal": "Artesanal",
    "Best Seller": "Más vendido",
    "Chef Special": "Especial del chef",
    "Chocolate": "Chocolate",
    "Citric": "Cítrico",
    "Coffee Lovers": "Para amantes del café",
    "Customizable": "Personalizable",
    "Freshly Baked": "Recién horneado",
    "Fruity": "Afrutado",
    "Gluten-free option": "Opción sin gluten",
    "Intense": "Intenso",
    "Kinder Lovers": "Para amantes de Kinder",
    "Local": "Local",
    "Maxi Size": "Tamaño Maxi",
    "Nut-Free": "Sin frutos secos",
    "Pastry": "Repostería",
    "Popular": "Popular",
    "Premium": "Premium",
    "Refreshing": "Refrescante",
    "Soft drink": "Refresco",
    "Sweet": "Dulce",
    "Tradition": "Tradición",
    "Traditional": "Tradicional",
    "Tropical": "Tropical",
    "Vegan": "Vegano",
    "Vibrant": "Vibrante",
    "Water": "Agua"
};

function translateTag(tag) {
    return state.currentLanguage === 'es' ? (tagTranslationsEs[tag] || tag) : tag;
}

// --- PRODUCT DATABASE ---
const products = [
    // --- HELADOS Y TARRINAS ---
    {
        id: "helado_bolas",
        category: "helados",
        nameEs: "Tarrina o Cono",
        nameEn: "Tub or Cone",
        descEs: "Elige tu sabor favorito en tarrina crujiente o cono artesano. 1, 2 o 3 bolas.",
        descEn: "Choose your favourite flavour in a crispy tub or artisan cone. 1, 2 or 3 scoops.",
        price: 3.00,
        img: "img/Productos/conoTarrina.png",
        tags: ["Gluten-free option", "Artisanal"],
        hasSizes: false
    },

    // --- GRANIZADOS ---
    {
        id: "granizado",
        category: "granizados",
        nameEs: "Granizado de Sabores",
        nameEn: "Flavored Slush (Granizado)",
        descEs: "Súper refrescante. Elige tu sabor preferido: Limón, Café, Fresa, Mango o Blue Tropic.",
        descEn: "Super refreshing. Choose your favorite flavor: Lemon, Coffee, Strawberry, Mango, or Blue Tropic.",
        price: 4.00,
        img: "img/Productos/GRANIZADOS%20SABORES%20%20copia.png",
        tags: ["Refreshing", "Vegan"],
        hasGranizadoSabores: true,
        hasSizes: true,
        sizes: [
            { id: "sm", nameEs: "Pequeño", nameEn: "Small", price: 4.00 },
            { id: "lg", nameEs: "Grande", nameEn: "Large", price: 6.00 }
        ]
    },

    // --- FROZEN COCKTAILS ---
    {
        id: "frozen_cocktails",
        category: "cocktails",
        nameEs: "Frozen Cocktails",
        nameEn: "Frozen Cocktails",
        descEs: "Cócteles helados artesanales. Elige entre nuestra selección de combinados frozen.",
        descEn: "Artisan frozen cocktails. Choose from our selection of frozen blends.",
        price: 8.50,
        img: "img/Productos/mangoDaikiri.png",
        tags: ["Alcoholic", "Artisanal"],
        hasSizes: false,
        hasFrozenCocktails: true
    },

    // --- COPAS Y FRAP-SHAKES ---
    {
        id: "copa_blanco_y_negro",
        category: "frap",
        nameEs: "Blanco y Negro",
        nameEn: "Black and White",
        descEs: "Granizado de café espresso coronado con una generosa bola de helado de leche merengada o vainilla.",
        descEn: "Espresso coffee slush topped with a generous scoop of merengue milk or vanilla ice cream.",
        price: 6.00,
        img: "img/Productos/BLANCO Y NEGRO.png",
        tags: ["Traditional", "Coffee Lovers"],
        hasSizes: false
    },
    {
        id: "copa_leche_merengada",
        category: "frap",
        nameEs: "Leche Merengada Premium",
        nameEn: "Premium Merengue Milk",
        descEs: "Nuestra clásica copa helada de leche merengada aromatizada con canela y limón.",
        descEn: "Our classic iced cup of sweet merengue milk flavored with cinnamon and lemon.",
        price: 7.00,
        img: "img/Productos/LECHE MERENGADA.png",
        tags: ["Traditional", "Best Seller"],
        hasSizes: false
    },
    {
        id: "frape_oreo",
        category: "frap",
        nameEs: "Frap-Shake Oreo",
        nameEn: "Oreo Frap-Shake",
        descEs: "Batido helado de galletas Oreo, leche y nata montada por encima.",
        descEn: "Amazing frozen shake made with Oreo cookies, milk, topped with whipped cream.",
        price: 4.50,
        img: "img/Productos/Frap-Shake Oreo.png",
        tags: ["Sweet", "Chocolate"],
        hasSizes: true,
        sizes: [
            { id: "md", nameEs: "Mediano", nameEn: "Medium", price: 4.50 },
            { id: "lg", nameEs: "Grande", nameEn: "Large", price: 7.00 }
        ]
    },
    {
        id: "frape_kinder",
        category: "frap",
        nameEs: "Frap-Shake Kinder Bueno",
        nameEn: "Kinder Bueno Frap-Shake",
        descEs: "Batido cremoso de helado de Kinder Bueno con sirope de chocolate y nata.",
        descEn: "Creamy shake made with Kinder Bueno ice cream, chocolate syrup, and cream.",
        price: 4.50,
        img: "img/Productos/Frap-Shake Kinder Bueno.png",
        tags: ["Sweet", "Kinder Lovers"],
        hasSizes: true,
        sizes: [
            { id: "md", nameEs: "Mediano", nameEn: "Medium", price: 4.50 },
            { id: "lg", nameEs: "Grande", nameEn: "Large", price: 7.00 }
        ]
    },
    {
        id: "frape_cafe",
        category: "frap",
        nameEs: "Frap-Shake Café",
        nameEn: "Coffee Frap-Shake",
        descEs: "Batido helado de café espresso y leche coronado con nata montada.",
        descEn: "Frozen shake made with espresso coffee and milk, topped with whipped cream.",
        price: 4.50,
        img: "img/Productos/Frap-Shake Cafe copia.png",
        tags: ["Coffee Lovers", "Sweet"],
        hasSizes: true,
        sizes: [
            { id: "md", nameEs: "Mediano", nameEn: "Medium", price: 4.50 },
            { id: "lg", nameEs: "Grande", nameEn: "Large", price: 7.00 }
        ]
    },

    // --- HORCHATA & LECHE PREPARADA ---
    {
        id: "horchata",
        category: "horchata",
        nameEs: "Horchata de Chufa de Alboraya",
        nameEn: "Premium Tigernut Horchata",
        descEs: "Horchata artesanal de primera calidad elaborada con auténtica chufa de Alboraya.",
        descEn: "Artisanal top-quality horchata made with authentic Alboraya tigernuts.",
        price: 4.00,
        img: "img/Productos/HORCHATA.png",
        tags: ["Vegan", "Nut-Free", "Local"],
        hasSizes: true,
        sizes: [
            { id: "sm", nameEs: "Pequeña", nameEn: "Small", price: 4.00 },
            { id: "lg", nameEs: "Grande", nameEn: "Large", price: 6.00 }
        ]
    },
    {
        id: "leche_preparada",
        category: "horchata",
        nameEs: "Leche Preparada del iaio Luis",
        nameEn: "Grandpa Luis' Prepared Milk",
        descEs: "Receta tradicional de leche con canela y raspadura de limón.",
        descEn: "Traditional recipe of milk with cinnamon and lemon zest.",
        price: 4.00,
        img: "img/Productos/LECHE MERENGADA.png",
        tags: ["Traditional", "Sweet"],
        hasSizes: true,
        sizes: [
            { id: "sm", nameEs: "Pequeña", nameEn: "Small", price: 4.00 },
            { id: "lg", nameEs: "Grande", nameEn: "Large", price: 6.00 }
        ]
    },
    {
        id: "fartons",
        category: "horchata",
        nameEs: "Fartons Artesanos (1 ud)",
        nameEn: "Artisan Fartons Pastry (1 pc)",
        descEs: "Bollo alargado, dulce y esponjoso con glaseado, ideal para mojar en la horchata.",
        descEn: "Elongated, sweet, spongy pastry with sugar glaze, perfect for dipping in horchata.",
        price: 2.30,
        img: "img/Productos/Fartons.png",
        tags: ["Pastry", "Sweet"],
        hasSizes: false
    },

    // --- GOFRES & CREPES ---
    {
        id: "gofre",
        category: "gofres",
        nameEs: "Gofre Recién Hecho",
        nameEn: "Freshly Made Waffle",
        descEs: "Gofre crujiente sin nada. Personalízalo con nata montada, salsas Kinder Bueno, Nutella, chocolate blanco o negro, o bola extra.",
        descEn: "Crispy waffle plain. Customize it with whipped cream, Kinder Bueno, Nutella, white or dark chocolate sauces, or an extra scoop.",
        price: null,
        img: "img/Productos/gofre.png",
        tags: ["Freshly Baked", "Customizable"],
        hasSizes: false
    },
    {
        id: "crepe",
        category: "gofres",
        nameEs: "Crepe Recién Hecho",
        nameEn: "Freshly Made Crepe",
        descEs: "Crepe fino y crujiente sin nada. Personalízalo con nata montada, salsas Kinder Bueno, Nutella, chocolate blanco o negro, o bola extra.",
        descEn: "Thin crispy crepe plain. Customize it with whipped cream, Kinder Bueno, Nutella, white or dark chocolate sauces, or an extra scoop.",
        price: null,
        img: "img/Productos/CREPE.png",
        tags: ["Freshly Baked", "Customizable"],
        hasSizes: false
    },

    // --- CAFETERÍA ---
    {
        id: "cafe_solo",
        category: "cafe",
        nameEs: "Café Solo",
        nameEn: "Espresso Coffee",
        descEs: "Intenso café espresso 100% Arábica de excelente cuerpo.",
        descEn: "Intense 100% Arabica espresso coffee with excellent body.",
        price: 2.20,
        img: "img/Productos/CAFE SOLO.png",
        tags: ["100% Arabica"],
        hasSizes: false
    },
    {
        id: "cafe_cortado",
        category: "cafe",
        nameEs: "Café Cortado",
        nameEn: "Macchiato Coffee",
        descEs: "Café espresso cortado con una pizca de leche caliente vaporizada.",
        descEn: "Espresso coffee cut with a splash of warm vaporized milk.",
        price: 2.30,
        img: "img/Productos/CAFE SOLO.png",
        tags: ["100% Arabica"],
        hasSizes: false
    },
    {
        id: "cafe_con_leche",
        category: "cafe",
        nameEs: "Café con Leche",
        nameEn: "Coffee with Milk (Latte)",
        descEs: "El equilibrio ideal: una generosa dosis de café y leche cremosa.",
        descEn: "The perfect balance: a generous dose of espresso and creamy milk.",
        price: 2.50,
        img: "img/Productos/CAFE CON LECHE.png",
        tags: ["Popular"],
        hasSizes: false
    },
    {
        id: "cafe_americano",
        category: "cafe",
        nameEs: "Café Americano",
        nameEn: "Americano Coffee",
        descEs: "Espresso largo rebajado con agua caliente, suave y aromático.",
        descEn: "Long espresso diluted with hot water, smooth and aromatic.",
        price: 2.40,
        img: "img/Productos/CAFE SOLO.png",
        tags: ["100% Arabica"],
        hasSizes: false
    },
    {
        id: "cafe_affogato",
        category: "cafe",
        nameEs: "El Affogato de Axel",
        nameEn: "Axel's Affogato Coffee",
        descEs: "Una bola de nuestro helado artesanal de vainilla ahogada en un shot de espresso caliente.",
        descEn: "A scoop of our artisanal vanilla ice cream drowned in a hot double espresso shot.",
        price: 6.00,
        img: "img/Productos/AFOGATO.png",
        tags: ["Chef Special", "Premium"],
        hasSizes: false
    },

    // --- BEBIDAS ---
    {
        id: "refresco",
        category: "bebidas",
        nameEs: "Refresco",
        nameEn: "Soft Drink",
        descEs: "Coca-Cola, Fanta, Sprite o Nestea helados en lata.",
        descEn: "Chilled Coca-Cola, Fanta, Sprite, or Nestea in a can.",
        price: 2.50,
        img: "img/Productos/refrescos.png",
        tags: ["Soft drink"],
        hasSizes: false,
        hasBebidas: true
    }
];

// --- FROZEN COCKTAILS LIST ---
const frozenCocktailsList = [
    { nombre: "Strawberry Daiquiri", desc: "Ron blanco, fresas frescas y hielo picado.", img: "img/Productos/daikiriStraw.png" },
    { nombre: "Blue Lagoon", desc: "Vodka, curaçao azul, refrescante y helador.", img: "img/Productos/blueLagoon.png" },
    { nombre: "Mango Daiquiri", desc: "Ron blanco con pulpa de mango natural.", img: "img/Productos/mangoDaikiri.png" },
    { nombre: "Strawberry Vodka", desc: "Vodka premium con fresas trituradas heladas.", img: "img/Productos/StrawberryVodka.png" },
    { nombre: "Irish Frozen", desc: "Whisky irlandés con un toque de crema.", img: "img/Productos/IrishFrozen.png" },
    { nombre: "Frozen Margarita", desc: "Tequila, triple seco y zumo de lima.", img: "img/Productos/forezenMargarita.png" },
    { nombre: "Mentireta", desc: "Café licor helado y ginebra. Tradición alicantina.", img: "img/Productos/mentireta.png" },
    { nombre: "Café Frappé Baileys", desc: "Café expreso, Baileys y helado batidos.", img: "img/Productos/cafeFrappeBaileys.png" },
    { nombre: "Piña con Malibu", desc: "Piña natural triturada con ron Malibu de coco, helado y refrescante.", img: "img/Productos/mangoMalibu.png" }
];

// --- BEBIDAS DISPONIBLES ---
const bebidasDisponibles = [
    { nombre: "Cocacola" },
    { nombre: "Cocacola zero" },
    { nombre: "Sprite" },
    { nombre: "Agua gas" },
    { nombre: "Agua" },
    { nombre: "Mahou" },
    { nombre: "Mahou 0,0" },
    { nombre: "Radler" },
    { nombre: "F. Limón" },
    { nombre: "F. Naranja" },
    { nombre: "Nestea" },
    { nombre: "Aquarius" },
    { nombre: "Tónica" }
];

// --- SABORES COMBINADOS DE NUESTROS CLIENTES ---
const saboresCombinados = [
    { nombre: "Yogur y Pistacho" },
    { nombre: "Yogur y Bueno" },
    { nombre: "Yogur y Lotus" },
    { nombre: "Tres Chocolates: chocolate, fondant y negro" },
    { nombre: "Plátano y Vainilla" },
    { nombre: "Fresa, Chocolate y Vainilla" },
    { nombre: "Limón, Merengada y Yogur" },
    { nombre: "Málaga, Tutti Frutti y Limón" },
    { nombre: "Ferrero, Lotus y Cheesecake" },
    { nombre: "Pistacho, Caramelo y Nata" },
    { nombre: "Kinder Huevo, Bueno y Oreo" },
    { nombre: "Pistacho Dubai, Vainilla y Chocolate" }
];

// --- SABORES GRANIZADO ---
const saboresGranizado = [
    { nombre: "Granizado de Limón" },
    { nombre: "Fresa" },
    { nombre: "Tropical Mango" },
    { nombre: "Piña Colada" },
    { nombre: "Café" }
];

// --- SABORES DISPONIBLES ---
const saboresHelado = [
    { nombre: "Oreo", badge: null },
    { nombre: "Turrón con trozos", badge: null },
    { nombre: "Dulce de leche", badge: null },
    { nombre: "Pistacho", badge: null },
    { nombre: "Cheese Cake", badge: null },
    { nombre: "Biscotino Cookies", badge: null },
    { nombre: "Kinder Bueno", badge: null },
    { nombre: "Plátano con nueces al caramelo", badge: null },
    { nombre: "Turrón", badge: "Sin azúcar" },
    { nombre: "Limón", badge: "Sin Lactosa" },
    { nombre: "Stracciatella", badge: null },
    { nombre: "Ferrero Rocher", badge: null },
    { nombre: "Pantera Rosa", badge: null },
    { nombre: "Chocolate negro", badge: "Sin Lactosa" },
    { nombre: "Mango", badge: "Sin Lactosa" },
    { nombre: "Nata", badge: null },
    { nombre: "Chocolate Sirvent", badge: null },
    { nombre: "Menta con chocolate (Aftereight)", badge: null },
    { nombre: "Chocolate blanco con filipinos", badge: null },
    { nombre: "Merengada", badge: "Sin azúcar" },
    { nombre: "Avellana", badge: null },
    { nombre: "Lotus", badge: null },
    { nombre: "Caramelo salado", badge: null },
    { nombre: "Vainilla", badge: null },
    { nombre: "Fresa Natural", badge: null },
    { nombre: "Huevo Kinder", badge: null },
    { nombre: "Málaga (Ron con pasas)", badge: null },
    { nombre: "Chocolate Fondant", badge: null },
    { nombre: "Nube de Algodón", badge: null },
    { nombre: "Tutti Frutti", badge: null },
    { nombre: "Yogur", badge: null },
    { nombre: "Coco con Raffaello", badge: null },
    { nombre: "Moka (Café)", badge: null },
    { nombre: "Crema Catalana", badge: null },
    { nombre: "Pistacho Dubai", badge: null },
    { nombre: "Chocolate con Oreo", badge: null },
    { nombre: "Coco con Mango", badge: null }
];

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    // Check navigation scroll
    window.addEventListener("scroll", handleNavbarScroll);

    // Initial UI render
    setLanguage(state.currentLanguage);
    checkOpeningStatus();

    // Setup filter listeners
    setupFilters();

    // Setup map tabs
    setupMapTabs();

    // Build the flavor roulette wheel
    buildRouletteWheel();

    // Interval to keep opening status fresh
    setInterval(checkOpeningStatus, 60000);
});

// --- NAVIGATION SCROLL EFFECT ---
function handleNavbarScroll() {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
}

// --- LANGUAGE TRANSLATIONS ENGINE ---
function setLanguage(lang) {
    state.currentLanguage = lang;

    // Update active lang button
    document.querySelectorAll(".lang-btn").forEach(btn => {
        if (btn.getAttribute("data-lang") === lang) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    // Translate DOM elements that have a data-key attribute
    document.querySelectorAll("[data-key]").forEach(elem => {
        const key = elem.getAttribute("data-key");
        if (translations[lang] && translations[lang][key]) {
            if (elem.innerHTML.includes("<span>")) {
                elem.innerHTML = translations[lang][key];
            } else {
                elem.textContent = translations[lang][key];
            }
        }
    });

    // Update search bar placeholder
    const searchInput = document.querySelector(".search-input");
    if (searchInput) {
        searchInput.placeholder = translations[lang].search_placeholder;
    }

    // Rerender products in new language
    renderProducts();
}

// --- PRODUCT RENDERING & SEARCH ---
function setupFilters() {
    const tabsContainer = document.querySelector(".filter-tabs");
    const searchInput = document.querySelector(".search-input");

    // Click tabs
    tabsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("tab-btn")) {
            document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
            e.target.classList.add("active");
            state.currentCategory = e.target.getAttribute("data-category");
            renderProducts();
        }
    });

    // Search input
    searchInput.addEventListener("input", (e) => {
        state.searchQuery = e.target.value.toLowerCase().trim();
        renderProducts();
    });
}

function renderProducts() {
    const grid = document.querySelector(".products-grid");
    if (!grid) return;

    grid.innerHTML = "";

    // Filter products
    const filtered = products.filter(product => {
        // Category check
        const matchCategory = state.currentCategory === 'all' || product.category === state.currentCategory;

        // Search query check
        const name = (state.currentLanguage === 'es' ? product.nameEs : product.nameEn).toLowerCase();
        const desc = (state.currentLanguage === 'es' ? product.descEs : product.descEn).toLowerCase();
        const matchSearch = name.includes(state.searchQuery) || desc.includes(state.searchQuery);

        return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🍦</div>
                <h3>${state.currentLanguage === 'es' ? 'No se encontraron antojos' : 'No sweet treats found'}</h3>
                <p>${state.currentLanguage === 'es' ? 'Prueba a cambiar tu término de búsqueda.' : 'Try changing your search term.'}</p>
            </div>
        `;
        return;
    }

    filtered.forEach(product => {
        const title = state.currentLanguage === 'es' ? product.nameEs : product.nameEn;
        const subtitle = state.currentLanguage === 'es' ? product.nameEn : product.nameEs;
        const desc = state.currentLanguage === 'es' ? product.descEs : product.descEn;

        const tagsHtml = product.tags.map(t => `<span class="tag-item">${translateTag(t)}</span>`).join("");

        const isHeladoBolas = product.id === "helado_bolas";
        const btnSabores = isHeladoBolas
            ? `<button class="btn-ver-sabores" onclick="abrirPopupSabores('${title}')">
                   <i class="fa-solid fa-ice-cream"></i>
                   ${state.currentLanguage === 'es' ? 'Ver sabores' : 'See flavors'}
               </button>`
            : "";

        const btnBebidas = product.hasBebidas
            ? `<button class="btn-ver-sabores" onclick="abrirPopupBebidas()">
                   <i class="fa-solid fa-bottle-water"></i>
                   ${state.currentLanguage === 'es' ? 'Ver bebidas' : 'See drinks'}
               </button>`
            : "";

        const btnGranizadoSabores = product.hasGranizadoSabores
            ? `<button class="btn-ver-sabores" onclick="abrirPopupGranizadoSabores()">
                   <i class="fa-solid fa-snowflake"></i>
                   ${state.currentLanguage === 'es' ? 'Ver sabores' : 'See flavors'}
               </button>`
            : "";

        const btnFrozenCocktails = product.hasFrozenCocktails
            ? `<button class="btn-ver-sabores" onclick="abrirPopupFrozenCocktails()">
                   <i class="fa-solid fa-martini-glass-citrus"></i>
                   ${state.currentLanguage === 'es' ? 'Ver cócteles' : 'See cocktails'}
               </button>`
            : "";

        const card = document.createElement("div");
        card.className = "product-card";
        card.setAttribute("data-aos", "fade-up");
        card.innerHTML = `
            <span class="product-badge">${state.currentLanguage === 'es' ? product.category : product.category}</span>
            <div class="product-img-container">
                <img src="${product.img}" alt="${title}" class="product-img" loading="lazy">
            </div>
            <div class="product-info">
                <div class="product-title-row" style="align-items: center;">
                    <h3 class="product-title">${title}</h3>
                </div>
                <p class="product-subtitle">${subtitle}</p>
                <p class="product-desc">${desc}</p>
                <div class="product-action" style="margin-top: auto; border-top: 1px dashed var(--border-color); padding-top: 12px;">
                    <div class="card-tags">${tagsHtml}</div>
                    ${btnSabores}
                    ${btnBebidas}
                    ${btnGranizadoSabores}
                    ${btnFrozenCocktails}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Inject roulette card next to helados when that category is selected
    if (state.currentCategory === 'helados') {
        const rouletteCard = document.createElement("div");
        rouletteCard.className = "product-card roulette-grid-card";
        rouletteCard.setAttribute("data-aos", "fade-up");
        rouletteCard.innerHTML = `
            <div class="roulette-grid-content">
                <span class="section-subtitle">${translations[state.currentLanguage].roulette_subtitle}</span>
                <h3 class="roulette-grid-title">${translations[state.currentLanguage].roulette_title}</h3>
                <p class="roulette-grid-desc">${translations[state.currentLanguage].roulette_desc}</p>
                <div class="roulette-wheel-wrapper roulette-wheel-wrapper-sm">
                    <div class="roulette-pointer"><i class="fa-solid fa-caret-down"></i></div>
                    <div class="roulette-wheel" id="cartaRouletteWheel"></div>
                    <div class="roulette-center"><i class="fa-solid fa-ice-cream"></i></div>
                </div>
                <button class="btn-spin-roulette" id="btnCartaSpinRoulette" onclick="girarRuletaSabores('carta')">
                    <i class="fa-solid fa-dice"></i>
                    <span id="btnCartaSpinRouletteText">${translations[state.currentLanguage].roulette_btn}</span>
                </button>
                <div class="roulette-result" id="cartaRouletteResult">
                    <span class="roulette-result-label">${translations[state.currentLanguage].roulette_result_label}</span>
                    <strong id="cartaRouletteResultName"></strong>
                </div>
            </div>
        `;
        grid.appendChild(rouletteCard);

        // Build the wheel for the carta roulette
        setTimeout(() => {
            const cartaWheel = document.getElementById("cartaRouletteWheel");
            if (cartaWheel) {
                const segmentAngle = 360 / saboresHelado.length;
                const stops = saboresHelado.map((_, i) => {
                    const color = ROULETTE_COLORS[i % ROULETTE_COLORS.length];
                    const from = (i * segmentAngle).toFixed(3);
                    const to = ((i + 1) * segmentAngle).toFixed(3);
                    return `${color} ${from}deg ${to}deg`;
                }).join(", ");
                cartaWheel.style.background = `conic-gradient(${stops})`;
            }
            cartaRouletteRotation = 0;
        }, 0);

        // Inject sabores combinados card next to helados as well
        const combosCard = document.createElement("div");
        combosCard.className = "product-card roulette-grid-card combos-grid-card";
        combosCard.setAttribute("data-aos", "fade-up");
        combosCard.innerHTML = `
            <div class="roulette-grid-content">
                <span class="section-subtitle">${state.currentLanguage === 'es' ? 'Favoritos' : 'Favorites'}</span>
                <h3 class="roulette-grid-title">${state.currentLanguage === 'es' ? 'Sabores combinados de nuestros clientes' : 'Our customers\' combined flavors'}</h3>
                <p class="roulette-grid-desc">${state.currentLanguage === 'es' ? 'Las combinaciones más pedidas por nuestros clientes. ¡Inspírate y crea la tuya!' : 'The combinations our customers order the most. Get inspired and create your own!'}</p>
                <img src="img/Productos/saborescombinados.png" alt="Sabores combinados de nuestros clientes" class="combos-grid-img" loading="lazy">
                <button class="btn-ver-sabores" onclick="abrirPopupCombos()">
                    <i class="fa-solid fa-ice-cream"></i>
                    ${state.currentLanguage === 'es' ? 'Ver sabores combinados' : 'See combined flavors'}
                </button>
            </div>
        `;
        grid.appendChild(combosCard);
    }
}

// --- OPEN / CLOSED REALTIME CHECKER ---
function checkOpeningStatus() {
    const now = new Date();
    const currentHour = now.getHours();

    const statusBadge = document.getElementById("statusBadge");
    const statusDot = document.getElementById("statusDot");
    const statusText = document.getElementById("statusText");

    if (!statusBadge) return;

    // Handle closing hours that cross midnight (e.g., open 9:00 - 01:00)
    let isOpen;
    if (state.openingHours.closeHour > state.openingHours.openHour) {
        // Normal case (e.g., 9-22)
        isOpen = currentHour >= state.openingHours.openHour && currentHour < state.openingHours.closeHour;
    } else {
        // Crosses midnight (e.g., 9-1): open if hour >= 9 OR hour < 1
        isOpen = currentHour >= state.openingHours.openHour || currentHour < state.openingHours.closeHour;
    }

    if (isOpen) {
        statusBadge.className = "status-badge open";
        statusText.textContent = translations[state.currentLanguage].status_open;
    } else {
        statusBadge.className = "status-badge closed";
        statusText.textContent = translations[state.currentLanguage].status_closed;
    }
}

// --- POPUP SABORES ---
function abrirPopupSabores(titulo) {
    const popup = document.getElementById("popupSabores");
    document.getElementById("popupSaboresTitle").textContent = titulo;

    const lista = document.getElementById("popupSaboresList");
    lista.innerHTML = saboresHelado.map(s => `
        <div class="sabor-item">
            <i class="fa-solid fa-circle"></i>
            <span>${s.nombre}${s.badge ? `<span class="sabor-badge">${s.badge}</span>` : ""}</span>
        </div>
    `).join("");

    popup.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function cerrarPopupSabores() {
    document.getElementById("popupSabores").style.display = "none";
    document.body.style.overflow = "";
}

window.addEventListener("click", (e) => {
    const popup = document.getElementById("popupSabores");
    if (e.target === popup) cerrarPopupSabores();
});

// --- POPUP BEBIDAS ---
function abrirPopupBebidas() {
    const popup = document.getElementById("popupBebidas");
    const lista = document.getElementById("popupBebidasList");
    lista.innerHTML = bebidasDisponibles.map(b => `
        <div class="sabor-item">
            <i class="fa-solid fa-circle"></i>
            <span>${b.nombre}</span>
        </div>
    `).join("");
    popup.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function cerrarPopupBebidas() {
    document.getElementById("popupBebidas").style.display = "none";
    document.body.style.overflow = "";
}

window.addEventListener("click", (e) => {
    const popup = document.getElementById("popupBebidas");
    if (e.target === popup) cerrarPopupBebidas();
});

// --- POPUP GRANIZADO SABORES ---
function abrirPopupGranizadoSabores() {
    const popup = document.getElementById("popupGranizadoSabores");
    const lista = document.getElementById("popupGranizadoSaboresList");
    lista.innerHTML = saboresGranizado.map(s => `
        <div class="sabor-item">
            <i class="fa-solid fa-circle"></i>
            <span>${s.nombre}</span>
        </div>
    `).join("");
    popup.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function cerrarPopupGranizadoSabores() {
    document.getElementById("popupGranizadoSabores").style.display = "none";
    document.body.style.overflow = "";
}

window.addEventListener("click", (e) => {
    const popup = document.getElementById("popupGranizadoSabores");
    if (e.target === popup) cerrarPopupGranizadoSabores();
});

// --- POPUP SABORES COMBINADOS ---
function abrirPopupCombos() {
    const popup = document.getElementById("popupCombos");
    const lista = document.getElementById("popupCombosList");
    lista.innerHTML = saboresCombinados.map(s => `
        <div class="sabor-item">
            <i class="fa-solid fa-circle"></i>
            <span>${s.nombre}</span>
        </div>
    `).join("");
    popup.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function cerrarPopupCombos() {
    document.getElementById("popupCombos").style.display = "none";
    document.body.style.overflow = "";
}

window.addEventListener("click", (e) => {
    const popup = document.getElementById("popupCombos");
    if (e.target === popup) cerrarPopupCombos();
});

// --- POPUP FROZEN COCKTAILS ---
function abrirPopupFrozenCocktails() {
    const popup = document.getElementById("popupFrozenCocktails");
    const lista = document.getElementById("popupFrozenCocktailsList");
    lista.innerHTML = frozenCocktailsList.map(c => `
        <div class="cocktail-card">
            <div class="cocktail-card-img-wrap">
                <img src="${c.img}" alt="${c.nombre}" class="cocktail-card-img">
            </div>
            <div class="cocktail-card-body">
                <h4 class="cocktail-card-name">${c.nombre}</h4>
                <p class="cocktail-card-desc">${c.desc}</p>
            </div>
        </div>
    `).join("");
    popup.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function cerrarPopupFrozenCocktails() {
    document.getElementById("popupFrozenCocktails").style.display = "none";
    document.body.style.overflow = "";
}

window.addEventListener("click", (e) => {
    const popup = document.getElementById("popupFrozenCocktails");
    if (e.target === popup) cerrarPopupFrozenCocktails();
});

// --- FLAVOR ROULETTE ---
let rouletteRotation = 0;
let isSpinningRoulette = false;
const ROULETTE_COLORS = ["#ff5c7c", "#ffb3c1"];

let cartaRouletteRotation = 0;
let isSpinningCartaRoulette = false;

function buildRouletteWheel() {
    const segmentAngle = 360 / saboresHelado.length;
    const stops = saboresHelado.map((_, i) => {
        const color = ROULETTE_COLORS[i % ROULETTE_COLORS.length];
        const from = (i * segmentAngle).toFixed(3);
        const to = ((i + 1) * segmentAngle).toFixed(3);
        return `${color} ${from}deg ${to}deg`;
    }).join(", ");

    const bg = `conic-gradient(${stops})`;

    const wheel = document.getElementById("rouletteWheel");
    if (wheel) wheel.style.background = bg;

    const cartaWheel = document.getElementById("cartaRouletteWheel");
    if (cartaWheel) cartaWheel.style.background = bg;
}

function girarRuletaSabores(variant) {
    const isCarta = (variant === 'carta');

    // Pick the right set of elements
    const spinningFlag = isCarta ? isSpinningCartaRoulette : isSpinningRoulette;
    if (spinningFlag) return;

    const wheelId = isCarta ? "cartaRouletteWheel" : "rouletteWheel";
    const btnId = isCarta ? "btnCartaSpinRoulette" : "btnSpinRoulette";
    const btnTextId = isCarta ? "btnCartaSpinRouletteText" : "btnSpinRouletteText";
    const resultId = isCarta ? "cartaRouletteResult" : "rouletteResult";
    const resultNameId = isCarta ? "cartaRouletteResultName" : "rouletteResultName";

    const wheel = document.getElementById(wheelId);
    const btn = document.getElementById(btnId);
    const btnText = document.getElementById(btnTextId);
    const result = document.getElementById(resultId);
    if (!wheel || !btn || !result) return;

    if (isCarta) { isSpinningCartaRoulette = true; } else { isSpinningRoulette = true; }
    btn.disabled = true;
    btnText.textContent = translations[state.currentLanguage].roulette_btn_spinning;
    result.classList.remove("show");
    wheel.classList.add("spinning");

    const segmentAngle = 360 / saboresHelado.length;
    const chosenIndex = Math.floor(Math.random() * saboresHelado.length);
    const segmentCenter = chosenIndex * segmentAngle + segmentAngle / 2;

    // Pointer sits at the top (0deg); rotate so the chosen segment lands there.
    const desiredMod = (360 - segmentCenter + 360) % 360;
    let currentRotation = isCarta ? cartaRouletteRotation : rouletteRotation;
    const currentMod = ((currentRotation % 360) + 360) % 360;
    const delta = (desiredMod - currentMod + 360) % 360;
    const extraSpins = 5;

    currentRotation += delta + extraSpins * 360;
    if (isCarta) { cartaRouletteRotation = currentRotation; } else { rouletteRotation = currentRotation; }
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        const sabor = saboresHelado[chosenIndex];
        document.getElementById(resultNameId).innerHTML =
            `${sabor.nombre}${sabor.badge ? ` <span class="sabor-badge" style="background: var(--primary-light); color: white;">${sabor.badge}</span>` : ""}`;

        result.classList.add("show");
        wheel.classList.remove("spinning");
        btn.disabled = false;
        btnText.textContent = translations[state.currentLanguage].roulette_btn;
        if (isCarta) { isSpinningCartaRoulette = false; } else { isSpinningRoulette = false; }
    }, 3700);
}

// --- LOCATION / MAP TABS LOGIC ---
function setupMapTabs() {
    const mapTabs = document.querySelector(".map-selector");
    if (!mapTabs) return;

    mapTabs.addEventListener("click", (e) => {
        if (e.target.classList.contains("map-tab-btn")) {
            document.querySelectorAll(".map-tab-btn").forEach(btn => btn.classList.remove("active"));
            e.target.classList.add("active");

            const location = e.target.getAttribute("data-location");
            state.selectedLocation = location;

            // Switch active map iframe
            document.querySelectorAll(".map-iframe").forEach(iframe => {
                if (iframe.id === `map-${location}`) {
                    iframe.classList.add("active");
                } else {
                    iframe.classList.remove("active");
                }
            });
        }
    });
}
