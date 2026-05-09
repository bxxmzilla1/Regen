export type RegenerationMode = 
  | 'Viral' 
  | 'SEO' 
  | 'Aesthetic' 
  | 'Fanpage' 
  | 'TikTok' 
  | 'YouTube Shorts' 
  | 'Clean Professional';

export interface RegenerationOutput {
  id: string;
  originalText: string;
  modes: RegenerationMode[];
  titles: string[];
  captions: string[];
  seoDescriptions: string[];
  hashtags: string[];
  hooks: string[];
  createdAt: number;
}
