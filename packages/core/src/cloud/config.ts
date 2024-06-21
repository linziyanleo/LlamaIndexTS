import * as PlatformApi from "@llamaindex/cloud";
import { BaseNode } from "../Node.js";
import { OpenAIEmbedding } from "../embeddings/OpenAIEmbedding.js";
import type { TransformComponent } from "../ingestion/types.js";
import { SimpleNodeParser } from "../nodeParsers/SimpleNodeParser.js";

export type GetPipelineCreateParams = {
  pipelineName: string;
  pipelineType: any; // TODO: PlatformApi.PipelineType is not exported
  transformations?: TransformComponent[];
  inputNodes?: BaseNode[];
};

function getTransformationConfig(
  transformation: TransformComponent,
): PlatformApi.ConfiguredTransformationItem {
  if (transformation instanceof SimpleNodeParser) {
    return {
      configurable_transformation_type: "SENTENCE_AWARE_NODE_PARSER",
      component: {
        // TODO: API doesnt accept camelCase
        chunk_size: transformation.textSplitter.chunkSize, // TODO: set to public in SentenceSplitter
        chunk_overlap: transformation.textSplitter.chunkOverlap, // TODO: set to public in SentenceSplitter
        include_metadata: transformation.includeMetadata,
        include_prev_next_rel: transformation.includePrevNextRel,
      },
    };
  }
  if (transformation instanceof OpenAIEmbedding) {
    return {
      configurable_transformation_type: "OPENAI_EMBEDDING",
      component: {
        // TODO: API doesnt accept camelCase
        model: transformation.model,
        api_key: transformation.apiKey,
        embed_batch_size: transformation.embedBatchSize,
        dimensions: transformation.dimensions,
      },
    };
  }
  throw new Error(`Unsupported transformation: ${typeof transformation}`);
}

export async function getPipelineCreate(
  params: GetPipelineCreateParams,
): Promise<PlatformApi.PipelineCreate> {
  const { pipelineName, pipelineType, transformations = [] } = params;

  return {
    name: pipelineName,
    configured_transformations: transformations.map(getTransformationConfig),
    pipeline_type: pipelineType,
  };
}