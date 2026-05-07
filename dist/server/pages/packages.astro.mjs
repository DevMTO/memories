import { f as createComponent, j as renderComponent, r as renderTemplate, i as createAstro, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_C1WEZ-ys.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_BahN8DX9.mjs';
import { $ as $$PackageCard } from '../chunks/PackageCard_7MN7CvXH.mjs';
import { g as getToursUseCase } from '../chunks/di_DHYkYTA0.mjs';
/* empty css                                    */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Packages = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Packages;
  const url = Astro2.url;
  const selectedStyle = url.searchParams.get("style") || "";
  const selectedDestination = url.searchParams.get("destination") || "";
  const maxPrice = Number(url.searchParams.get("price") || "10000");
  const allPackagesRaw = await getToursUseCase.executePackages();
  const allPackages = (allPackagesRaw || []).filter((pkg) => pkg?.isActive !== false);
  const destinations = Array.from(
    new Set(
      allPackages.flatMap((pkg) => {
        const fromDestinations = pkg.destinations?.map((d) => d.name) ?? [];
        const fromSingle = pkg.destinationName ? [pkg.destinationName] : [];
        return [...fromDestinations, ...fromSingle];
      })
    )
  ).filter(Boolean);
  const styles = Array.from(
    new Set(
      allPackages.flatMap((pkg) => pkg.features ?? [])
    )
  ).filter(Boolean);
  const filteredPackages = allPackages.filter((pkg) => {
    const pkgDestinations = [
      ...pkg.destinations?.map((d) => d.name.toLowerCase()) ?? [],
      ...pkg.destinationName ? [pkg.destinationName.toLowerCase()] : []
    ];
    const pkgFeatures = (pkg.features ?? []).map((item) => item.toLowerCase());
    const matchesStyle = selectedStyle ? pkgFeatures.includes(selectedStyle.toLowerCase()) : true;
    const matchesDestination = selectedDestination ? pkgDestinations.includes(selectedDestination.toLowerCase()) : true;
    const matchesPrice = pkg.price ? pkg.price <= maxPrice : true;
    return matchesStyle && matchesDestination && matchesPrice;
  });
  const displayPackages = filteredPackages.length > 0 ? filteredPackages : allPackages;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Nuestros Paquetes | Memories Travel Per\xFA", "mainClass": "packages-page" }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="packages-hero"> <div class="packages-hero__overlay"></div> <div class="container packages-hero__content"> <h1>NUESTROS PAQUETES</h1> </div> </section>  <section class="packages-section"> <div class="container packages-layout"> <!-- SIDEBAR --> <aside class="packages-sidebar"> <form method="GET" class="filters-box"> <div class="filter-group"> <h3>Travel Styles</h3> <div class="filter-options"> <label class="filter-check"> <input type="radio" name="style" value=""${addAttribute(selectedStyle === "", "checked")}> <span>Todos</span> </label> ${styles.slice(0, 6).map((style) => renderTemplate`<label class="filter-check"> <input type="radio" name="style"${addAttribute(style, "value")}${addAttribute(selectedStyle === style, "checked")}> <span>${style}</span> </label>`)} </div> </div> <div class="filter-group"> <h3>Country / Destination</h3> <div class="filter-options"> <label class="filter-check"> <input type="radio" name="destination" value=""${addAttribute(selectedDestination === "", "checked")}> <span>Todos</span> </label> ${destinations.slice(0, 8).map((destination) => renderTemplate`<label class="filter-check"> <input type="radio" name="destination"${addAttribute(destination, "value")}${addAttribute(selectedDestination === destination, "checked")}> <span>${destination}</span> </label>`)} </div> </div> <div class="filter-group"> <h3>Price</h3> <div class="filter-price"> <input type="range" name="price" min="0" max="10000" step="100"${addAttribute(maxPrice, "value")} onInput="this.nextElementSibling.value = this.value"> <output>$${maxPrice}</output> </div> <div class="filter-price-labels"> <span>$ 0</span> <span>$ 10000</span> </div> </div> <div class="filter-actions"> <button type="submit" class="filter-btn">
Buscar
</button> <a href="/packages" class="filter-reset">
Limpiar filtros
</a> </div> </form> </aside> <!-- GRID --> <div class="packages-main"> <div class="packages-grid"> ${displayPackages.map((pkg) => renderTemplate`${renderComponent($$result2, "PackageCard", $$PackageCard, { "pkg": pkg })}`)} </div> </div> </div> </section> ` })}`;
}, "C:/Users/ebell/Documents/memories/src/pages/packages.astro", void 0);

const $$file = "C:/Users/ebell/Documents/memories/src/pages/packages.astro";
const $$url = "/packages";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Packages,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
