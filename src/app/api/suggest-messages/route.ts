import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as { messages: UIMessage[] };
    const { messages } = body;

    // Custom system prompt
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // Convert UI messages separately
    const modelMessages = convertToModelMessages(messages);

    // Prepend system prompt (already in LLMMessage shape)
    const result = streamText({
      model: openai("gpt-4o"),
      messages: [{ role: "system", content: prompt }, ...modelMessages],
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    }

    console.error("An unexpected error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
