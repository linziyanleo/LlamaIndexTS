import fs from "node:fs/promises";

import {
  Document,
  Groq,
  HuggingFaceEmbedding,
  Settings,
  VectorStoreIndex,
} from "llamaindex";

// Update llm to use Groq
Settings.llm = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
console.log("settings llm", Settings.llm);

// Use HuggingFace for embeddings
Settings.embedModel = new HuggingFaceEmbedding();
console.log("settings embedding", Settings.embedModel);

async function main() {
  // Load essay from abramov.txt in Node
  console.log("loading essay");
  const path = "node_modules/llamaindex/examples/abramov.txt";
  const essay = await fs.readFile(path, "utf-8");
  console.log("essay loaded");
  const document = new Document({ text: essay, id_: "essay" });
  console.log("document created");
  // Load and index documents
  const index = await VectorStoreIndex.fromDocuments([document]);

  console.log("index created");
  // get retriever
  const retriever = index.asRetriever();

  // Create a query engine
  const queryEngine = index.asQueryEngine({
    retriever,
  });

  const query = "What is the meaning of life?";

  // Query
  const response = await queryEngine.query({
    query,
  });

  // Log the response
  console.log(response.response);
}

main().catch(console.error);
