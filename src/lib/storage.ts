import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Uploads an image Buffer to Supabase Storage and returns the public URL.
 * @param buffer - The image data as a Buffer
 * @param filename - A unique name for the file
 * @param contentType - Optional MIME type (e.g., 'image/png')
 * @returns The public URL of the uploaded image
 */
export async function uploadResultImage(
  buffer: Buffer,
  filename: string,
  contentType: string = "image/png"
): Promise<string> {
  const { data, error } = await supabase.storage
    .from("uploads") // Using the same 'uploads' bucket for now
    .upload(`results/${filename}`, buffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("uploads")
    .getPublicUrl(`results/${filename}`);

  return publicUrlData.publicUrl;
}
