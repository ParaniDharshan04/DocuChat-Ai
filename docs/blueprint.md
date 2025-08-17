# **App Name**: DocuChat AI

## Core Features:

- Document Upload: Implement a drag-and-drop file upload area that accepts PDF, TXT, and MD files.
- Chat Interface: Design a chat-style interface for users to input questions and receive answers.
- Embeddings Generation: Automatically generate embeddings for uploaded documents using the Gemini API and store them in Firebase Vector Search. This process is initiated automatically as soon as the document has been stored.
- Semantic Search with Gemini: Employ Gemini API to perform similarity search on stored document embeddings in response to user questions, retrieving relevant document snippets. The Gemini API will also act as a tool to identify appropriate citations and integrate them in the response.
- Citation-Backed Results: Display search results (answers) in an easy-to-read panel. Highlight citations, linking them back to specific documents and page numbers.

## Style Guidelines:

- Primary color: Deep indigo (#4B0082) to convey intelligence, sophistication and trustworthiness.
- Background color: Very light lavender (#F0F8FF).
- Accent color: Soft amber (#FFC107), for a muted contrast with the dark primary color; use it sparingly, to call attention to points of user interaction.
- Font pairing: 'Space Grotesk' (sans-serif) for headlines and 'Inter' (sans-serif) for body text. The combination offers a balance of modern aesthetics and readability.