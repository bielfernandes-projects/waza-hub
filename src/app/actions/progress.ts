'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleTechniqueProgress(techniqueId: string, isCompleted: boolean) {
  console.log(`[Progress Action] Toggling technique ${techniqueId} to ${isCompleted}`)
  
  const supabase = await createClient()

  // 1. Get current user securely
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error(`[Progress Action] Auth Error:`, userError)
    throw new Error('User not authenticated')
  }

  // 2. Check if a record already exists
  const { data: existingRecord, error: selectError } = await supabase
    .from('progress')
    .select('id, completed')
    .eq('user_id', user.id)
    .eq('technique_id', techniqueId)
    .maybeSingle()

  if (selectError) {
    console.error(`[Progress Action] Select Error:`, selectError)
    throw new Error('Failed to fetch existing progress')
  }

  if (existingRecord) {
    // 3A. Update existing record
    console.log(`[Progress Action] Record exists (${existingRecord.id}), updating to ${isCompleted}`)
    const { error: updateError } = await supabase
      .from('progress')
      .update({ completed: isCompleted })
      .eq('id', existingRecord.id)

    if (updateError) {
      console.error(`[Progress Action] Update Error:`, updateError)
      throw new Error('Failed to update progress')
    }
  } else {
    // 3B. Insert new record
    console.log(`[Progress Action] No record found. Inserting new progress record.`)
    const { error: insertError } = await supabase
      .from('progress')
      .insert({
        user_id: user.id,
        technique_id: techniqueId,
        completed: isCompleted
      })

    if (insertError) {
      console.error(`[Progress Action] Insert Error:`, insertError)
      throw new Error('Failed to insert progress')
    }
  }

  console.log(`[Progress Action] Successfully changed progress for ${techniqueId}`)

  // 4. Force a generic layout revalidation to guarantee UI sync globally
  revalidatePath('/', 'layout')
}
