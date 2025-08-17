'use server';
/**
 * @fileOverview Implements semantic search on documents using the Gemini API.
 *
 * - semanticSearchWithGemini - A function that performs semantic search on documents.
 * - SemanticSearchWithGeminiInput - The input type for the semanticSearchWithGemini function.
 * - SemanticSearchWithGeminiOutput - The return type for the semanticSearchWithGemini function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SemanticSearchWithGeminiInputSchema = z.object({
  query: z.string().describe('The search query in natural language.'),
  documentId: z.string().describe('The ID of the document to search within.'),
});
export type SemanticSearchWithGeminiInput = z.infer<typeof SemanticSearchWithGeminiInputSchema>;

const SemanticSearchWithGeminiOutputSchema = z.object({
  results: z.array(
    z.object({
      text: z.string().describe('The relevant text snippet from the document.'),
      citation: z.string().describe('The citation for the snippet (e.g., file name and page number).'),
    })
  ).describe('The search results with text snippets and citations.'),
});
export type SemanticSearchWithGeminiOutput = z.infer<typeof SemanticSearchWithGeminiOutputSchema>;

export async function semanticSearchWithGemini(input: SemanticSearchWithGeminiInput): Promise<SemanticSearchWithGeminiOutput> {
  return semanticSearchWithGeminiFlow(input);
}

const prompt = ai.definePrompt({
  name: 'semanticSearchWithGeminiPrompt',
  input: {schema: SemanticSearchWithGeminiInputSchema},
  output: {schema: SemanticSearchWithGeminiOutputSchema},
  prompt: `You are a search assistant helping users find relevant information in their documents.

  The user is asking the following question:
  {{query}}

  Return the most relevant text snippets from the document with their corresponding citations (file name and page number).
`,
});

const semanticSearchWithGeminiFlow = ai.defineFlow(
  {
    name: 'semanticSearchWithGeminiFlow',
    inputSchema: SemanticSearchWithGeminiInputSchema,
    outputSchema: SemanticSearchWithGeminiOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
