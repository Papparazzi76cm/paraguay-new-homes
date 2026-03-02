/** Parses special markers from assistant messages */

const CONTACT_MARKER = "[SHOW_CONTACT_FORM]";
const CARDS_REGEX = /\[PROJECT_CARDS:([^\]]+)\]/;
const SUGGESTIONS_REGEX = /\[SUGGESTIONS:([^\]]+)\]/;

export interface ParsedMessage {
  cleanContent: string;
  projectSlugs: string[];
  suggestions: string[];
  showContactForm: boolean;
}

export function parseAssistantMessage(raw: string): ParsedMessage {
  let content = raw;
  let showContactForm = false;
  let projectSlugs: string[] = [];
  let suggestions: string[] = [];

  if (content.includes(CONTACT_MARKER)) {
    showContactForm = true;
    content = content.replace(CONTACT_MARKER, "");
  }

  const cardsMatch = content.match(CARDS_REGEX);
  if (cardsMatch) {
    projectSlugs = cardsMatch[1].split(",").map((s) => s.trim()).filter(Boolean);
    content = content.replace(CARDS_REGEX, "");
  }

  const suggestionsMatch = content.match(SUGGESTIONS_REGEX);
  if (suggestionsMatch) {
    suggestions = suggestionsMatch[1].split("|").map((s) => s.trim()).filter(Boolean);
    content = content.replace(SUGGESTIONS_REGEX, "");
  }

  return {
    cleanContent: content.trimEnd(),
    projectSlugs,
    suggestions,
    showContactForm,
  };
}
