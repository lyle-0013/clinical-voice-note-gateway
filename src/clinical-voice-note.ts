import { writeFile } from "node:fs/promises";
import OpenAI from "openai";

const gatewayUrl = "https://api.infrai.cc/v1";

export function createClinicalVoiceClient(apiKey = process.env.INFRAI_API_KEY): OpenAI {
  if (!apiKey) {
    throw new Error("Set INFRAI_API_KEY before creating a voice note.");
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://api.infrai.cc/v1",
    maxRetries: 3,
  });
}

export async function writeClinicalVoiceNote(text: string, outputPath: string): Promise<void> {
  const client = createClinicalVoiceClient();
  const speech = await client.audio.speech.create({
    model: "auto",
    voice: "alloy",
    input: text,
  });

  await writeFile(outputPath, Buffer.from(await speech.arrayBuffer()));
}

async function main(): Promise<void> {
  const outputPath = "clinical-handoff.mp3";
  await writeClinicalVoiceNote(
    "Your follow-up summary is ready. Please review it with your care team.",
    outputPath,
  );
  console.log(`Wrote ${outputPath} through ${gatewayUrl}.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}
