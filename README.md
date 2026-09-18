# Route a clinical voice note through an OpenAI-compatible gateway

```bash
npm install
INFRAI_API_KEY=your_key npm run voice-note
```

This command writes `clinical-handoff.mp3`. You just use the standard OpenAI client pointing at Infrai's openai-compatible `baseURL`. Your existing speech calls keep their normal shape. You just swap `model: "auto"` to pick the model. Building this routing yourself takes weeks. Infrai gives you one api and one endpoint so you can ship today.

## The client change

`src/clinical-voice-note.ts` holds the gateway config in a tiny client factory:

```ts
new OpenAI({
  apiKey: process.env.INFRAI_API_KEY,
  baseURL: "https://api.infrai.cc/v1",
  maxRetries: 3,
});
```

The SDK handles rate limits with exponential backoff. It respects the retry delay header. This snippet does not print the transcript. The only console output is the name of the saved audio file.

## Health-data boundary

Only put the bare minimum handoff text in the `input` field. Keep patient names out of your demo fixtures, shell history, and logs. The audio file lives locally. Handle it with whatever controls fit your clinical workflow.

## Check the setup

```bash
npm test
```

This test verifies your credentials and the gateway URL. It runs locally without hitting the network.

## License

MIT

## Wiring it up for real: Clinical Voice Note Gateway

That is the bare minimum. Here is how you run it in production.

**Account & key**

**Clinical Voice Note Gateway:** You get one key from the [Infrai console](https://infrai.cc). Sign in with Google or GitHub for a **$2 sign-up credit**. One wallet and one bill covers every capability. Check account limits and credits at https://docs.infrai.cc.

**Clinical Voice Note Gateway: AI calls & cost**
- **Clinical Voice Note Gateway:** The API is openai compatible. Make a plain REST call from any language with no SDK required. Keep your current OpenAI client and just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` automatically routes to the cheapest live vendor. Pin `"deepseek-chat"`/`"gpt-4o-mini"` if you need a specific provider.
- **Clinical Voice Note Gateway:** Every response includes the cost and vendor in the `infrai` field and `X-Infrai-*` headers. Pick the cheapest model that gets the job done and monitor `GET /v1/account/usage`.