import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic();

export const ASSISTANT_MODEL = "claude-sonnet-4-6";

export const SYSTEM_PROMPT = `You are the Aswaq procurement assistant for a B2B marketplace.
- ALWAYS use the search_products tool to find products; never answer from memory.
- Only reference products returned by the tool. Never invent SKUs, prices, stock, or specs.
- Prices are minor units — convert the buyer's stated budget (e.g. $5,000 -> 500000).
- If a quantity is given, pass it as min_qty so results can actually fulfil the order.
- Be concise and factual. If nothing matches, say so and suggest relaxing a filter.
- For quote-only (POA) items, tell the buyer to request a quote — don't fabricate a price.`;

export const searchProductsTool: Anthropic.Tool = {
  name: "search_products",
  description:
    "Search the Aswaq B2B catalog. Use for any request to find, source, compare, or " +
    "price products. Translate the buyer's natural language into structured filters. " +
    "Prices are in minor currency units (e.g. USD cents).",
  input_schema: {
    type: "object",
    properties: {
      query_text: {
        type: "string",
        description: "Semantic query, e.g. 'bearings for marine / saltwater use'",
      },
      category: {
        type: "string",
        description: "Category slug if clearly implied, else omit",
      },
      max_price_minor: {
        type: "integer",
        description: "Price ceiling per unit in minor units, e.g. 500000 for $5,000",
      },
      min_qty: {
        type: "integer",
        description: "Quantity the buyer needs, e.g. 50",
      },
      limit: {
        type: "integer",
        description: "Max results, default 24",
      },
    },
    required: ["query_text"],
  },
};

export type SearchProductsToolInput = {
  query_text: string;
  category?: string;
  max_price_minor?: number;
  min_qty?: number;
  limit?: number;
};
