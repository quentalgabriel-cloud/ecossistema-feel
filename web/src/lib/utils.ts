import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Os tokens de DESIGN.md usam nomes próprios (text-h1, text-ink,
// text-style-label-caps). Sem ensinar isso ao tailwind-merge, ele trata
// `text-style-*` e `text-ink` como o mesmo grupo e descarta um dos dois.
const twMerge = extendTailwindMerge<"text-style">({
  extend: {
    theme: {
      text: ["h1", "h2", "body-lg", "body-md", "ui", "label-caps", "data"],
    },
    classGroups: {
      "text-style": [
        { "text-style": ["h1", "h2", "body-lg", "body-md", "ui", "label-caps", "data"] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
