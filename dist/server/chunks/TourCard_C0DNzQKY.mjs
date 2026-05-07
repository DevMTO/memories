import { f as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate, i as createAstro } from './astro/server_C1WEZ-ys.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                          */

const $$Astro = createAstro();
const $$TourCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$TourCard;
  const { tour } = Astro2.props;
  const imageUrl = tour.imageUrl && tour.imageUrl.trim() !== "" && !tour.imageUrl.includes("---") ? tour.imageUrl : "/images/cusco.png";
  const durationLabel = tour.durationNights ? `${tour.durationDays || 1} D\xCDAS` : `${tour.durationDays || 1} D\xCDAS`;
  const locationLabel = tour.destinationName || tour.location || "Per\xFA";
  const description = tour.shortDescription || tour.description || "Descubre una experiencia dise\xF1ada con detalle, comodidad y autenticidad.";
  const priceLabel = tour.price && tour.price > 0 ? `$ ${tour.price.toLocaleString()}` : "A medida";
  const detailUrl = `/tours/${tour.slug || tour.id}`;
  return renderTemplate`${maybeRenderHead()}<article class="tour-card"> <a${addAttribute(detailUrl, "href")} class="tour-card__image"> <img${addAttribute(imageUrl, "src")}${addAttribute(tour.title, "alt")}> <span class="tour-card__badge"> ${durationLabel} </span> </a> <div class="tour-card__body"> <span class="tour-card__location"> ${locationLabel.toUpperCase()} </span> <h3> <a${addAttribute(detailUrl, "href")}> ${tour.title} </a> </h3> <p>${description}</p> <div class="tour-card__footer"> <div class="tour-card__price"> <span>${tour.price && tour.price > 0 ? "Desde" : "Consultar"}</span> <strong>${priceLabel}</strong> </div> <a${addAttribute(detailUrl, "href")} class="tour-card__arrow"${addAttribute(`Ver ${tour.title}`, "aria-label")}>
→
</a> </div> </div> </article>`;
}, "C:/Users/ebell/Documents/memories/src/components/TourCard.astro", void 0);

export { $$TourCard as $ };
