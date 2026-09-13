export type InlineMark = { type: "text" | "em" | "strong"; text: string };

export type Cell = string;

export type Block =
  | { type: "p"; text: string }
  | { type: "lede"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; caption?: string; headers: string[]; rows: Cell[][] }
  | { type: "quote"; text: string }
  | { type: "callout"; kicker?: string; title: string; body: string }
  | { type: "code"; caption?: string; text: string }
  | { type: "note"; text: string };

export type PaperSection = {
  id: string;
  num: string;
  title: string;
  blocks: Block[];
};

export type PaperMeta = {
  folio: string;
  version: string;
  prepared: string;
  title: string;
  subtitle: string;
  workingName: string;
  firstApplication: string;
  foundation: string;
  lede: string;
  status: string;
};
