// Descripción para buscadores: el primer texto con contenido, en una línea y
// cortado en una palabra cerca de `max` caracteres.
export function summarize(texts: (string | undefined)[], max = 155) {
  const text = texts.map((t) => (t ?? '').replace(/\s+/g, ' ').trim()).find(Boolean);
  if (!text || text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return `${cut.slice(0, space > max * 0.6 ? space : cut.length).replace(/[\s,.;:–-]+$/, '')}…`;
}
