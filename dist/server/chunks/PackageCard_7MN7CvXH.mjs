import { f as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate, i as createAstro } from './astro/server_C1WEZ-ys.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                          */

const $$Astro = createAstro();
const $$PackageCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PackageCard;
  const { pkg } = Astro2.props;
  const imageUrl = pkg.imageUrl && pkg.imageUrl.trim() !== "" && !pkg.imageUrl.includes("---") ? pkg.imageUrl : "/images/cusco.png";
  const durationLabel = pkg.durationNights ? `${pkg.durationDays || 1} D\xCDAS` : `${pkg.durationDays || 1} D\xCDAS`;
  const locationLabel = pkg.destinations?.map((d) => d.name).slice(0, 1).join(", ") || "Per\xFA";
  const description = pkg.shortDescription || pkg.description || "Descubre una experiencia dise\xF1ada con detalle, comodidad y autenticidad.";
  const priceLabel = pkg.price && pkg.price > 0 ? `$ ${pkg.price.toLocaleString()}` : "A medida";
  return renderTemplate`${maybeRenderHead()}<article class="package-card"> <a${addAttribute(`/packages/${pkg.slug || pkg.id}`, "href")} class="package-card__image"> <img${addAttribute(imageUrl, "src")}${addAttribute(pkg.title, "alt")}> <span class="package-card__badge"> ${durationLabel} </span> </a> <div class="package-card__body"> <span class="package-card__location"> ${locationLabel.toUpperCase()} </span> <h3> <a${addAttribute(`/packages/${pkg.slug || pkg.id}`, "href")}> ${pkg.title} </a> </h3> <p>${description}</p> <div class="package-card__footer"> <div class="package-card__price"> <span>Desde</span> <strong>${priceLabel}</strong> </div> <a${addAttribute(`/packages/${pkg.slug || pkg.id}`, "href")} class="package-card__arrow"${addAttribute(`Ver ${pkg.title}`, "aria-label")}>
→
</a> </div> </div> </article>`;
}, "C:/Users/ebell/Documents/memories/src/components/PackageCard.astro", void 0);

export { $$PackageCard as $ };
