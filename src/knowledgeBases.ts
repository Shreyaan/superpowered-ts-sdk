import { AxiosInstance } from "axios";
import { KnowledgeBase } from "./types";

export class KnowledgeBaseAPI {
  constructor(private axiosInstance: AxiosInstance) {}

  /**
   * Lists knowledge bases with optional filters.
   * @param {Object} [params] - Optional parameters for filtering the knowledge bases.
   * @param {number} [params.limit] - The maximum number of knowledge bases to return.
   * @param {string} [params.next_page_token] - Token for fetching the next page of results.
   * @param {string} [params.title_begins_with] - Filter knowledge bases by title prefix.
   * @param {string} [params.supp_id] - Filter knowledge bases by support ID.
   * @returns {Promise<{ knowledge_bases: KnowledgeBase[]; next_page_token?: string }>} - A promise that resolves to the list of knowledge bases and the next page token.
   */
  async listKnowledgeBases(params?: {
    limit?: number;
    next_page_token?: string;
    title_begins_with?: string;
    supp_id?: string;
  }): Promise<{ knowledge_bases: KnowledgeBase[]; next_page_token?: string }> {
    const response = await this.axiosInstance.get("/knowledge_bases", {
      params,
    });
    return response.data;
  }

  /**
   * Creates a new knowledge base.
   * @param {Omit<KnowledgeBase, "id" | "created_on" | "storage_bytes" | "document_count">} data - The data for the new knowledge base.
   * @returns {Promise<KnowledgeBase>} - A promise that resolves to the created knowledge base.
   */
  async createKnowledgeBase(
    data: Omit<
      KnowledgeBase,
      "id" | "created_on" | "storage_bytes" | "document_count"
    >
  ): Promise<KnowledgeBase> {
    const response = await this.axiosInstance.post("/knowledge_bases", data);
    return response.data;
  }

  /**
   * Retrieves a knowledge base by its ID.
   * @param {string} knowledgeBaseId - The ID of the knowledge base to retrieve.
   * @returns {Promise<KnowledgeBase>} - A promise that resolves to the retrieved knowledge base.
   */
  async getKnowledgeBase(knowledgeBaseId: string): Promise<KnowledgeBase> {
    const response = await this.axiosInstance.get(
      `/knowledge_bases/${knowledgeBaseId}`
    );
    return response.data;
  }

  /**
   * Updates a knowledge base by its ID.
   * @param {string} knowledgeBaseId - The ID of the knowledge base to update.
   * @param {Partial<Omit<KnowledgeBase, "id" | "created_on" | "storage_bytes" | "document_count">>} data - The data to update the knowledge base with.
   * @returns {Promise<KnowledgeBase>} - A promise that resolves to the updated knowledge base.
   */
  async updateKnowledgeBase(
    knowledgeBaseId: string,
    data: Partial<
      Omit<
        KnowledgeBase,
        "id" | "created_on" | "storage_bytes" | "document_count"
      >
    >
  ): Promise<KnowledgeBase> {
    const response = await this.axiosInstance.patch(
      `/knowledge_bases/${knowledgeBaseId}`,
      data
    );
    return response.data;
  }

  /**
   * Deletes a knowledge base by its ID.
   * @param {string} knowledgeBaseId - The ID of the knowledge base to delete.
   * @returns {Promise<void>} - A promise that resolves when the knowledge base is deleted.
   */
  async deleteKnowledgeBase(knowledgeBaseId: string): Promise<void> {
    await this.axiosInstance.delete(`/knowledge_bases/${knowledgeBaseId}`);
  }

  /**
   * Queries knowledge bases with specified parameters.
   * @param {Object} data - The query parameters.
   * @param {string} data.query - The query string.
   * @param {boolean} [data.async] - Whether the query should be asynchronous.
   * @param {string[]} data.knowledge_base_ids - The IDs of the knowledge bases to query.
   * @param {number} [data.top_k] - The number of top results to return.
   * @param {boolean} [data.exclude_irrelevant_results] - Whether to exclude irrelevant results.
   * @param {boolean} [data.summarize_results] - Whether to summarize the results.
   * @param {Object} [data.summary_config] - Configuration for summarizing results.
   * @param {string} data.summary_config.system_message - The system message for summarizing results.
   * @param {boolean} [data.use_auto_query] - Whether to use auto query.
   * @param {boolean} [data.use_rse] - Whether to use RSE.
   * @param {"short" | "medium" | "long"} [data.segment_length] - The segment length for the query.
   * @param {string | null} [data.summary_system_message] - The system message for the summary.
   * @param {string} [data.auto_query_guidance] - Guidance for auto query.
   * @param {boolean} [data.json_response] - Whether to return the response in JSON format.
   * @param {boolean} [data.use_web_search] - Whether to use web search.
   * @param {Object} [data.web_search_config] - Configuration for web search.
   * @param {string} data.web_search_config.web_search_preset_id - The preset ID for web search.
   * @param {string[]} [data.web_search_config.include_domains] - Domains to include in the web search.
   * @param {string[]} [data.web_search_config.exclude_domains] - Domains to exclude from the web search.
   * @param {string} [data.web_search_config.start_date] - The start date for the web search.
   * @param {string} [data.web_search_config.end_date] - The end date for the web search.
   * @param {number} [data.web_search_config.timeframe_days] - The timeframe in days for the web search.
   * @returns {Promise<any>} - A promise that resolves to the query results.
   */
  async queryKnowledgeBases(data: {
    query: string;
    async?: boolean;
    knowledge_base_ids: string[];
    top_k?: number;
    exclude_irrelevant_results?: boolean;
    summarize_results?: boolean;
    summary_config?: {
      system_message: string;
    };
    use_auto_query?: boolean;
    use_rse?: boolean;
    segment_length?: "short" | "medium" | "long";
    summary_system_message?: string | null;
    auto_query_guidance?: string;
    json_response?: boolean;
    use_web_search?: boolean;
    web_search_config?: {
      web_search_preset_id: string;
      include_domains?: string[];
      exclude_domains?: string[];
      start_date?: string;
      end_date?: string;
      timeframe_days?: number;
    };
  }): Promise<any> {
    const response = await this.axiosInstance.post(
      "/knowledge_bases/query",
      data
    );
    return response.data;
  }
}
