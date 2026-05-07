import { f as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_C1WEZ-ys.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_BahN8DX9.mjs';
import { g as getToursUseCase } from '../chunks/di_DHYkYTA0.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const featuredTours = await getToursUseCase.executeFeatured();
  const packages = await getToursUseCase.executePackages();
  const displayTours = (featuredTours || []).filter((tour) => tour.isActive !== false).slice(0, 3);
  const activePackages = (packages || []).filter((pkg) => pkg.isActive !== false);
  const normalizeSlug = (value = "") => value.toString().trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const getDestinationImage = (slug = "") => {
    const cleanSlug = normalizeSlug(slug);
    const imageMap = {
      cusco: "/images/cusco/cusco.png",
      lima: "/images/lima/lima.png",
      ica: "/images/ica/ica.png",
      puno: "/images/puno/puno.png",
      arequipa: "/images/arequipa/arequipa.png",
      paracas: "/images/ica/ica.png",
      nazca: "/images/ica/ica.png",
      huacachina: "/images/ica/ica.png",
      "machu-picchu": "/images/cusco/cusco.png",
      vinicunca: "/images/cusco/cusco.png",
      palccoyo: "/images/cusco/cusco.png",
      waqrapukara: "/images/cusco/cusco.png"
    };
    return imageMap[cleanSlug] || `/images/${cleanSlug}/${cleanSlug}.png`;
  };
  const destinationMap = /* @__PURE__ */ new Map();
  activePackages.forEach((pkg) => {
    const packageDestinations = pkg.destinations ?? [];
    if (packageDestinations.length > 0) {
      packageDestinations.forEach((destination) => {
        const slug = normalizeSlug(destination.slug || destination.name);
        if (!slug || destinationMap.has(slug)) return;
        destinationMap.set(slug, {
          id: destination.id || slug,
          name: destination.name,
          slug,
          imageUrl: getDestinationImage(slug)
        });
      });
    }
    if (pkg.destinationName || pkg.destinationSlug) {
      const slug = normalizeSlug(pkg.destinationSlug || pkg.destinationName);
      if (slug && !destinationMap.has(slug)) {
        destinationMap.set(slug, {
          id: slug,
          name: pkg.destinationName || slug,
          slug,
          imageUrl: getDestinationImage(slug)
        });
      }
    }
  });
  const destinationPriority = ["cusco", "lima", "ica", "puno", "arequipa"];
  const displayDestinations = destinationPriority.map((slug) => destinationMap.get(slug)).filter(Boolean);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Memories Travel Per\xFA | Agencia de viajes en Per\xFA", "mainClass": "home-main" }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="home-hero"> <div class="home-hero__overlay"></div> <div class="container home-hero__content reveal-up"> <span class="home-eyebrow">Agencia de viajes / Tour operador</span> <h1>
MEMORIES
<span>Travel Perú</span> </h1> <p>
Experiencias curadas y exclusivas. Conectamos tu espíritu con la esencia
        viva y eterna del Perú.
</p> <a href="/packages" class="home-btn home-btn--primary">
Design Trip
</a> </div> </section>  <section class="recognitions-section reveal-up"> <div class="container recognitions-inner"> <span>Reconocidos estratégicamente por</span> <div class="recognitions-logos"> <img src="/images/mincetur.png" alt="Mincetur"> <img src="/images/promperu.png" alt="PromPerú"> <img src="/images/marcaperu.png" alt="Marca Perú"> <img src="/images/tripadvisor.png" alt="Tripadvisor"> </div> </div> </section>  <section class="transform-section reveal-up"> <div class="container transform-grid"> <div class="transform-copy"> <span class="home-eyebrow">Experiencias exclusivas</span> <h2>
Viajes Que
<span>Transforman</span> </h2> <p>
Somos arquitectos de experiencias. No solo vendemos tours, diseñamos
          momentos que se convierten en recuerdos imborrables.
</p> <div class="transform-stats"> <div> <strong>Nuestros Tours</strong> <span>Guías nativos certificados</span> </div> <div> <strong>Sin Límites</strong> <span>Personalización total</span> </div> </div> <a href="/destinations" class="text-link">
Ver más destinos →
</a> </div> <div class="transform-image"> <img src="/images/viajes.png" alt="Viajes que transforman"> </div> </div> </section>  <section class="home-tours-section reveal-up"> <div class="container"> <div class="home-section-header home-section-header--center"> <span class="home-eyebrow home-eyebrow--dark">Experiencias exclusivas</span> <h2>Nuestros Tours</h2> <p>
Itinerarios diseñados meticulosamente para viajeros que buscan
          autenticidad.
</p> </div> <div class="home-tours-grid"> ${displayTours.map((tour, index) => {
    const fallbackImages = [
      "/images/cusco.png",
      "/images/vinicunca.png",
      "/images/lima.png"
    ];
    const imageUrl = tour.imageUrl && tour.imageUrl.trim() !== "" && !tour.imageUrl.includes("---") ? tour.imageUrl : fallbackImages[index] || "/public/images/cusco/cusco.png";
    const priceLabel = tour.price && tour.price > 0 ? `$ ${tour.price.toLocaleString()}` : "A medida";
    const durationLabel = tour.durationNights ? `${tour.durationDays}D / ${tour.durationNights}N` : `${tour.durationDays || 1} D\xCDA${tour.durationDays === 1 ? "" : "S"}`;
    return renderTemplate`<article class="home-tour-card"> <a${addAttribute(`/tours/${tour.slug || tour.id}`, "href")} class="home-tour-card__image"> <img${addAttribute(imageUrl, "src")}${addAttribute(tour.title, "alt")}> <span class="home-tour-card__badge"> ${durationLabel} </span> </a> <div class="home-tour-card__body"> <span class="home-tour-card__location"> ${(tour.destinationName || tour.location || "Per\xFA").toUpperCase()} </span> <h3> <a${addAttribute(`/tours/${tour.slug || tour.id}`, "href")}> ${tour.title} </a> </h3> <p> ${tour.shortDescription || tour.description || "Descubre Per\xFA con una experiencia dise\xF1ada a tu medida."} </p> <div class="home-tour-card__footer"> <div> <span>${tour.price && tour.price > 0 ? "Desde" : "Consultar"}</span> <strong>${priceLabel}</strong> </div> <a${addAttribute(`/tours/${tour.slug || tour.id}`, "href")}${addAttribute(`Ver ${tour.title}`, "aria-label")}>
→
</a> </div> </div> </article>`;
  })} </div> </div> </section>  <section class="home-destinations-section reveal-up"> <div class="home-destinations-bg"></div> <div class="container"> <div class="home-section-header destinations-header"> <div> <span class="home-eyebrow home-eyebrow--dark">Colección 2026</span> <h2>
Destinos
<span>Icónicos</span> </h2> </div> <a href="/destinations" class="destinations-link">
Ver más destinos
</a> </div> ${displayDestinations.length > 0 ? renderTemplate`<div class="home-destinations-grid"> ${displayDestinations.map((destination, index) => renderTemplate`<a${addAttribute(`/destinations/${destination.slug}`, "href")}${addAttribute(`destination-card ${index === 0 ? "destination-card--large" : index === 1 ? "destination-card--wide" : ""}`, "class")}> <img${addAttribute(destination.imageUrl, "src")}${addAttribute(destination.name, "alt")}> <h3>${destination.name}</h3> </a>`)} </div>` : renderTemplate`<div class="home-destinations-empty"> <p>No hay destinos disponibles en los paquetes activos.</p> </div>`} </div> </section> ` })}  `;
}, "C:/Users/ebell/Documents/memories/src/pages/index.astro", void 0);

const $$file = "C:/Users/ebell/Documents/memories/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
