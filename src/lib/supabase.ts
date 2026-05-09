import { createClient } from '@supabase/supabase-js';
import { RegenerationOutput } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---------- DB helpers ----------

export async function fetchGenerations(userId: string): Promise<RegenerationOutput[]> {
  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;

  return (data ?? []).map(row => ({
    id: row.id,
    originalText: row.original_text,
    modes: row.modes,
    titles: row.titles,
    captions: row.captions,
    seoDescriptions: row.seo_descriptions,
    hashtags: row.hashtags,
    hooks: row.hooks,
    createdAt: row.created_at,
  }));
}

export async function saveGeneration(userId: string, output: RegenerationOutput): Promise<void> {
  const { error } = await supabase.from('generations').insert({
    id: output.id,
    user_id: userId,
    original_text: output.originalText,
    modes: output.modes,
    titles: output.titles,
    captions: output.captions,
    seo_descriptions: output.seoDescriptions,
    hashtags: output.hashtags,
    hooks: output.hooks,
    created_at: output.createdAt,
  });

  if (error) throw error;
}

export async function deleteGeneration(id: string): Promise<void> {
  const { error } = await supabase.from('generations').delete().eq('id', id);
  if (error) throw error;
}
