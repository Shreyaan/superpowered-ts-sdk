import { AxiosInstance } from "axios";
import { Document } from "./types";
import crypto from "crypto";
import axios from "axios";

export class DocumentAPI {
  constructor(private axiosInstance: AxiosInstance) {}

  /**
   * Lists documents in a knowledge base.
   * @param {string} knowledgeBaseId - The ID of the knowledge base.
   * @param {Object} [params] - Optional parameters for filtering the documents.
   * @param {string} [params.title_begins_with] - Filter by title prefix.
   * @param {string} [params.supp_id] - Filter by supplementary ID.
   * @param {string} [params.status] - Filter by status.
   * @param {string} [params.link_to_source] - Filter by link to source.
   * @param {number} [params.limit] - Limit the number of documents returned.
   * @param {string} [params.next_page_token] - Token for the next page of results.
   * @returns {Promise<{ documents: Document[]; next_page_token?: string }>} A promise that resolves to the list of documents and the next page token.
   */
  async listDocuments(
    knowledgeBaseId: string,
    params?: {
      title_begins_with?: string;
      supp_id?: string;
      status?: string;
      link_to_source?: string;
      limit?: number;
      next_page_token?: string;
    }
  ): Promise<{ documents: Document[]; next_page_token?: string }> {
    const response = await this.axiosInstance.get(
      `/knowledge_bases/${knowledgeBaseId}/documents`,
      { params }
    );
    return response.data;
  }

  /**
   * Retrieves a specific document from a knowledge base.
   * @param {string} knowledgeBaseId - The ID of the knowledge base.
   * @param {string} documentId - The ID of the document.
   * @param {boolean} [includeContent=false] - Whether to include the content of the document.
   * @returns {Promise<Document>} A promise that resolves to the document.
   */
  async getDocument(
    knowledgeBaseId: string,
    documentId: string,
    includeContent: boolean = false
  ): Promise<Document> {
    const response = await this.axiosInstance.get(
      `/knowledge_bases/${knowledgeBaseId}/documents/${documentId}`,
      {
        params: { include_content: includeContent },
      }
    );
    return response.data;
  }

  /**
   * Updates a specific document in a knowledge base.
   * @param {string} knowledgeBaseId - The ID of the knowledge base.
   * @param {string} documentId - The ID of the document.
   * @param {Partial<Pick<Document, "title" | "supp_id" | "description" | "link_to_source">>} data - The data to update the document with.
   * @returns {Promise<Document>} A promise that resolves to the updated document.
   */
  async updateDocument(
    knowledgeBaseId: string,
    documentId: string,
    data: Partial<
      Pick<Document, "title" | "supp_id" | "description" | "link_to_source">
    >
  ): Promise<Document> {
    const response = await this.axiosInstance.patch(
      `/knowledge_bases/${knowledgeBaseId}/documents/${documentId}`,
      data
    );
    return response.data;
  }

  /**
   * Deletes a specific document from a knowledge base.
   * @param {string} knowledgeBaseId - The ID of the knowledge base.
   * @param {string} documentId - The ID of the document.
   * @returns {Promise<void>} A promise that resolves when the document is deleted.
   */
  async deleteDocument(
    knowledgeBaseId: string,
    documentId: string
  ): Promise<void> {
    await this.axiosInstance.delete(
      `/knowledge_bases/${knowledgeBaseId}/documents/${documentId}`
    );
  }

  /**
   * Requests a signed URL for uploading or downloading a file.
   * @param {string} knowledgeBaseId - The ID of the knowledge base.
   * @param {Object} data - The data for the request.
   * @param {string} data.filename - The name of the file.
   * @param {string} data.encoded_md5 - The MD5 hash of the file, encoded in base64.
   * @param {"GET" | "PUT"} data.method - The HTTP method for the signed URL.
   * @param {string} [data.link_to_source] - Optional link to the source.
   * @param {string} [data.supp_id] - Optional supplementary ID.
   * @param {string} [data.description] - Optional description of the file.
   * @param {boolean} [data.is_update] - Whether this is an update to an existing file.
   * @param {string} [data.chunk_header] - Optional chunk header for the file.
   * @param {boolean} [data.auto_context] - Whether to automatically add context to the file.
   * @returns {Promise<{ temporary_url: string }>} A promise that resolves to the temporary URL.
   */
  async requestSignedFileUrl(
    knowledgeBaseId: string,
    data: {
      filename: string;
      encoded_md5: string;
      method: "GET" | "PUT";
      link_to_source?: string;
      supp_id?: string;
      description?: string;
      is_update?: boolean;
      chunk_header?: string;
      auto_context?: boolean;
    }
  ): Promise<{ temporary_url: string }> {
    const response = await this.axiosInstance.post(
      `/knowledge_bases/${knowledgeBaseId}/documents/request_signed_file_url`,
      data
    );
    return response.data;
  }

  /**
   * Uploads a document to the knowledge base.
   *
   * @param {string} knowledgeBaseId - The ID of the knowledge base.
   * @param {Buffer} fileBuffer - The buffer of the file to be uploaded.
   * @param {string} fileName - The name of the file to be uploaded.
   * @param {Object} [options] - Optional parameters.
   * @param {string} [options.linkToSource] - Link to the source of the document.
   * @param {string} [options.suppId] - Supplementary ID for the document.
   * @param {string} [options.description] - Description of the document.
   * @param {boolean} [options.isUpdate] - Flag indicating if the document is an update.
   * @param {string} [options.chunkHeader] - Chunk header for the document.
   * @param {boolean} [options.autoContext] - Flag indicating if auto context should be used.
   * @returns {Promise<{ success: boolean, existingDocumentId?: string, errorMessage?: string }>} - The result of the upload operation.
   */
  async uploadDocument(
    knowledgeBaseId: string,
    fileBuffer: Buffer,
    fileName: string,
    options?: {
      linkToSource?: string;
      suppId?: string;
      description?: string;
      isUpdate?: boolean;
      chunkHeader?: string;
      autoContext?: boolean;
    }
  ): Promise<{
    success: boolean;
    existingDocumentId?: string;
    errorMessage?: string;
  }> {
    const md5Hash = crypto
      .createHash("md5")
      .update(fileBuffer)
      .digest("base64");

    const signedUrlResponse = await this.requestSignedFileUrl(knowledgeBaseId, {
      filename: fileName,
      encoded_md5: md5Hash,
      method: "PUT",
      link_to_source: options?.linkToSource,
      supp_id: options?.suppId,
      description: options?.description,
      is_update: options?.isUpdate,
      chunk_header: options?.chunkHeader,
      auto_context: options?.autoContext,
    });

    const signedUrl = signedUrlResponse.temporary_url;

    try {
      const res = await axios.put(signedUrl, fileBuffer, {
        headers: {
          "Content-MD5": md5Hash,
          "Content-Type": "application/octet-stream",
        },
      });

      return { success: res.status === 200 };
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.data?.error?.includes(
          "already exists in knowledge base"
        )
      ) {
        return {
          success: false,
          existingDocumentId: error.response.data.existing_document_id,
          errorMessage: error.response.data.error,
        };
      }

      throw error;
    }
  }

  /**
   * Creates a document with raw text in the knowledge base.
   *
   * @param {string} knowledgeBaseId - The ID of the knowledge base.
   * @param {Object} data - The data for the document.
   * @param {string} data.content - The content of the document.
   * @param {boolean} [data.auto_context] - Flag indicating if auto context should be used.
   * @param {string} data.title - The title of the document.
   * @param {string} [data.link_to_source] - Link to the source of the document.
   * @param {string} [data.supp_id] - Supplementary ID for the document.
   * @param {string} [data.description] - Description of the document.
   * @param {string} [data.chunk_header] - Chunk header for the document.
   * @returns {Promise<Document>} - The created document.
   */
  async createDocumentWithRawText(
    knowledgeBaseId: string,
    data: {
      content: string;
      auto_context?: boolean;
      title: string;
      link_to_source?: string;
      supp_id?: string;
      description?: string;
      chunk_header?: string;
    }
  ): Promise<Document> {
    const response = await this.axiosInstance.post(
      `/knowledge_bases/${knowledgeBaseId}/documents/raw_text`,
      data
    );
    return response.data;
  }

  /**
   * Creates a document from a URL in the knowledge base.
   *
   * @param {string} knowledgeBaseId - The ID of the knowledge base.
   * @param {Object} data - The data for the document.
   * @param {string} data.url - The URL of the document.
   * @param {string} [data.title] - The title of the document.
   * @param {string} [data.supp_id] - Supplementary ID for the document.
   * @param {string} [data.description] - Description of the document.
   * @param {string[]} [data.html_exclude_tags] - HTML tags to exclude.
   * @param {string} [data.chunk_header] - Chunk header for the document.
   * @param {boolean} [data.auto_context] - Flag indicating if auto context should be used.
   * @param {boolean} [data.use_proxy] - Flag indicating if a proxy should be used.
   * @param {string} [data.proxy_country_code] - The country code for the proxy.
   * @returns {Promise<Document>} - The created document.
   */
  async createDocumentFromUrl(
    knowledgeBaseId: string,
    data: {
      url: string;
      title?: string;
      supp_id?: string;
      description?: string;
      html_exclude_tags?: string[];
      chunk_header?: string;
      auto_context?: boolean;
      use_proxy?: boolean;
      proxy_country_code?: string;
    }
  ): Promise<Document> {
    const response = await this.axiosInstance.post(
      `/knowledge_bases/${knowledgeBaseId}/documents/url`,
      data
    );
    return response.data;
  }
}
