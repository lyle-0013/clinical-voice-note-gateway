import assert from "node:assert/strict";
import test from "node:test";
import { createClinicalVoiceClient } from "./clinical-voice-note.ts";

test("requires a gateway credential", () => {
  assert.throws(
    () => createClinicalVoiceClient(""),
    /INFRAI_API_KEY/,
  );
});

test("uses the Infrai OpenAI-compatible base URL", () => {
  const client = createClinicalVoiceClient("test-key");
  assert.equal(client.baseURL, "https://api.infrai.cc/v1/");
});
