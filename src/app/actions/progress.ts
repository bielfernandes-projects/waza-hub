'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleTechniqueProgress(techniqueId: string, isCompleted: boolean) {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  if (isCompleted) {
    // Insert completion record
    const { error } = await supabase
      .from('progress')
      .upsert({
        user_id: user.id,
        technique_id: techniqueId,
        completed: true
      }, {
        onConflict: 'user_id, technique_id'
      })

    if (error) {
      console.error("Error setting progress:", error)
      throw new Error('Failed to update progress')
    }
  } else {
    // Alternatively, update it to complete = false or just delete it.
    // Deleting is cleaner if `completed` is just a boolean existance,
    // but updating keeps history (created_at). We'll update completed=false.
    const { error } = await supabase
      .from('progress')
      .upsert({
        user_id: user.id,
        technique_id: techniqueId,
        completed: false
      }, {
        onConflict: 'user_id, technique_id'
      })

    if (error) {
      console.error("Error updating progress:", error)
      throw new Error('Failed to update progress')
    }
  }

  // Revalidate so the page re-fetches the correct progress dynamically
  revalidatePath('/belts/[slug]', 'page')
  revalidatePath('/')
}
