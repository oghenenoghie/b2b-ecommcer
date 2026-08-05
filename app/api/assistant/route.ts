import { NextResponse } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";

import { anthropic, ASSISTANT_MODEL, SYSTEM_PROMPT, searchProductsTool } from "@/lib/ai";
import { searchProducts } from "@/lib/search";

export const runtime = "nodejs";

// AI procurement assistant: NL -> Claude tool call -> hybrid search RPC ->
// grounded product cards. See references/ai-search.md ("AI procurement
// assistant") for the full design. Requires the Build order step 2 schema +
// step 4 search_products RPC to return real rows — until then this executes
// the tool loop shape but the RPC call will error against an empty schema.
export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: Anthropic.MessageParam[] };

  const tools = [searchProductsTool];
  let response = await anthropic.messages.create({
    model: ASSISTANT_MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    tools,
    messages,
  });

  let lastResults: unknown[] = [];

  while (response.stop_reason === "tool_use") {
    const call = response.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
    );
    if (!call) break;

    const input = call.input as {
      query_text: string;
      category?: string;
      max_price_minor?: number;
      min_qty?: number;
      limit?: number;
    };

    const rows = await searchProducts({
      queryText: input.query_text,
      category: input.category,
      maxPriceMinor: input.max_price_minor,
      minQty: input.min_qty,
      limit: input.limit,
    });
    lastResults = (rows as unknown[]) ?? [];

    messages.push({ role: "assistant", content: response.content });
    messages.push({
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: call.id,
          content: JSON.stringify(lastResults),
        },
      ],
    });

    response = await anthropic.messages.create({
      model: ASSISTANT_MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools,
      messages,
    });
  }

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  return NextResponse.json({ text, products: lastResults });
}
