import { AxiosInstance } from "axios";
import {
  ChatThread,
  ChatThreadBody,
  ChatResponse,
  AsyncJobResponse,
  ChatInteraction,
} from "./types";

export class ChatAPI {
  constructor(private axiosInstance: AxiosInstance) {}

  /**
   * Creates a new chat thread.
   * @param {Omit<ChatThread, "id" | "created_on" | "num_interactions" | "recent_chat_history">} data - The data for the new chat thread.
   * @returns {Promise<ChatThread>} The created chat thread.
   */
  async createChatThread(
    data: Omit<
      ChatThread,
      "id" | "created_on" | "num_interactions" | "recent_chat_history"
    >
  ): Promise<ChatThread> {
    const response = await this.axiosInstance.post("/chat/threads", data);
    return response.data;
  }

  /**
   * Lists chat threads.
   * @param {Object} [params] - Optional parameters for listing chat threads.
   * @param {string} [params.supp_id] - The support ID.
   * @param {number} [params.limit] - The limit of chat threads to return.
   * @param {string} [params.next_page_token] - The token for the next page of results.
   * @returns {Promise<{ threads: ChatThread[]; next_page_token?: string }>} The list of chat threads and the next page token.
   */
  async listChatThreads(params?: {
    supp_id?: string;
    limit?: number;
    next_page_token?: string;
  }): Promise<{ threads: ChatThread[]; next_page_token?: string }> {
    const response = await this.axiosInstance.get("/chat/threads", { params });
    return response.data;
  }

  /**
   * Gets a chat thread by ID.
   * @param {string} threadId - The ID of the chat thread.
   * @returns {Promise<ChatThread>} The chat thread.
   */
  async getChatThread(threadId: string): Promise<ChatThread> {
    const response = await this.axiosInstance.get(`/chat/threads/${threadId}`);
    return response.data;
  }

  /**
   * Updates a chat thread.
   * @param {string} threadId - The ID of the chat thread.
   * @param {Omit<ChatThread, "id" | "created_on" | "num_interactions" | "recent_chat_history">} data - The data to update the chat thread.
   * @returns {Promise<ChatThread>} The updated chat thread.
   */
  async updateChatThread(
    threadId: string,
    data: Omit<
      ChatThread,
      "id" | "created_on" | "num_interactions" | "recent_chat_history"
    >
  ): Promise<ChatThread> {
    const response = await this.axiosInstance.patch(
      `/chat/threads/${threadId}`,
      data
    );
    return response.data;
  }

  /**
   * Deletes a chat thread by ID.
   * @param {string} threadId - The ID of the chat thread.
   * @returns {Promise<void>} A promise that resolves when the chat thread is deleted.
   */
  async deleteChatThread(threadId: string): Promise<void> {
    await this.axiosInstance.delete(`/chat/threads/${threadId}`);
  }

  /**
   * Gets a response for a chat thread.
   * @param {string} threadId - The ID of the chat thread.
   * @param {ChatThreadBody} data - The data for getting the chat thread response.
   * @returns {Promise<ChatResponse | AsyncJobResponse>} The chat response or async job response.
   */
  async getChatThreadResponse(
    threadId: string,
    data: ChatThreadBody
  ): Promise<ChatResponse | AsyncJobResponse> {
    const response = await this.axiosInstance.post(
      `/chat/threads/${threadId}/get_response`,
      data
    );
    return response.data;
  }

  /**
   * Lists interactions for a chat thread.
   * @param {string} threadId - The ID of the chat thread.
   * @param {Object} [params] - Optional parameters for listing chat thread interactions.
   * @param {number} [params.limit] - The limit of interactions to return.
   * @param {string} [params.next_page_token] - The token for the next page of results.
   * @param {"asc" | "desc"} [params.order] - The order of interactions.
   * @returns {Promise<{ interactions: ChatInteraction[]; next_page_token?: string }>} The list of chat interactions and the next page token.
   */
  async listChatThreadInteractions(
    threadId: string,
    params?: {
      limit?: number;
      next_page_token?: string;
      order?: "asc" | "desc";
    }
  ): Promise<{ interactions: ChatInteraction[]; next_page_token?: string }> {
    const response = await this.axiosInstance.get(
      `/chat/threads/${threadId}/interactions`,
      { params }
    );
    return response.data;
  }
}
