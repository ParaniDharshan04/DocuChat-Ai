export type Document = {
  id: string;
  name: string;
  type: 'PDF' | 'TXT' | 'MD';
  createdAt: Date;
};

export type Citation = {
  text: string;
  citation: string;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: Citation[];
  createdAt: Date;
};
