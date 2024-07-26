# Superpowered API Client

This package provides a TypeScript client for interacting with the [Superpowered AI](https://superpowered.ai/) API. It allows you to manage knowledge bases, documents, and chat interactions programmatically.

## Installation

```
npm install superpowered-sdk
```

## Usage

First, import and instantiate the client:

```typescript
import { SuperpoweredApiClient } from "superpowered-sdk";

const client = new SuperpoweredApiClient("your-username", "your-password");
```

The client provides access to several APIs:

- `knowledgeBase`: Manage knowledge bases
- `document`: Handle documents within knowledge bases
- `chat`: Interact with chat threads

### Knowledge Base Operations

```typescript
// List knowledge bases
const { knowledge_bases } = await client.knowledgeBase.listKnowledgeBases();

// Create a new knowledge base
const newKB = await client.knowledgeBase.createKnowledgeBase({
  title: "My Knowledge Base",
  description: "A sample knowledge base",
});

// Query knowledge bases
const results = await client.knowledgeBase.queryKnowledgeBases({
  query: "What is machine learning?",
  knowledge_base_ids: ["kb_id_1", "kb_id_2"],
});
```

### Document Operations

```typescript
// List documents in a knowledge base
const { documents } = await client.document.listDocuments("kb_id");

// Upload a document
const uploadResult = await client.document.uploadDocument(
  "kb_id",
  fileBuffer,
  "document.pdf"
);

// Create a document from raw text
const textDoc = await client.document.createDocumentWithRawText("kb_id", {
  content: "This is the document content.",
  title: "Sample Document",
});
```

### Chat Operations

```typescript
// Create a chat thread
const thread = await client.chat.createChatThread({
  title: "Support Chat",
  knowledge_base_ids: ["kb_id_1"],
});

// Get a chat response
const response = await client.chat.getChatThreadResponse(thread.id, {
  message: "Hello, how can you help me?",
});
```

## API Reference

For detailed information on all available methods and their parameters, refer to the TypeScript definitions in the source code.

## Error Handling

The client methods will throw errors for network issues or API errors. Always wrap API calls in try/catch blocks for proper error handling.

```typescript
try {
  const result = await client.knowledgeBase.listKnowledgeBases();
  // Handle successful response
} catch (error) {
  // Handle error
  console.error("An error occurred:", error);
}
```

## Contributing

Contributions are welcome! Please submit pull requests with any enhancements, bug fixes, or documentation improvements.

## License

MIT License
