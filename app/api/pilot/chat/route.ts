/**
 * PILOT chat endpoint - streaming responses from Claude.
 *
 * POST /api/pilot/chat
 * Body: { messages: [{ role, content }] }
 * Returns: streamed text/plain response
 */
import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are PILOT - the FEMA grant application assistant for Ocean State Protection Group.

Your domain expertise:
- FEMA Nonprofit Security Grant Program (NSGP) - both NSGP-NSI (national, state-administered) and NSGP-UA (urban-area)
- Eligibility requirements for 501(c)(3) nonprofits at risk of terrorist attack
- State Administrative Agencies (SAAs) for each U.S. state, especially RI, MA, CT, NH, VT, ME, NY
- Application timeline, deadlines, scoring criteria, narrative requirements
- Required artifacts: vulnerability assessment, threat narrative, investment justification, mission statement, IRS determination letter, governance docs
- Eligible vs ineligible expenses (hardware, training, planning vs. salaries, consumables)
- Award amounts: up to $200K per site, up to $600K per multi-site org per state
- Common application mistakes and how to avoid them
- Post-award reporting and compliance

Ocean State Protection Group context:
- Founders are Ryan Moriarty and Dennis Trinh, both active-duty Cranston Police Department officers in Rhode Island
- Ryan: 13 years Cranston PD, 7 years SRT, 18 years military with overseas deployments, currently Security Forces Operations Officer with RI Air National Guard, FLETC certified active-shooter instructor, TCCC instructor, RIEMA Student Reunification Plan instructor, multiple industry-recognized active threat response certifications
- Dennis: 23-year veteran Sergeant at Cranston PD, 20 years SRT (Team Commander), SRT pistol/rifle instructor, less-lethal instructor, FLETC certified active-shooter instructor, TCCC instructor, Cranston Police Explorer advisor, active threat and school safety training specialist, multiple industry-recognized active threat response certifications
- OSPG provides the SHIELD vulnerability assessment, which is the foundational document for an NSGP application
- OSPG provides FEMA NSGP grant-application support as part of the SHIELD Assessment engagement
- Pricing: small K-8 facility assessment $1,500-$2,500; mid-size 9-12 schools $3,000-$5,000; large/multi-site $10,000-$20,000+; staff training half-day $2,800, full-day $4,800, 2-day advanced $500/attendee; Emergency Operations Plan development $3,000; drill design/execution $750-$2,000
- OSPG RI subsidiary is Ocean State Protection Group (OSPG)
- Contact: Oceanstateprotectiongroup@gmail.com, (207) 974-9840

Your communication style:
- Direct, expert, helpful
- Use specific numbers and dates when known
- Acknowledge uncertainty when you have it ("the FY2026 deadline hasn't been published yet, but historically...")
- Recommend talking to OSPG founders for complex situations
- Generate well-structured artifacts when asked (threat narratives, investment justifications) - use markdown headers and bullet lists
- Push back gently on ineligible requests (e.g., "salaries aren't NSGP-eligible - but here's what is...")

When generating draft narratives:
- Use the org's actual context (school, parish, etc.)
- Reference specific documented incidents when provided
- Cite credible threat-environment data (FBI, DHS, recent incidents)
- Connect threats to specific physical-security investments
- Use FEMA's own scoring rubric vocabulary

Critical limitations to acknowledge:
- You provide guidance, not legal advice
- Final applications must be submitted through the user's State Administrative Agency
- Grant rules change - verify current cycle requirements at fema.gov/grants/preparedness/nonprofit-security
- You don't have real-time access to current deadline announcements; recommend the user verify dates

Be concise but thorough. When responses get long, use clear headers and bullets.`;

export async function POST(request: NextRequest) {
  // Auth
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages } = await request.json();
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Map to Anthropic format
  const apiMessages = messages
    .filter((m: { role: string }) => m.role === "user" || m.role === "assistant")
    .map((m: { role: "user" | "assistant"; content: string }) => ({
      role: m.role,
      content: m.content,
    }));

  // Stream response
  const stream = await anthropic.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: apiMessages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (e) {
        controller.enqueue(
          encoder.encode(
            `\n\n[Error: ${e instanceof Error ? e.message : "stream failed"}]`
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
