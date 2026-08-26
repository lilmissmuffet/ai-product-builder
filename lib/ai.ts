const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
export function validateBrief(brief: Record<string, unknown>) {
  if (!brief.product_description || !brief.target_customer) throw new Error("Product description and target customer are required.");
  if (brief.website_url) { try { const url = new URL(String(brief.website_url)); if (!/^https?:$/.test(url.protocol)) throw new Error(); } catch { throw new Error("Enter a valid http(s) website URL."); } }
}
export async function getWebsiteText(rawUrl: string) {
  try { const response = await fetch(rawUrl,{headers:{"User-Agent":"ForgeAI Product Research/1.0"},signal:AbortSignal.timeout(8000)}); if(!response.ok)throw new Error(); const html=await response.text(); return html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").slice(0,12000); }
  catch { throw new Error("We could not read that website. Check that the URL is public and try again, or continue without a URL."); }
}
export async function askAI(prompt: string, timeoutMs = 30_000) {
  const key=process.env.GEMINI_API_KEY; if(!key)throw new Error("AI service is not configured. Add GEMINI_API_KEY to the environment.");
  const model=process.env.GEMINI_MODEL||"gemini-2.5-flash";
  const response=await fetch(`${GEMINI_API_BASE}/${model}:generateContent?key=${encodeURIComponent(key)}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseMimeType:"application/json",temperature:0.5}}),signal:AbortSignal.timeout(timeoutMs)});
  if(!response.ok){const text=await response.text();throw new Error(`AI request failed: ${text.slice(0,160)}`)} const data=await response.json(); const text=data.candidates?.[0]?.content?.parts?.map((part:{text?:string})=>part.text||"").join(""); try{return JSON.parse(text)}catch{throw new Error("The AI returned an invalid response. Please try again.")}
}
