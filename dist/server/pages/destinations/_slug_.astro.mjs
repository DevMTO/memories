import { f as createComponent, j as renderComponent, r as renderTemplate, i as createAstro, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_C1WEZ-ys.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BahN8DX9.mjs';
import { $ as $$PackageCard } from '../../chunks/PackageCard_7MN7CvXH.mjs';
import { $ as $$TourCard } from '../../chunks/TourCard_C0DNzQKY.mjs';
import { g as getToursUseCase } from '../../chunks/di_DHYkYTA0.mjs';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const normalizeSlug = (value = "") => value.toString().trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const destinationSlug = normalizeSlug(slug || "");
  const destinationData = {
    cusco: {
      name: "Cusco",
      imageUrl: "/images/cusco/cusco.png",
      eyebrow: "Capital hist\xF3rica del Per\xFA",
      title: "Cusco, la puerta de entrada a los Andes",
      description: "Cusco re\xFAne historia, cultura viva, paisajes andinos y rutas inolvidables hacia Machu Picchu, el Valle Sagrado, monta\xF1as de colores y antiguas ciudades incas.",
      altitude: "3,399 msnm",
      climate: "Templado andino",
      bestSeason: "Abril a octubre"
    },
    lima: {
      name: "Lima",
      imageUrl: "/images/lima/lima.png",
      eyebrow: "Capital gastron\xF3mica y cultural",
      title: "Lima, historia, mar y gastronom\xEDa",
      description: "Lima combina arquitectura colonial, costa del Pac\xEDfico, barrios modernos y una de las escenas gastron\xF3micas m\xE1s reconocidas de Sudam\xE9rica.",
      altitude: "154 msnm",
      climate: "Costero h\xFAmedo",
      bestSeason: "Todo el a\xF1o"
    },
    ica: {
      name: "Ica",
      imageUrl: "/images/ica/ica.png",
      eyebrow: "Desierto, aventura y costa",
      title: "Ica, Paracas y Huacachina",
      description: "Ica es ideal para vivir el desierto, navegar hacia Islas Ballestas, conocer vi\xF1edos, disfrutar Huacachina y conectar con la costa peruana.",
      altitude: "406 msnm",
      climate: "C\xE1lido seco",
      bestSeason: "Todo el a\xF1o"
    },
    puno: {
      name: "Puno",
      imageUrl: "/images/puno/puno.png",
      eyebrow: "Cultura viva del Titicaca",
      title: "Puno y el Lago Titicaca",
      description: "Puno invita a descubrir comunidades, islas flotantes, tradiciones textiles y la inmensidad del lago navegable m\xE1s alto del mundo.",
      altitude: "3,827 msnm",
      climate: "Fr\xEDo andino",
      bestSeason: "Abril a octubre"
    },
    arequipa: {
      name: "Arequipa",
      imageUrl: "/images/arequipa/arequipa.png",
      eyebrow: "Ciudad blanca y paisajes volc\xE1nicos",
      title: "Arequipa, Colca y arquitectura viva",
      description: "Arequipa combina arquitectura colonial, gastronom\xEDa regional, volcanes imponentes y rutas hacia el Ca\xF1\xF3n del Colca.",
      altitude: "2,335 msnm",
      climate: "Templado seco",
      bestSeason: "Abril a noviembre"
    }
  };
  const destination = destinationData[destinationSlug];
  if (!destination) {
    return Astro2.redirect("/");
  }
  const packagesRaw = await getToursUseCase.executePackages();
  const toursRaw = await getToursUseCase.executeAll();
  const activePackages = (packagesRaw || []).filter((pkg) => pkg.isActive !== false);
  const activeTours = (toursRaw || []).filter((tour) => tour.isActive !== false);
  const destinationAliases = {
    cusco: [
      "cusco",
      "machu-picchu",
      "valle-sagrado",
      "laguna-humantay",
      "vinicunca",
      "palccoyo",
      "waqrapukara",
      "maras",
      "moray",
      "aguas-calientes"
    ],
    lima: ["lima"],
    ica: ["ica", "paracas", "nazca", "huacachina"],
    puno: ["puno", "titicaca", "uros", "taquile"],
    arequipa: ["arequipa", "colca", "chivay"]
  };
  const aliases = destinationAliases[destinationSlug] || [destinationSlug];
  const belongsToDestination = (item) => {
    const itemSlugs = [
      item.destinationSlug,
      item.destinationName,
      item.location,
      ...item.cities || [],
      ...item.destinations?.map((d) => d.slug) || [],
      ...item.destinations?.map((d) => d.name) || []
    ].filter(Boolean).map((value) => normalizeSlug(value));
    return itemSlugs.some(
      (itemSlug) => aliases.some((alias) => itemSlug.includes(alias) || alias.includes(itemSlug))
    );
  };
  const destinationPackages = activePackages.filter(belongsToDestination);
  const destinationTours = activeTours.filter(belongsToDestination);
  const fallbackPackageImages = [
    destination.imageUrl,
    "/images/cusco/cusco.png",
    "/images/lima/lima.png",
    "/images/ica/ica.png"
  ];
  const withSafeImage = (item, index) => ({
    ...item,
    imageUrl: item.imageUrl && item.imageUrl.trim() !== "" && !item.imageUrl.includes("---") ? item.imageUrl : fallbackPackageImages[index % fallbackPackageImages.length]
  });
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${destination.name} | Destinos Memories Travel Per\xFA`, "mainClass": "destination-detail-main", "showQuoteForm": false }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="destination-hero"${addAttribute(`background-image: url('${destination.imageUrl}');`, "style")}> <div class="destination-hero__overlay"></div> <div class="container destination-hero__content"> <span>${destination.eyebrow}</span> <h1>${destination.name}</h1> <p>${destination.description}</p> </div> </section> <div class="container destination-info-wrapper"> <div class="destination-info-bar"> <div> <span>Altitud</span> <strong>${destination.altitude || "Variable"}</strong> </div> <div> <span>Clima</span> <strong>${destination.climate || "Seg\xFAn temporada"}</strong> </div> <div> <span>Mejor temporada</span> <strong>${destination.bestSeason || "Todo el a\xF1o"}</strong> </div> <div> <span>Experiencias</span> <strong>${destinationPackages.length + destinationTours.length}</strong> </div> </div> </div> <section class="destination-intro-section"> <div class="container destination-intro-grid"> <div> <span class="destination-eyebrow">Destino destacado</span> <h2>${destination.title}</h2> </div> <p>${destination.description}</p> </div> </section> <section class="destination-products-section"> <div class="container"> <div class="destination-section-header"> <span class="destination-eyebrow">Paquetes disponibles</span> <h2>Viajes a ${destination.name}</h2> <p>
Programas diseñados para conocer este destino con una operación organizada,
          rutas cuidadas y acompañamiento profesional.
</p> </div> ${destinationPackages.length > 0 ? renderTemplate`<div class="destination-grid"> ${destinationPackages.map((pkg, index) => renderTemplate`${renderComponent($$result2, "PackageCard", $$PackageCard, { "pkg": withSafeImage(pkg, index) })}`)} </div>` : renderTemplate`<div class="destination-empty"> <h3>No hay paquetes activos para ${destination.name}</h3> <p>
Puedes solicitar una propuesta personalizada para este destino.
</p> </div>`} </div> </section> ${destinationTours.length > 0 && renderTemplate`<section class="destination-products-section destination-products-section--tours"> <div class="container"> <div class="destination-section-header"> <span class="destination-eyebrow">Experiencias seleccionadas</span> <h2>Tours en ${destination.name}</h2> <p>
Actividades y recorridos para complementar tu visita con cultura,
              paisajes y experiencias locales.
</p> </div> <div class="destination-grid"> ${destinationTours.map((tour, index) => renderTemplate`${renderComponent($$result2, "TourCard", $$TourCard, { "tour": withSafeImage(tour, index) })}`)} </div> </div> </section>`}<section class="destination-tips-section"> <div class="container destination-tips-grid"> <article> <span>Consejo de viaje</span> <h3>Planifica con anticipación</h3> <p>
Algunos ingresos, trenes y horarios pueden tener disponibilidad limitada.
          Reservar con tiempo ayuda a organizar mejor la ruta.
</p> </article> <article> <span>Experiencia local</span> <h3>Viaja con contexto</h3> <p>
Cada destino tiene historia, cultura y particularidades. Un buen guiado
          hace que la experiencia sea más completa y significativa.
</p> </article> <article> <span>Operación</span> <h3>Logística organizada</h3> <p>
Traslados, tiempos de ruta, ingresos y coordinación son claves para que
          el viaje fluya sin preocupaciones.
</p> </article> </div> </section> ` })}`;
}, "C:/Users/ebell/Documents/memories/src/pages/destinations/[slug].astro", void 0);

const $$file = "C:/Users/ebell/Documents/memories/src/pages/destinations/[slug].astro";
const $$url = "/destinations/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
