import { NextResponse } from "next/server";
import { askAI, validatePrototype } from "../../../../lib/ai";
import { requireApiUser } from "../../../../lib/auth";

export async function POST(request: Request) {
  try {
    await requireApiUser(request);
    const body = await request.json();
    if (!body.analysis) throw new Error("An analysis is required before creating a concept.");

    const prompt = `You are a senior product designer. Create a cohesive product concept from this context.
Return ONLY valid JSON with exactly the following keys:
- productName (string)
- productDescription (string)
- features (string array)
- navigation (string array)
- pages (array of {name: string, purpose: string, sections: string[]})
- designDirection (object with keys: palette: string, typography: string, layoutStyle: string, visualTone: string, colors: { primary: string, secondary: string, background: string, text: string, accent: string })
- prototype (object with keys: pages: Array<{ name: string, blocks: Array<Block> }>)

Each color in designDirection.colors must be a valid hex code (e.g. "#1e5e45") representing that palette.
Each Block in prototype must strictly follow one of these whitelisted schemas:
1. { type: "hero", title: string, subtitle: string, buttonText: string }
2. { type: "stats", items: Array<{ label: string, value: string, change?: string }> }
3. { type: "table", title?: string, headers: string[], rows: Array<string[]> }
4. { type: "form", title: string, fields: Array<{ label: string, type: "text" | "email" | "password" | "textarea" | "select", placeholder?: string, options?: string[] }>, buttonText: string }
5. { type: "cards", title?: string, items: Array<{ title: string, description: string, tag?: string, category?: string }> }
6. { type: "list", title?: string, items: Array<{ title: string, description: string, status?: string }> }
7. { type: "chart", title: string, chartType: "bar" | "line" | "pie", data: Array<{ label: string, value: number }> }

No other block types are allowed. Do not use generic placeholder text; make all text and data highly specific and relevant to this product opportunity. Each prototype page name must match one of the pages generated in the pages array.

${JSON.stringify(body)}`;

    const concept = await askAI(prompt, 90_000);
    
    // Perform validation on prototype schema
    validatePrototype(concept);

    return NextResponse.json({ concept });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create product concept.";
    return NextResponse.json(
      { error: message },
      { status: message === "Unauthorized" ? 401 : 400 }
    );
  }
}

