import { wrapLLMEvent } from "@llamaindex/core/decorator";
import {
  BaseLLM,
  type ChatMessage,
  type ChatResponse,
  type ChatResponseChunk,
  type LLMChatParamsNonStreaming,
  type LLMChatParamsStreaming,
  type LLMMetadata,
} from "llamaindex";
import * as api from "./request";

// 对话接口
const chatApi = "http://127.0.0.1:7001/llm/app/chat";

export class DemoLLM extends BaseLLM {
  model: "demo-llm";
  temperature: number;
  topP: number;
  maxTokens?: number | undefined;
  apiKey?: string;
  safeMode: boolean;
  randomSeed?: number | undefined;

  constructor(init?: Partial<DemoLLM>) {
    super();
    this.model = init?.model ?? "demo-llm";
    this.temperature = init?.temperature ?? 0.1;
    this.topP = init?.topP ?? 1;
    this.maxTokens = init?.maxTokens ?? undefined;
    this.safeMode = init?.safeMode ?? false;
    this.randomSeed = init?.randomSeed ?? undefined;
  }

  get metadata(): LLMMetadata {
    return {
      model: this.model,
      temperature: this.temperature,
      topP: this.topP,
      maxTokens: this.maxTokens,
      contextWindow: 4096,
      tokenizer: undefined,
    };
  }

  private buildParams(messages: ChatMessage[]): any {
    return {
      model: this.model,
      temperature: this.temperature,
      maxTokens: this.maxTokens,
      topP: this.topP,
      safeMode: this.safeMode,
      randomSeed: this.randomSeed,
      messages,
    };
  }

  _llmType(): string {
    return "demo";
  }

  async _call(prompt: string): Promise<string> {
    const params = this.buildParams([{ role: "user", content: prompt }]);
    console.log("======= params =======", params);
    const input = {
      role: params.messages[0].role,
      content: JSON.stringify(params.messages[0].content),
      temperature: params.temperature,
      response_format: { type: "text" },
    };
    const res = await api.post(chatApi, input);
    console.log("======= res =======", res);
    return "Hello, world! You said: " + prompt;
  }

  chat(
    params: LLMChatParamsStreaming,
  ): Promise<AsyncIterable<ChatResponseChunk>>;
  chat(params: LLMChatParamsNonStreaming): Promise<ChatResponse>;
  @wrapLLMEvent
  async chat(
    params: LLMChatParamsStreaming | LLMChatParamsNonStreaming,
  ): Promise<AsyncIterable<ChatResponseChunk> | ChatResponse<object>> {
    if (params.stream) return this.streamChat(params);
    return this.nonStreamChat(params);
  }

  protected async nonStreamChat(
    params: LLMChatParamsNonStreaming,
  ): Promise<ChatResponse<object>> {
    const messageInputs = params.messages.map((msg) => ({
      role: msg.role,
      content: msg.content as string,
    }));
    console.log("======= messageInputs =======", messageInputs);
    const response = await this._call(messageInputs[0].content);
    return {
      raw: null,
      message: {
        content: response,
        role: "assistant",
      },
    };
  }

  protected async streamChat(params: LLMChatParamsStreaming): Promise<never> {
    throw new Error("Stream Chat is not implemented.");
  }
}

export default DemoLLM;
