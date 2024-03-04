import { Anthropic } from "llamaindex";

(async () => {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: "claude-3-opus-20240229",
  });
  const result = await anthropic.chat({
    messages: [
      {
        content:
          "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
        role: "user",
      },
    ],
  });
  console.log(result);
})();
