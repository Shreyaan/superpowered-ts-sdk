export type SegmentLength = "very_short" | "short" | "medium" | "long";
export type ResponseLength = "short" | "medium" | "long";

export interface WebSearchConfig {
  web_search_preset_id?: string;
  include_domains?: string[];
  exclude_domains?: string[];
  start_date?: string;
  end_date?: string;
  timeframe_days?: number;
}

export interface KnowledgeBase {
  title: string;
  language_code: string;
  type: "unstructured";
  supp_id?: string;
  description?: string;
  id: string;
  created_on: number;
  storage_bytes: number;
  document_count: number;
}

export interface Document {
  content?: string;
  title: string;
  link_to_source?: string;
  supp_id?: string;
  description?: string;
  chunk_header?: string;
  vectorization_status: string;
  file_name?: string;
  file_extension?: string;
  document_type: string;
  id: string;
  knowledge_base_id: string;
  created_on: number;
}

export interface ChatThread {
  title: string;
  supp_id?: string;
  default_options: ChatThreadDefaultOptions;
  id: string;
  created_on: number;
  num_interactions: number;
  recent_chat_history: ChatInteraction[];
}

export interface ChatThreadDefaultOptions {
  knowledge_base_ids: string[];
  model: string;
  temperature: number;
  use_rse: boolean;
  segment_length: SegmentLength;
  response_length: ResponseLength;
  system_message: string;
  auto_query_guidance: string;
  json_response: boolean;
  use_web_search: boolean;
  web_search_config?: WebSearchConfig;
}

export interface ChatInteraction {
  user_input: {
    content: string;
    timestamp: number;
  };
  model_response: {
    content: string;
    timestamp: number;
  };
  ranked_results?: RankedResult[];
  web_search_results?: WebSearchResult[];
  search_queries?: SearchQuery[];
  web_search_queries?: SearchQuery[];
  references?: number[];
  web_search_references?: number[];
}

export interface RankedResult {
  content: string;
  cosine_similarity: number;
  metadata: {
    document: {
      content: string;
      title: string;
      link_to_source?: string;
      supp_id?: string;
      description?: string;
      chunk_header?: string;
    };
    document_id: string;
    knowledge_base_id: string;
    account_id: string;
    result_type: "chunk" | "segment";
    num_chunks: number;
  };
  reranker_score: number;
}

export interface WebSearchResult {
  title: string;
  url: string;
  content: string;
}

export interface SearchQuery {
  query: string;
  knowledge_bases: KnowledgeBase[];
}

export interface ChatResponse {
  interaction: ChatInteraction;
  search_queries: SearchQuery[];
  ranked_results: RankedResult[];
}

export interface AsyncJobResponse {
  id: string;
  created_on: number;
  status: string;
  status_url: string;
  type: string;
  expires: number;
  response: ChatResponse;
}

export interface ChatThreadBody {
  input: string;
  async?: boolean;
  knowledge_base_ids?: string[];
  model?: string;
  temperature?: number;
  use_rse?: boolean;
  segment_length?: SegmentLength;
  response_length?: ResponseLength;
  system_message?: string;
  auto_query_guidance?: string;
  json_response?: boolean;
  use_web_search?: boolean;
  web_search_config?: WebSearchConfig;
}
