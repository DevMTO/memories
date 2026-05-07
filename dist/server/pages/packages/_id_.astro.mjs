import { f as createComponent, j as renderComponent, r as renderTemplate, i as createAstro, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_C1WEZ-ys.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BahN8DX9.mjs';
import { g as getToursUseCase } from '../../chunks/di_DHYkYTA0.mjs';
/* empty css                                   */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const packages = await getToursUseCase.executePackages();
  const pkg = id ? await getToursUseCase.executePackageBySlug(id) || packages.find((item) => item.id === id) || null : null;
  if (!pkg) {
    return Astro2.redirect("/packages");
  }
  const destinations = pkg.destinations ?? [];
  const features = pkg.features ?? [];
  const highlights = pkg.highlights ?? [];
  const itinerary = pkg.itinerary ?? [];
  const includes = pkg.includes ?? [];
  const notIncludes = pkg.notIncludes ?? [];
  const gallery = pkg.gallery ?? [];
  const heroImage = pkg.imageUrl && pkg.imageUrl.trim() !== "" && !pkg.imageUrl.includes("---") ? pkg.imageUrl : "/images/cusco.png";
  const durationDays = pkg.durationDays || 1;
  const durationNights = pkg.durationNights || 0;
  const durationText = durationNights ? `${durationDays} d\xEDas / ${durationNights} noches` : `${durationDays} d\xEDa${durationDays === 1 ? "" : "s"}`;
  const heroDuration = durationNights ? `${durationDays} d\xEDas / ${durationNights} noches` : `${durationDays} d\xEDas`;
  const destinationText = destinations.length > 0 ? destinations.map((destination) => destination.name).slice(0, 4).join(", ") : "Per\xFA";
  const whatsappMessage = `Hola, quiero informaci\xF3n sobre el paquete: ${pkg.title}`;
  const galleryImages = gallery.length > 0 ? gallery : [
    "/images/cusco.png",
    "/images/hero.png",
    "/images/lima.png"
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${pkg.title} | Memories Travel Per\xFA`, "mainClass": "package-detail-main" }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="package-hero"${addAttribute(`background-image: url('${heroImage}');`, "style")}> <div class="package-hero__overlay"></div> <div class="container package-hero__content"> <span class="package-hero__eyebrow"> ${heroDuration.toUpperCase()} ${durationNights ? "(PRIVADO O GRUPO PEQUE\xD1O)" : "(EXPERIENCIA PERSONALIZADA)"} </span> <h1>${pkg.title}</h1> <p> ${pkg.shortDescription || "Experiencias curadas y exclusivas. Conectamos tu esp\xEDritu con la esencia viva y eterna del Per\xFA."} </p> </div> </section>  <div class="container package-info-wrapper"> <div class="package-info-bar"> <div class="package-info-item"> <span class="package-info-icon">♧</span> <span class="package-info-label">Duración</span> <span class="package-info-value">${durationText}</span> </div> <div class="package-info-item"> <span class="package-info-icon">⌁</span> <span class="package-info-label">Destinos</span> <span class="package-info-value">${destinationText}</span> </div> <div class="package-info-item"> <span class="package-info-icon">□</span> <span class="package-info-label">Servicio</span> <span class="package-info-value">${features[0] || "Programa tur\xEDstico"}</span> </div> <div class="package-info-item"> <span class="package-info-icon">◇</span> <span class="package-info-label">Modalidad</span> <span class="package-info-value"> ${pkg.price && pkg.price > 0 ? `Desde $ ${pkg.price.toLocaleString()}` : "A medida"} </span> </div> </div> </div>  <section class="package-detail-section"> <div class="container package-detail-layout"> <main class="package-main-content"> <section class="package-copy-block"> <h2>Sobre esta experiencia</h2> <p> ${pkg.description || "Sum\xE9rjase en una experiencia cuidadosamente dise\xF1ada para descubrir Per\xFA con comodidad, autenticidad y acompa\xF1amiento experto."} </p> ${highlights.length > 0 && renderTemplate`<div class="package-mini-highlights"> ${highlights.slice(0, 4).map((highlight) => renderTemplate`<span>${highlight}</span>`)} </div>`} </section> ${itinerary.length > 0 && renderTemplate`<section class="package-itinerary-block"> <h2>Itinerario Detallado</h2> <div class="package-timeline"> ${itinerary.slice(0, 6).map((day) => {
    const dayMeals = day.meals ?? [];
    return renderTemplate`<article class="timeline-item"> <div class="timeline-marker"> ${String(day.day).padStart(2, "0")} </div> <div class="timeline-content"> <h3>${day.title}</h3> <p>${day.description}</p> ${(day.accommodations || dayMeals.length > 0) && renderTemplate`<div class="timeline-meta"> ${day.accommodations && renderTemplate`<span>⌂ ${day.accommodations}</span>`} ${dayMeals.length > 0 && renderTemplate`<span>☕ ${dayMeals.join(", ")}</span>`} </div>`} </div> </article>`;
  })} </div> </section>`} ${includes.length > 0 || notIncludes.length > 0 ? renderTemplate`<section class="package-service-block"> <h2>Información del servicio</h2> <div class="package-service-grid"> ${includes.length > 0 && renderTemplate`<article> <h3>Incluye</h3> <ul> ${includes.slice(0, 8).map((item) => renderTemplate`<li>${item}</li>`)} </ul> </article>`} ${notIncludes.length > 0 && renderTemplate`<article> <h3>No incluye</h3> <ul> ${notIncludes.slice(0, 8).map((item) => renderTemplate`<li>${item}</li>`)} </ul> </article>`} </div> </section>` : null} <section class="package-gallery-block"> <h2>Highlights del Recorrido</h2> <div class="package-gallery"> <img${addAttribute(galleryImages[0] || heroImage, "src")}${addAttribute(pkg.title, "alt")} class="package-gallery__large"> <div class="package-gallery__side"> <img${addAttribute(galleryImages[1] || "/images/hero.png", "src")}${addAttribute(pkg.title, "alt")}> <img${addAttribute(galleryImages[2] || "/images/cusco.png", "src")}${addAttribute(pkg.title, "alt")}> </div> </div> </section> </main> <aside class="package-sidebar"> <div class="booking-widget"> <h3>Diseñe Su Viaje</h3> <p>Consultoría Gratuita Experta</p> <form class="booking-form"> <div class="booking-field"> <label>N° DE VIAJEROS</label> <input type="number" placeholder="2 adultos"> </div> <div class="booking-field"> <label>FECHA DE VIAJE</label> <input type="text" placeholder="dd/mm/yy"> </div> <a${addAttribute(`https://wa.me/51984544245?text=${encodeURIComponent(whatsappMessage)}`, "href")} target="_blank" rel="noopener noreferrer" class="booking-btn">
Solicitar mi propuesta personalizada
</a> <span>Sin cargos ocultos. Confirmación en 24h.</span> </form> </div> <div class="help-card"> <div class="help-card__icon">□</div> <h3>¿Necesita ayuda?</h3> <p>
Nuestros expertos en Cusco están listos para personalizar su itinerario.
</p> <a${addAttribute(`https://wa.me/51984544245?text=${encodeURIComponent(whatsappMessage)}`, "href")} target="_blank" rel="noopener noreferrer">
Contactar asesor
</a> </div> </aside> </div> </section> ` })}`;
}, "C:/Users/ebell/Documents/memories/src/pages/packages/[id].astro", void 0);

const $$file = "C:/Users/ebell/Documents/memories/src/pages/packages/[id].astro";
const $$url = "/packages/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
