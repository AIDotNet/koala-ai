import { ReactNode } from 'react';

export interface MarkdownElementProps {
  children: ReactNode;
  id: number;
  type: string;
}
