import { f as createComponent, m as maybeRenderHead, r as renderTemplate, h as addAttribute, l as renderHead, j as renderComponent, n as renderSlot, i as createAstro } from './astro/server_C1WEZ-ys.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                         */

const $$Header = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<header class="site-header"> <div class="header-top"> <div class="container header-top__inner"> <div class="header-top__contact"> <a href="mailto:reservas@memoriestravel.com"> <span>⌕</span>
reservas@memoriestravel.com
</a> <a href="tel:+51984123456"> <span>☏</span>
+51 984 123 456
</a> </div> <div class="header-top__socials"> <a href="#" aria-label="Instagram">IG</a> <a href="#" aria-label="Facebook">FB</a> <a href="#" aria-label="WhatsApp">WA</a> <a href="#" aria-label="YouTube">YT</a> </div> </div> </div> <nav class="main-nav"> <div class="container main-nav__inner"> <a href="/" class="logo" aria-label="Memories Travel Perú">
MEMORIES
</a> <ul class="nav-links"> <li><a href="/packages">Packages</a></li> <li><a href="/tours">Tours</a></li> <li><a href="/flights">Flights</a></li> <li><a href="/about">About us</a></li> <li><a href="/blogs">Blogs</a></li> </ul> <a href="https://wa.me/51984123456" target="_blank" rel="noopener noreferrer" class="design-trip-btn">
Design Trip
</a> </div> </nav> </header>`;
}, "C:/Users/ebell/Documents/memories/src/components/ui/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="footer"> <div class="footer-art" aria-hidden="true"></div> <div class="footer-main"> <div class="footer-content container"> <div class="footer-grid"> <div class="footer-col footer-brand"> <a href="/" class="footer-logo" aria-label="Memories Travel Perú">
MEMORIES
</a> <p>
Comparta sus planes con nosotros. Un especialista en viajes de lujo
            curará una propuesta exclusiva adaptada a sus preferencias.
</p> <div class="socials"> <a href="#" aria-label="Instagram">IG</a> <a href="#" aria-label="Facebook">FB</a> <a href="https://wa.me/51984544245" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">WA</a> <a href="#" aria-label="YouTube">YT</a> </div> </div> <div class="footer-col"> <h4>Explorar</h4> <ul> <li><a href="/destinations">Destinos</a></li> <li><a href="/tours">Experiencias</a></li> <li><a href="/hotels">Hoteles</a></li> <li><a href="/blogs">Blogs</a></li> </ul> </div> <div class="footer-col"> <h4>Empresa</h4> <ul> <li><a href="/about">Quiénes Somos</a></li> <li><a href="/terms">Términos Y Condiciones</a></li> <li><a href="/privacy">Política De Privacidad</a></li> <li><a href="/claims-book">Libro De Reclamaciones</a></li> </ul> </div> <div class="footer-col footer-contact"> <h4>Contacto</h4> <ul> <li><a href="#">Av. El Sol 345, Cusco</a></li> <li><a href="tel:+51984544245">+51 984 544 245</a></li> </ul> </div> </div> </div> </div> <div class="footer-bottom"> <p>© 2026 MEMORABLE TRAVEL PERU</p> </div> </footer>`;
}, "C:/Users/ebell/Documents/memories/src/components/ui/Footer.astro", void 0);

const $$QuoteForm = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="quote-section"> <div class="container"> <div class="quote-box"> <div class="quote-header text-center"> <span class="quote-eyebrow">DISEÑE SU VIAJE</span> <h2 class="quote-title">Solicitar Cotización</h2> <p class="quote-desc">
Comparta Sus Planes Con Nosotros. Un Especialista En Viajes De Lujo
          Curará Una Propuesta Exclusiva Adaptada A Sus Preferencias.
</p> </div> <form class="quote-form"> <div class="quote-grid quote-grid--three"> <div class="form-group form-group--name"> <label class="form-label">NOMBRE COMPLETO</label> <input type="text" class="form-control" placeholder="Ej. Juan Perez"> </div> <div class="form-group form-group--travelers"> <label class="form-label">N° DE VIAJEROS</label> <input type="number" class="form-control text-center" placeholder="3"> </div> <div class="form-group form-group--date"> <label class="form-label">FECHA DE VIAJE</label> <input type="text" class="form-control text-center" placeholder="dd/mm/yy"> </div> </div> <div class="quote-grid quote-grid--two"> <div class="form-group"> <label class="form-label">CORREO ELECTRONICO</label> <input type="email" class="form-control" placeholder="nombre@nombre.com"> </div> <div class="form-group form-group--experience"> <label class="form-label">ESTILO DE EXPERIENCIA</label> <div class="experience-options"> <label class="experience-pill"> <input type="radio" name="style" value="Lujo"> <span class="experience-pill__box"></span> <span>Lujo</span> </label> <label class="experience-pill"> <input type="radio" name="style" value="Aventura"> <span class="experience-pill__box"></span> <span>Aventura</span> </label> <label class="experience-pill"> <input type="radio" name="style" value="Cultural"> <span class="experience-pill__box"></span> <span>Cultural</span> </label> </div> </div> </div> <div class="quote-grid quote-grid--two"> <div class="form-group"> <label class="form-label">TELEFONO / WHATSAPP</label> <input type="tel" class="form-control" placeholder="+51 999 999 999"> </div> <div class="form-group"> <label class="form-label">DESTINO DE INTERÉS</label> <select class="form-control"> <option selected disabled>seleccione uno</option> <option>Cusco</option> <option>Lima</option> <option>Ica</option> <option>Puno</option> <option>Arequipa</option> </select> </div> </div> <div class="form-group form-group--full"> <label class="form-label form-label--center">DESTINO DE INTERÉS</label> <textarea class="form-control form-control--textarea" rows="4" placeholder="¿algún interés especial o requerimiento?"></textarea> </div> <div class="quote-submit text-center"> <button type="submit" class="quote-btn">
SOLICITAR MI PROPUESTA PERSONALIZADA
</button> </div> </form> </div> </div> </section>`;
}, "C:/Users/ebell/Documents/memories/src/components/ui/QuoteForm.astro", void 0);

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title, mainClass, showQuoteForm = true } = Astro2.props;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="description" content="Memories Travel Peru - Experiencias exclusivas de viaje"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title} | Memories Travel Peru</title>${renderHead()}</head> <body> ${renderComponent($$result, "Header", $$Header, {})} <main${addAttribute(mainClass, "class")}> ${renderSlot($$result, $$slots["default"])} </main> ${showQuoteForm && renderTemplate`${renderComponent($$result, "QuoteForm", $$QuoteForm, {})}`} ${renderComponent($$result, "Footer", $$Footer, {})} </body></html>`;
}, "C:/Users/ebell/Documents/memories/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
