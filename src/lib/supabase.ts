import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qedaagbwugpptuyfvcgg.supabase.co';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Z7sccFJm1ciBraf01VOYHg_QgwTXlMy';

export const isConfigured = !!(rawUrl && rawKey);

const supabaseUrl = rawUrl;
const supabaseAnonKey = rawKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


/**
 * Helper to upload files to Supabase Storage.
 * Creates a public URL for the uploaded file.
 */
export async function uploadFile(bucketName: string, filePath: string, file: File): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}
