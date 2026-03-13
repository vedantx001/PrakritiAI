import sanitizeHtml from "sanitize-html";

const allowedTags = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "a",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "blockquote",
  "code",
  "pre",
  "hr",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
];

const allowedAttributes = {
  a: ["href", "target", "rel"],
  th: ["colspan", "rowspan"],
  td: ["colspan", "rowspan"],
};

export const sanitizeArticleHtml = (html) => {
  if (typeof html !== "string") return "";

  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes,
    allowedSchemes: ["http", "https", "mailto"],
    disallowedTagsMode: "discard",
    transformTags: {
      a: (tagName, attribs) => {
        const next = { ...attribs };

        // Enforce safe link behavior for external targets.
        if (next.target === "_blank") {
          const rel = new Set(String(next.rel || "").split(/\s+/).filter(Boolean));
          rel.add("noopener");
          rel.add("noreferrer");
          next.rel = Array.from(rel).join(" ");
        }

        return { tagName, attribs: next };
      },
    },
  }).trim();
};
