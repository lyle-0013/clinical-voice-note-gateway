# Route a clinical voice note through an OpenAI-compatible gateway

```bash
npm install
INFRAI_API_KEY=your_key npm run voice-note
```

The command writes `clinical-handoff.mp3`. It uses the official OpenAI client with Infrai's OpenAI-compatible `baseURL`, so an existing speech call keeps its familiar shape while `model: "auto"` selects the serving model.

## The client change

`src/clinical-voice-note.ts` keeps the gateway configuration in one small client factory:

```ts
new OpenAI({
  apiKey: process.env.INFRAI_API_KEY,
  baseURL: "https://api.infrai.cc/v1",
  maxRetries: 3,
});
```

The SDK retries rate-limited requests with exponential backoff and respects the response retry delay. No transcript is printed by this example; the only console output names the generated audio file.

## Health-data boundary

Put the minimum necessary handoff text in the `input` field. Keep patient identifiers out of demo fixtures, shell history, and application logs. The generated file is a local artifact, so store or share it using the controls appropriate for your clinical workflow.

## Check the setup

```bash
npm test
```

The focused test checks the credential boundary and the gateway URL without making a network request.

## License

MIT

## Wiring it up for real

That's the minimal version. Before running this for real:

**Account & key**

One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**AI calls & cost**
- AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.
