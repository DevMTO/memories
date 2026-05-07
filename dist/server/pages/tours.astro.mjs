import { f as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute, k as Fragment } from '../chunks/astro/server_C1WEZ-ys.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_BahN8DX9.mjs';
import { $ as $$TourCard } from '../chunks/TourCard_C0DNzQKY.mjs';
import { g as getToursUseCase } from '../chunks/di_DHYkYTA0.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const allToursRaw = await getToursUseCase.executeAll();
  const activeTours = (allToursRaw || []).filter((tour) => tour?.isActive !== false);
  const destinations = Array.from(
    new Set(
      activeTours.map((tour) => tour.destinationName || tour.location || "Per\xFA").filter(Boolean)
    )
  );
  const styles = [
    {
      label: "Vacaciones",
      value: "vacaciones viaje experiencia tour turistico tur\xEDstico"
    },
    {
      label: "Honeymoon",
      value: "honeymoon pareja romantico rom\xE1ntico privado aguas calientes machu picchu"
    },
    {
      label: "Family",
      value: "familia family compartido cultural historia city tour"
    },
    {
      label: "Tours",
      value: "tour excursi\xF3n excursion full day trekking aventura"
    }
  ];
  const fallbackImages = [
    "/images/cusco.png",
    "/images/vinicunca.png",
    "/images/lima.png",
    "/images/ica.png",
    "/images/puno.png",
    "/images/arequipa.png"
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Nuestros Tours | Memories Travel Per\xFA", "mainClass": "tours-page" }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="tours-hero"> <div class="tours-hero__overlay"></div> <div class="container tours-hero__content"> <h1>NUESTROS TOURS</h1> </div> </section>  <section class="tours-section"> <div class="container tours-layout"> <!-- SIDEBAR --> <aside class="tours-sidebar"> <div class="filters-box"> <div class="filter-group"> <h3>Travel Styles</h3> <div class="filter-options"> ${styles.map((style) => renderTemplate`<label class="filter-check"> <input type="checkbox" data-filter="style"${addAttribute(style.value, "value")}> <span>${style.label}</span> </label>`)} </div> </div> <div class="filter-group"> <h3>Country</h3> <div class="filter-options"> ${destinations.slice(0, 8).map((destination) => renderTemplate`<label class="filter-check"> <input type="checkbox" data-filter="destination"${addAttribute(destination.toLowerCase(), "value")}> <span>${destination}</span> </label>`)} </div> </div> <div class="filter-group"> <h3>Duration</h3> <div class="filter-options"> <label class="filter-check"> <input type="checkbox" data-filter="duration" value="1"> <span>Full Day</span> </label> <label class="filter-check"> <input type="checkbox" data-filter="duration" value="2"> <span>2 días / 1 noche</span> </label> <label class="filter-check"> <input type="checkbox" data-filter="durationRange" value="3"> <span>3 días a más</span> </label> </div> </div> <div class="filter-group"> <h3>Price</h3> <div class="filter-price"> <input id="priceRange" type="range" min="0" max="5000" step="100" value="5000"> </div> <div class="filter-price-labels"> <span>$ 0</span> <span>$ 5000</span> </div> </div> <div class="filter-actions"> <button type="button" class="filter-btn" id="clearFilters">
Buscar
</button> <button type="button" class="filter-reset" id="resetFilters">
Limpiar filtros
</button> </div> </div> </aside> <!-- GRID --> <div class="tours-main"> ${activeTours.length > 0 ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <div class="tours-grid" id="toursGrid"> ${activeTours.map((tour, index) => {
    const cleanImage = tour.imageUrl && tour.imageUrl.trim() !== "" && !tour.imageUrl.includes("---") ? tour.imageUrl : fallbackImages[index % fallbackImages.length];
    const searchableText = [
      tour.title,
      tour.description,
      tour.shortDescription,
      tour.destinationName,
      tour.destinationSlug,
      tour.location,
      ...tour.cities || [],
      ...tour.features || [],
      ...tour.highlights || []
    ].filter(Boolean).join(" ").toLowerCase();
    return renderTemplate`<div class="tour-filter-item"${addAttribute(searchableText, "data-search")}${addAttribute((tour.destinationName || tour.location || "").toLowerCase(), "data-destination")}${addAttribute(String(tour.durationDays || ""), "data-duration")}${addAttribute(String(tour.price || 0), "data-price")}> ${renderComponent($$result3, "TourCard", $$TourCard, { "tour": { ...tour, imageUrl: cleanImage } })} </div>`;
  })} </div> <div class="tours-empty tours-empty--hidden" id="toursEmpty"> <h3>No encontramos tours con esos filtros</h3> <p>
Prueba quitando algún filtro o solicita una propuesta personalizada.
</p> </div> ` })}` : renderTemplate`<div class="tours-empty"> <h3>No hay tours disponibles</h3> <p>
Revisa que tu mock data tenga tours activos o que el método
                executeAll() esté retornando información correctamente.
</p> </div>`} </div> </div> </section> ` })} `;
}, "C:/Users/ebell/Documents/memories/src/pages/tours/index.astro", void 0);

const $$file = "C:/Users/ebell/Documents/memories/src/pages/tours/index.astro";
const $$url = "/tours";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
