/* app.js - Heladería Sirvent Informative Menu Functionality */

// --- GLOBAL APP STATE ---
const state = {
    currentLanguage: 'es',
    currentCategory: 'all',
    searchQuery: '',
    selectedLocation: 'levante', // 'levante' or 'poniente'
    openingHours: {
        openHour: 9,
        closeHour: 24 // midnight
    }
};

// --- TRANSLATION DICTIONARY (ES / EN) ---
const translations = {
    es: {
        nav_carta: "La Carta",
        nav_historia: "Nuestra Historia",
        nav_contacto: "Contacto",
        hero_badge: "Desde 1940 · Helados Artesanos",
        hero_title: "Sabores de siempre en un rincón de <span>Benidorm</span>",
        hero_desc: "Recetas tradicionales nacidas en Jijona y perfeccionadas a lo largo de generaciones. Disfruta del auténtico sabor artesanal con vistas al mar mediterráneo.",
        hero_cta_carta: "Ver la Carta",
        hero_cta_historia: "Nuestra Historia",
        history_subtitle: "Nuestra Tradición",
        history_title: "De la cuna del turrón a la costa de Benidorm",
        history_p1: "En 1940, la familia Sirvent inició su andadura elaborando helados y turrones artesanos en Jijona, cuna indiscutible de esta tradición. Con ingredientes de máxima calidad y un mimo infinito, decidimos trasladar esta pasión a Benidorm.",
        history_p2: "Hoy, más de 80 años después, mantenemos intacto el legado del iaio Luis Sirvent. Nuestra Horchata de Chufa de Alboraya premium y nuestros helados cremosos son el reflejo de un compromiso inquebrantable con la autenticidad y el sabor mediterráneo.",
        hist_h1: "Artesanos desde 1940",
        hist_p1_highlight: "Tres generaciones elaborando helados con recetas secretas familiares.",
        hist_h2: "Ingredientes Premium",
        hist_p2_highlight: "Chufa de Alboraya seleccionada y almendras de Jijona de primera calidad.",
        carta_subtitle: "Heladería Sirvent",
        carta_title: "Nuestra Carta de Manjares",
        search_placeholder: "Busca tu helado o bebida favorita...",
        tab_all: "Todos",
        tab_helados: "Helados y Tarrinas",
        tab_granizados: "Granizados",
        tab_cocktails: "Cócteles Frozen",
        tab_frap: "Frap-Shakes y Copas",
        tab_horchata: "Horchata y Leche",
        tab_gofres: "Gofres y Crepes",
        tab_cafe: "Cafetería",
        tab_bebidas: "Bebidas",
        status_open: "Abierto ahora",
        status_closed: "Cerrado ahora",
        status_hours: "Horario: Todos los días de 09:00 a 00:00",
        contact_title: "Ven a vernos en Benidorm",
        location_levante: "Playa de Levante",
        location_poniente: "Playa de Poniente",
        contact_tel: "Teléfono de contacto",
        contact_email: "Correo electrónico",
        contact_addr: "Dirección",
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
        hero_title: "Time-honored flavors in the heart of <span>Benidorm</span>",
        hero_desc: "Traditional recipes born in Jijona and perfected over generations. Enjoy the authentic artisan flavor with beautiful views of the Mediterranean Sea.",
        hero_cta_carta: "View the Menu",
        hero_cta_historia: "Our Story",
        history_subtitle: "Our Tradition",
        history_title: "From the cradle of nougat to the coast of Benidorm",
        history_p1: "In 1940, the Sirvent family began their journey making artisan ice cream and nougat in Jijona, the undisputed cradle of this sweet tradition. With top-quality ingredients and infinite care, we brought this passion to Benidorm.",
        history_p2: "Today, over 80 years later, we keep grandfather Luis Sirvent's legacy intact. Our premium Horchata de Chufa de Alboraya and our creamy ice creams are a reflection of our unwavering commitment to Mediterranean authenticity.",
        hist_h1: "Artisan since 1940",
        hist_p1_highlight: "Three generations crafting ice creams using secret family recipes.",
        hist_h2: "Premium Ingredients",
        hist_p2_highlight: "Selected Alboraya tigernuts and top-quality Jijona almonds.",
        carta_subtitle: "Sirvent Ice Cream Shop",
        carta_title: "Our Delightful Menu",
        search_placeholder: "Search for your favorite ice cream or drink...",
        tab_all: "All",
        tab_helados: "Ice Creams & Tubs",
        tab_granizados: "Slushes / Granizados",
        tab_cocktails: "Frozen Cocktails",
        tab_frap: "Frap-Shakes & Bowls",
        tab_horchata: "Horchata & Milk",
        tab_gofres: "Waffles & Crepes",
        tab_cafe: "Coffee Shop",
        tab_bebidas: "Drinks",
        status_open: "Open now",
        status_closed: "Closed now",
        status_hours: "Hours: Every day from 09:00 AM to 12:00 AM",
        contact_title: "Come see us in Benidorm",
        location_levante: "Levante Beach",
        location_poniente: "Poniente Beach",
        contact_tel: "Phone number",
        contact_email: "Email address",
        contact_addr: "Address",
        footer_desc: "Crafting happy moments and artisanal ice cream in Benidorm since 1940. Traditional recipes straight from Jijona.",
        footer_links_title: "Navigation",
        footer_hours_title: "Our Shops",
        footer_credit: "Designed with love for <span>Heladería Sirvent</span>"
    }
};

// --- PRODUCT DATABASE ---
const products = [
    // --- HELADOS Y TARRINAS ---
    {
        id: "helado_1_bola",
        category: "helados",
        nameEs: "Tarrina o Cono - 1 Bola",
        nameEn: "Tub or Cone - 1 Scoop",
        descEs: "Un sabor a tu elección en tarrina crujiente o cono artesano.",
        descEn: "One scoop of your choice served in a crispy tub or artisan cone.",
        price: 3.00,
        img: "img/Productos/TARRINA HELADO copia.png",
        tags: ["Gluten-free option", "Artisanal"],
        hasSizes: false
    },
    {
        id: "helado_2_bolas",
        category: "helados",
        nameEs: "Tarrina o Cono - 2 Bolas",
        nameEn: "Tub or Cone - 2 Scoops",
        descEs: "Combina hasta dos sabores diferentes en un formato generoso.",
        descEn: "Combine up to two different flavors in a generous serving.",
        price: 5.00,
        img: "img/Productos/CONO BOLAS HELADO.png",
        tags: ["Artisanal", "Popular"],
        hasSizes: false
    },
    {
        id: "helado_3_bolas",
        category: "helados",
        nameEs: "Tarrina o Cono - 3 Bolas",
        nameEn: "Tub or Cone - 3 Scoops",
        descEs: "El paraíso del helado: tres bolas de pura felicidad cremosa.",
        descEn: "Ice cream paradise: three scoops of pure creamy happiness.",
        price: 7.00,
        img: "img/Productos/TARRINA HELADO SIRVENT copia.png",
        tags: ["Maxi Size", "Artisanal"],
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
        img: "img/Productos/GRANIZADOS SABORES  copia.png",
        tags: ["Refreshing", "Vegan"],
        hasSizes: true,
        sizes: [
            { id: "sm", nameEs: "Pequeño", nameEn: "Small", price: 4.00 },
            { id: "lg", nameEs: "Grande", nameEn: "Large", price: 6.00 }
        ]
    },

    // --- FROZEN COCKTAILS ---
    {
        id: "cocktail_strawberry_daiquiri",
        category: "cocktails",
        nameEs: "Strawberry Daiquiri",
        nameEn: "Strawberry Daiquiri",
        descEs: "Ron blanco, fresas frescas y hielo picado. Un clásico del verano.",
        descEn: "White rum, fresh strawberries, and crushed ice. A summer classic.",
        price: 8.50,
        img: "img/Productos/GRANIZADOS SABORES  copia.png",
        tags: ["Alcoholic", "Fruity"],
        hasSizes: false
    },
    {
        id: "cocktail_blue_lagoon",
        category: "cocktails",
        nameEs: "Blue Lagoon",
        nameEn: "Blue Lagoon",
        descEs: "Vodka, curaçao azul, refrescante y helador.",
        descEn: "Vodka, blue curaçao, refreshing and freezing.",
        price: 8.50,
        img: "img/Productos/GRANIZADOS SABORES  copia.png",
        tags: ["Alcoholic", "Vibrant"],
        hasSizes: false
    },
    {
        id: "cocktail_mango_daiquiri",
        category: "cocktails",
        nameEs: "Mango Daiquiri",
        nameEn: "Mango Daiquiri",
        descEs: "Ron blanco con pulpa de mango natural, dulce y exótico.",
        descEn: "White rum with natural mango pulp, sweet and exotic.",
        price: 8.50,
        img: "img/Productos/GRANIZADOS SABORES  copia.png",
        tags: ["Alcoholic", "Tropical"],
        hasSizes: false
    },
    {
        id: "cocktail_strawberry_vodka",
        category: "cocktails",
        nameEs: "Strawberry Vodka",
        nameEn: "Strawberry Vodka",
        descEs: "Vodka premium con fresas trituradas heladas.",
        descEn: "Premium vodka with frozen crushed strawberries.",
        price: 8.50,
        img: "img/Productos/GRANIZADOS SABORES  copia.png",
        tags: ["Alcoholic", "Sweet"],
        hasSizes: false
    },
    {
        id: "cocktail_irish_frozen",
        category: "cocktails",
        nameEs: "Irish Frozen",
        nameEn: "Irish Frozen Whisky",
        descEs: "Combinado helado con Whisky irlandés y un toque de crema.",
        descEn: "Frozen blend with Irish Whiskey and a touch of cream.",
        price: 8.50,
        img: "img/Productos/AFOGATO.png",
        tags: ["Alcoholic", "Intense"],
        hasSizes: false
    },
    {
        id: "cocktail_margarita",
        category: "cocktails",
        nameEs: "Frozen Margarita",
        nameEn: "Frozen Margarita",
        descEs: "Tequila de primera, triple seco y zumo de lima batido con hielo.",
        descEn: "Top tequila, triple sec, and lime juice blended with ice.",
        price: 8.50,
        img: "img/Productos/GRANIZADOS SABORES  copia.png",
        tags: ["Alcoholic", "Citric"],
        hasSizes: false
    },
    {
        id: "cocktail_mentireta",
        category: "cocktails",
        nameEs: "Mentireta",
        nameEn: "Mentireta Slush",
        descEs: "Combinado tradicional alicantino de café licor helado y ginebra.",
        descEn: "Traditional Alicantino blend of frozen coffee liqueur and gin.",
        price: 8.50,
        img: "img/Productos/GRANIZADOS SABORES  copia.png",
        tags: ["Alcoholic", "Tradition"],
        hasSizes: false
    },
    {
        id: "cocktail_frappe_baileys",
        category: "cocktails",
        nameEs: "Café Frappé Baileys",
        nameEn: "Baileys Coffee Frappe",
        descEs: "Café expreso, licor Baileys y helado batidos hasta lograr una crema perfecta.",
        descEn: "Espresso coffee, Baileys liqueur, and ice cream blended to a creamy perfection.",
        price: 8.50,
        img: "img/Productos/Frap-Shake Cafe copia.png",
        tags: ["Alcoholic", "Sweet"],
        hasSizes: false
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
        descEs: "Receta tradicional de leche aromatizada con canela, corteza de limón y enfriada a punto de nieve.",
        descEn: "Traditional recipe of milk flavored with cinnamon, lemon peel, and cooled to slush point.",
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
        nameEs: "Fartón Tradicional (1 ud)",
        nameEn: "Traditional Farton Pastry (1 pc)",
        descEs: "Bollo alargado, dulce y esponjoso con glaseado, ideal para mojar en la horchata.",
        descEn: "Elongated, sweet, spongy pastry with sugar glaze, perfect for dipping in horchata.",
        price: 2.30,
        img: "img/Productos/Fartons.png",
        tags: ["Pastry", "Sweet"],
        hasSizes: false
    },

    // --- GOFRES & CREPES ---
    {
        id: "gofre_crepe",
        category: "gofres",
        nameEs: "Gofre o Crepe Recién Hecho",
        nameEn: "Freshly Made Waffle or Crepe",
        descEs: "Gofre o crepe crujiente sin nada. Personalízalo con nata montada, salsas Kinder Bueno, Nutella, chocolate blanco o negro por +2.00€ c/u o bola extra por +2.50€.",
        descEn: "Crispy waffle or thin crepe plain. Customize it with whipped cream, Kinder Bueno, Nutella, white or dark chocolate sauces for +2.00€ each or extra scoop for +2.50€.",
        price: 4.00,
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
        id: "agua",
        category: "bebidas",
        nameEs: "Agua Mineral",
        nameEn: "Mineral Water",
        descEs: "Agua mineral fresca sin gas para calmar la sed.",
        descEn: "Fresh still mineral water to quench your thirst.",
        price: 2.00,
        img: "img/Productos/CAFE SOLO.png", // fallback or placeholder icon representation
        tags: ["Water"],
        hasSizes: false
    },
    {
        id: "refresco",
        category: "bebidas",
        nameEs: "Refresco",
        nameEn: "Soft Drink",
        descEs: "Coca-Cola, Fanta, Sprite o Nestea helados en lata.",
        descEn: "Chilled Coca-Cola, Fanta, Sprite, or Nestea in a can.",
        price: 2.50,
        img: "img/Productos/GRANIZADOS SABORES  copia.png",
        tags: ["Soft drink"],
        hasSizes: false
    },
    {
        id: "cerveza",
        category: "bebidas",
        nameEs: "Cerveza Especial",
        nameEn: "Premium Beer",
        descEs: "Cerveza dorada y fría, ideal para desconectar frente a la costa.",
        descEn: "Cold and crisp golden beer, perfect for relaxing by the coast.",
        price: 3.00,
        img: "img/Productos/GRANIZADOS SABORES  copia.png",
        tags: ["Alcoholic"],
        hasSizes: false
    }
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
    { nombre: "Limón", badge: "Vegano" },
    { nombre: "Stracciatella", badge: null },
    { nombre: "Ferrero Rocher", badge: null },
    { nombre: "Pantera Rosa", badge: null },
    { nombre: "Chocolate negro", badge: "Vegano" },
    { nombre: "Mango", badge: "Vegano" },
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
        
        // Price structure formatting
        let priceHtml = "";
        if (product.hasSizes) {
            priceHtml = `
                <div class="product-sizes-list" style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px;">
                    ${product.sizes.map(s => `
                        <span style="font-size: 13px; font-weight: 700; color: var(--primary);">
                            ${state.currentLanguage === 'es' ? s.nameEs : s.nameEn}: <span style="font-family: 'Playfair Display', serif; font-size: 16px;">${s.price.toFixed(2)}€</span>
                        </span>
                    `).join("")}
                </div>
            `;
        } else {
            priceHtml = `<span class="product-price">${product.price.toFixed(2)}€</span>`;
        }

        const tagsHtml = product.tags.map(t => `<span class="tag-item">${t}</span>`).join("");

        const isHeladoBolas = ["helado_1_bola", "helado_2_bolas", "helado_3_bolas"].includes(product.id);
        const btnSabores = isHeladoBolas
            ? `<button class="btn-ver-sabores" onclick="abrirPopupSabores('${title}')">
                   <i class="fa-solid fa-ice-cream"></i>
                   ${state.currentLanguage === 'es' ? 'Ver sabores' : 'See flavors'}
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
                    ${priceHtml}
                </div>
                <p class="product-subtitle">${subtitle}</p>
                <p class="product-desc">${desc}</p>
                <div class="product-action" style="margin-top: auto; border-top: 1px dashed var(--border-color); padding-top: 12px;">
                    <div class="card-tags">${tagsHtml}</div>
                    ${btnSabores}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- OPEN / CLOSED REALTIME CHECKER ---
function checkOpeningStatus() {
    const now = new Date();
    const currentHour = now.getHours();
    
    const statusBadge = document.getElementById("statusBadge");
    const statusDot = document.getElementById("statusDot");
    const statusText = document.getElementById("statusText");
    
    if (!statusBadge) return;

    const isOpen = currentHour >= state.openingHours.openHour && currentHour < state.openingHours.closeHour;
    
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
