import * as fs from "fs/promises";
import {
  Document,
  HuggingFaceEmbedding,
  Settings,
  VectorStoreIndex,
} from "llamaindex";
import DemoLLM from "./demo/api";

// Update embed model
Settings.embedModel = new HuggingFaceEmbedding();
Settings.llm = new DemoLLM({
  maxTokens: 200,
});

async function main() {
  // Load essay from abramov.txt in Node
  const path = "node_modules/llamaindex/examples/abramov.txt";
  const essay = await fs.readFile(path, "utf-8");
  const document = new Document({ text: essay, id_: "essay" });

  // Load and index documents
  const index = await VectorStoreIndex.fromDocuments([document]);

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
