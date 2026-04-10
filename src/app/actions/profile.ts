'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Não autorizado');
  }

  let graduationDate = formData.get('graduationDate') as string || null;
  if (graduationDate && graduationDate.length === 7) {
    // If it's just YYYY-MM from the month picker, append -01 to make it a valid date
    graduationDate = `${graduationDate}-01`;
  }

  const profileData = {
    user_id: user.id,
    full_name: formData.get('fullName') as string,
    birth_date: formData.get('birthDate') as string,
    dojo_name: formData.get('dojoName') as string,
    belt_id: formData.get('beltId') as string,
    belt_graduation_date: graduationDate,
  };

  // Upsert to handle both insert and updates
  const { error } = await supabase
    .from('user_profile')
    .upsert(profileData, { onConflict: 'user_id' });

  if (error) {
    console.error('Erro ao salvar perfil:', error);
    throw new Error(error.message);
  }

  revalidatePath('/', 'layout');
}

export async function getUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('user_profile')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error("Erro fetching profile:", error);
    return null;
  }

  return data;
}
