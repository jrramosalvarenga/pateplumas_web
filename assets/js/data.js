// Catálogo de productos de Pateplumas Coffee
// Los precios están en Lempiras (L). Ajusta precios, textos e imágenes según necesites.

const CATEGORIES = [
  { id: "cafe-caliente", name: "Café Caliente", icon: "☕" },
  { id: "cafe-frio", name: "Café Frío", icon: "🧊" },
  { id: "frappes", name: "Frappés", icon: "🥤" },
  { id: "smoothies", name: "Smoothies y Tés", icon: "🍓" },
  { id: "crepas", name: "Crepas", icon: "🥞" },
  { id: "desayunos", name: "Desayunos", icon: "🍳" },
  { id: "sandwiches", name: "Sándwiches", icon: "🥪" },
  { id: "postres", name: "Postres", icon: "🍰" },
];

// sizes: array de { name, delta } para bebidas. delta se suma al precio base.
// extras: array de { name, delta } opcionales para personalizar el producto.
const PRODUCTS = [
  {
    id: "cappuccino-corazon",
    name: "Cappuccino Corazón",
    category: "cafe-caliente",
    price: 60,
    img: "assets/img/cappuccino-corazon.jpeg",
    shortDesc: "Espresso doble con leche vaporizada y arte latte hecho a mano.",
    longDesc:
      "Dos shots de espresso 100% hondureño cubiertos con leche vaporizada a la textura perfecta y coronados con un delicado arte latte. Cremoso, aromático y balanceado: el clásico que nunca falla.",
    sizes: [
      { name: "Chica", delta: -10 },
      { name: "Mediana", delta: 0 },
      { name: "Grande", delta: 15 },
    ],
    extras: [
      { name: "Shot extra de espresso", delta: 15 },
      { name: "Leche de almendra", delta: 15 },
      { name: "Canela espolvoreada", delta: 0 },
    ],
    tags: ["Favorito"],
  },
  {
    id: "latte-autor",
    name: "Latte de Autor",
    category: "cafe-caliente",
    price: 65,
    img: "assets/img/muffin-cappuccino.jpeg",
    shortDesc: "Latte suave con arte de hoja, acompañado de nuestro muffin del día.",
    longDesc:
      "Nuestro latte insignia: espresso suave envuelto en leche cremosa vaporizada con arte de hoja dibujado a mano. Ideal para acompañar con un muffin recién horneado.",
    sizes: [
      { name: "Chica", delta: -10 },
      { name: "Mediana", delta: 0 },
      { name: "Grande", delta: 15 },
    ],
    extras: [
      { name: "Agregar muffin del día", delta: 30 },
      { name: "Shot extra de espresso", delta: 15 },
      { name: "Vainilla", delta: 10 },
    ],
    tags: [],
  },
  {
    id: "cappuccino-fern",
    name: "Cappuccino Fern Art",
    category: "cafe-caliente",
    price: 65,
    img: "assets/img/pastel-chocolate-cappuccino.jpeg",
    shortDesc: "Cappuccino con arte latte de hoja, textura sedosa y sabor intenso.",
    longDesc:
      "Preparado en nuestra máquina La Carimali, este cappuccino resalta las notas achocolatadas de nuestro café de origen hondureño. Perfecto solo o acompañado de un pedazo de pastel de chocolate.",
    sizes: [
      { name: "Chica", delta: -10 },
      { name: "Mediana", delta: 0 },
      { name: "Grande", delta: 15 },
    ],
    extras: [
      { name: "Shot extra de espresso", delta: 15 },
      { name: "Crema batida", delta: 10 },
    ],
    tags: [],
  },

  {
    id: "iced-coffee",
    name: "Iced Coffee Pateplumas",
    category: "cafe-frio",
    price: 55,
    img: "assets/img/cafe-helado.jpeg",
    shortDesc: "Café frío suave sobre hielo, refrescante y con cuerpo.",
    longDesc:
      "Café recién extraído, enfriado y servido sobre hielo con un toque de leche espumada. Refrescante sin perder el carácter de nuestro café de la zona.",
    sizes: [
      { name: "Mediana", delta: 0 },
      { name: "Grande", delta: 15 },
    ],
    extras: [
      { name: "Shot extra de espresso", delta: 15 },
      { name: "Saborizante de caramelo", delta: 10 },
    ],
    tags: ["Favorito"],
  },
  {
    id: "mocha-helado",
    name: "Mocha Helado",
    category: "cafe-frio",
    price: 65,
    img: "assets/img/mocha-helado.jpeg",
    shortDesc: "Café frío con chocolate, coronado con swirl de mocha.",
    longDesc:
      "La combinación perfecta de espresso, chocolate y leche fría, servido sobre hielo con un decorado de mocha. Dulce, intenso y muy fotogénico.",
    sizes: [
      { name: "Mediana", delta: 0 },
      { name: "Grande", delta: 15 },
    ],
    extras: [
      { name: "Crema batida", delta: 10 },
      { name: "Shot extra de espresso", delta: 15 },
    ],
    tags: [],
  },
  {
    id: "cafe-rocas-crema",
    name: "Café en las Rocas con Crema",
    category: "cafe-frio",
    price: 60,
    img: "assets/img/mugs-chocolate-caramelo.jpeg",
    shortDesc: "Café helado servido en mug, coronado con crema batida.",
    longDesc:
      "Servido en un mug de vidrio bien helado, este café combina capas de café, leche y una generosa corona de crema batida. Disponible en versión chocolate o caramelo.",
    sizes: [
      { name: "Mediana", delta: 0 },
      { name: "Grande", delta: 15 },
    ],
    extras: [
      { name: "Versión chocolate", delta: 0 },
      { name: "Versión caramelo", delta: 0 },
    ],
    tags: [],
  },

  {
    id: "frappe-caramelo-moka",
    name: "Frappé Pateplumas (Caramelo o Moka)",
    category: "frappes",
    price: 75,
    img: "assets/img/frappe-caramelo-mocha.jpeg",
    shortDesc: "Frappé cremoso batido con hielo, disponible en caramelo o moka.",
    longDesc:
      "Nuestro frappé insignia: café batido con hielo y leche hasta lograr una textura suave, coronado con crema batida. Elige tu sabor favorito: caramelo dorado o moka de chocolate.",
    sizes: [
      { name: "Mediana", delta: 0 },
      { name: "Grande", delta: 20 },
    ],
    extras: [
      { name: "Sabor: Caramelo", delta: 0 },
      { name: "Sabor: Moka", delta: 0 },
      { name: "Shot extra de espresso", delta: 15 },
    ],
    tags: ["Favorito"],
  },
  {
    id: "frappe-fresa-real",
    name: "Frappé Fresa Real",
    category: "frappes",
    price: 80,
    img: "assets/img/frappe-fresa-grande.jpeg",
    shortDesc: "Frappé de fresa natural, tamaño grande, con topping de la casa.",
    longDesc:
      "Fresas reales batidas con hielo y leche, en un frappé grande coronado con crema batida y trocitos de fruta. Dulce, frutal y muy refrescante.",
    sizes: [
      { name: "Mediana", delta: 0 },
      { name: "Grande", delta: 20 },
    ],
    extras: [
      { name: "Malvaviscos", delta: 10 },
      { name: "Topping de mango", delta: 10 },
    ],
    tags: [],
  },
  {
    id: "frappe-matcha",
    name: "Frappé Matcha Fresco",
    category: "frappes",
    price: 75,
    img: "assets/img/frappe-matcha.jpeg",
    shortDesc: "Matcha batido con hielo, verde vibrante y sabor herbal suave.",
    longDesc:
      "Té matcha ceremonial batido con hielo y leche, ligeramente dulce y con ese color verde vibrante característico. Una opción diferente y energizante.",
    sizes: [
      { name: "Mediana", delta: 0 },
      { name: "Grande", delta: 20 },
    ],
    extras: [{ name: "Leche de almendra", delta: 15 }],
    tags: [],
  },
  {
    id: "frappe-nube",
    name: "Frappé Nube de Colores",
    category: "frappes",
    price: 90,
    img: "assets/img/frappe-especial-algodon.jpeg",
    shortDesc: "Frappé especial con malvaviscos, gomitas y algodón de azúcar.",
    longDesc:
      "Nuestra creación más divertida: frappé cremoso coronado con una montaña de crema batida, malvaviscos de colores, gomitas y algodón de azúcar. Perfecto para celebrar algo especial.",
    sizes: [
      { name: "Mediana", delta: 0 },
      { name: "Grande", delta: 20 },
    ],
    extras: [{ name: "Mensaje especial en el vaso", delta: 0 }],
    tags: ["Especial"],
  },

  {
    id: "smoothie-mango",
    name: "Smoothie Tropical de Mango",
    category: "smoothies",
    price: 70,
    img: "assets/img/smoothie-fresa-grande.jpeg",
    shortDesc: "Mango natural batido con hielo, tamaño grande y muy refrescante.",
    longDesc:
      "Mango fresco batido con hielo hasta lograr una textura suave y refrescante. Sin café, ideal para quienes buscan algo frutal y ligero.",
    sizes: [
      { name: "Mediana", delta: 0 },
      { name: "Grande", delta: 15 },
    ],
    extras: [{ name: "Toque de chile/tajín", delta: 5 }],
    tags: [],
  },
  {
    id: "smoothie-berries",
    name: "Dúo Smoothie Mango & Berries",
    category: "smoothies",
    price: 70,
    img: "assets/img/smoothies-variedad.jpeg",
    shortDesc: "Elige entre mango dorado o mezcla de berries silvestres.",
    longDesc:
      "Fruta natural batida con hielo, sin lácteos añadidos. Disponible en mango dorado o una mezcla de berries silvestres con un toque ácido y dulce a la vez.",
    sizes: [
      { name: "Mediana", delta: 0 },
      { name: "Grande", delta: 15 },
    ],
    extras: [
      { name: "Sabor: Mango", delta: 0 },
      { name: "Sabor: Berries mixtos", delta: 0 },
    ],
    tags: [],
  },
  {
    id: "te-helado-casa",
    name: "Té Helado de la Casa",
    category: "smoothies",
    price: 45,
    img: "assets/img/te-helado.jpeg",
    shortDesc: "Té helado suave, preparado al momento con hielo.",
    longDesc:
      "Té negro o verde preparado al momento y servido sobre hielo. Ligero, aromático y perfecto para acompañar cualquier antojo dulce o salado.",
    sizes: [
      { name: "Mediana", delta: 0 },
      { name: "Grande", delta: 10 },
    ],
    extras: [
      { name: "Endulzado", delta: 0 },
      { name: "Rodaja de limón", delta: 0 },
    ],
    tags: [],
  },

  {
    id: "crepa-nutella-fresa",
    name: "Crepa de Nutella y Fresa",
    category: "crepas",
    price: 85,
    img: "assets/img/crepa-nutella-cappuccino.jpeg",
    shortDesc: "Crepa dulce rellena de Nutella, fresas y crema batida.",
    longDesc:
      "Crepa artesanal hecha al momento, rellena con Nutella y fresas frescas, terminada con azúcar glass, crema batida y un decorado de chocolate. Ideal para compartir con un buen café.",
    sizes: [],
    extras: [
      { name: "Fruta extra", delta: 20 },
      { name: "Nutella extra", delta: 15 },
      { name: "Combo con cappuccino", delta: 55 },
    ],
    tags: ["Favorito"],
  },
  {
    id: "crepa-salada",
    name: "Crepa Salada Pateplumas",
    category: "crepas",
    price: 95,
    img: "assets/img/crepa-salada-ensalada.jpeg",
    shortDesc: "Crepa salada de pollo y queso, acompañada de ensalada fresca.",
    longDesc:
      "Crepa rellena de pollo, queso derretido y un toque de crema, gratinada y acompañada de una ensalada fresca con tomate, lechuga y crutones. Una opción completa para el almuerzo.",
    sizes: [],
    extras: [
      { name: "Extra queso", delta: 15 },
      { name: "Cambiar ensalada por papas", delta: 20 },
    ],
    tags: [],
  },
  {
    id: "crepa-celebracion",
    name: "Crepa de Celebración",
    category: "crepas",
    price: 90,
    img: "assets/img/crepa-cumpleanos.jpeg",
    shortDesc: "Crepa dulce personalizable, perfecta para regalar o celebrar.",
    longDesc:
      "Crepa de chocolate y fresa presentada en caja especial, ideal para cumpleaños y celebraciones. Puedes agregar un mensaje escrito a mano para sorprender a alguien especial.",
    sizes: [],
    extras: [
      { name: "Mensaje personalizado en la caja", delta: 0 },
      { name: "Agregar bebida del día", delta: 45 },
    ],
    tags: ["Especial"],
  },

  {
    id: "desayuno-tipico",
    name: "Desayuno Típico Catracho",
    category: "desayunos",
    price: 95,
    img: "assets/img/desayuno-tipico.jpeg",
    shortDesc: "Huevos, frijoles, queso, aguacate, plátano y salchicha.",
    longDesc:
      "Nuestro desayuno tradicional: huevos revueltos, frijoles refritos, queso fresco, aguacate, plátano frito y salchicha, acompañado de crema. Una forma auténtica de empezar el día.",
    sizes: [],
    extras: [
      { name: "Extra tortillas", delta: 10 },
      { name: "Extra huevo", delta: 15 },
      { name: "Agregar café incluido", delta: 30 },
    ],
    tags: ["Favorito"],
  },
  {
    id: "pancakes",
    name: "Pancakes Pateplumas",
    category: "desayunos",
    price: 85,
    img: "assets/img/desayuno-pancakes.jpeg",
    shortDesc: "Pancakes esponjosos con fruta fresca, plátano y salchicha.",
    longDesc:
      "Torre de pancakes esponjosos servidos con miel, fruta fresca de temporada, plátano frito, huevos y salchicha. Un desayuno dulce y salado a la vez.",
    sizes: [],
    extras: [
      { name: "Extra pancake", delta: 20 },
      { name: "Miel de maple extra", delta: 10 },
      { name: "Agregar café incluido", delta: 30 },
    ],
    tags: [],
  },

  {
    id: "panini",
    name: "Panini Pateplumas",
    category: "sandwiches",
    price: 75,
    img: "assets/img/sandwich-panini.jpeg",
    shortDesc: "Sándwich panini prensado, perfecto para cualquier hora del día.",
    longDesc:
      "Pan artesanal prensado con relleno de la casa, servido caliente y crujiente. Podemos personalizar la caja con un mensaje especial si es para regalar o celebrar.",
    sizes: [],
    extras: [
      { name: "Extra queso", delta: 10 },
      { name: "Agregar papas fritas", delta: 25 },
      { name: "Mensaje personalizado en la caja", delta: 0 },
    ],
    tags: [],
  },

  {
    id: "cheesecake-trio",
    name: "Cheesecake (Chocolate, Caramelo o Fresa)",
    category: "postres",
    price: 55,
    img: "assets/img/cheesecakes-variedad.jpeg",
    shortDesc: "Cheesecake cremoso, elige tu topping favorito.",
    longDesc:
      "Base de galleta con relleno cremoso de queso, disponible con topping de chocolate, caramelo o mermelada de fresa, decorado con crema batida y almendras.",
    sizes: [],
    extras: [
      { name: "Sabor: Chocolate", delta: 0 },
      { name: "Sabor: Caramelo", delta: 0 },
      { name: "Sabor: Fresa", delta: 0 },
    ],
    tags: ["Favorito"],
  },
  {
    id: "tiramisu",
    name: "Tiramisú Clásico",
    category: "postres",
    price: 60,
    img: "assets/img/tiramisu.jpeg",
    shortDesc: "Capas de bizcocho de café, mascarpone y cacao.",
    longDesc:
      "Nuestra versión del clásico postre italiano: capas de bizcocho empapado en café, crema de mascarpone y un generoso baño de chocolate. Suave, intenso y con el sabor del café en cada bocado.",
    sizes: [],
    extras: [],
    tags: [],
  },
  {
    id: "pastel-chocolate",
    name: "Pastel de Chocolate con Helado",
    category: "postres",
    price: 65,
    img: "assets/img/pastel-chocolate-cappuccino.jpeg",
    shortDesc: "Pastel húmedo de chocolate con bola de helado y salsa de chocolate.",
    longDesc:
      "Pastel de chocolate húmedo bañado en salsa de chocolate, servido con una bola de helado de vainilla. El acompañante perfecto para tu café favorito.",
    sizes: [],
    extras: [{ name: "Bola de helado extra", delta: 20 }],
    tags: [],
  },
];

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function getProductsByCategory(catId) {
  if (!catId || catId === "todos") return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === catId);
}
