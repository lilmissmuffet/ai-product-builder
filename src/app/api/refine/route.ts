import { NextResponse } from "next/server";
import { askAI, validatePrototype } from "../../../../lib/ai";
import { requireApiUser } from "../../../../lib/auth";

export async function POST(request: Request) {
  try {
    await requireApiUser(request);
    const body = await request.json();
    if (!body.concept || !body.instruction) throw new Error("A concept and an instruction are required.");

    const prompt = `You are updating an existing product concept. Apply the user's instruction while preserving useful details, design system, and overall consistency. Do not produce an unrelated concept.
Return ONLY valid JSON with keys concept and reply.
concept must have exactly the following keys:
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

No other block types are allowed. Update the prototype screens and block contents to reflect any relevant changes from the instruction (e.g. if the user says "add a contacts screen", make sure a page for it exists in both pages and prototype.pages with appropriate blocks). Keep all text and data highly specific and relevant to the concept.

reply is one concise explanation of what changed.
CURRENT:${JSON.stringify(body.concept)}
INSTRUCTION:${body.instruction}
CONTEXT:${JSON.stringify(body.context||{})}`;

    const result = await askAI(prompt);
    
    // Perform validation on refined prototype schema
    if (result && result.concept) {
      validatePrototype(result.concept);
    } else {
      throw new Error("Refinement returned an invalid format.");
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update product concept.";
    return NextResponse.json(
      { error: message },
      { status: message === "Unauthorized" ? 401 : 400 }
    );
  }
}

