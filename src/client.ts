import axios, { AxiosInstance } from "axios";
import { KnowledgeBaseAPI } from "./knowledgeBases";
import { DocumentAPI } from "./documents";
import { ChatAPI } from "./chat";

class SuperpoweredApiClient {
  private axiosInstance: AxiosInstance;
  public knowledgeBase: KnowledgeBaseAPI;
  public document: DocumentAPI;
  public chat: ChatAPI;

  constructor(
    username: string,
    password: string,
    baseURL: string = "https://api.superpowered.ai/v1"
  ) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString(
          "base64"
        )}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    this.knowledgeBase = new KnowledgeBaseAPI(this.axiosInstance);
    this.document = new DocumentAPI(this.axiosInstance);
    this.chat = new ChatAPI(this.axiosInstance);
  }
}

export { SuperpoweredApiClient };
