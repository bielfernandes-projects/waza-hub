'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function toggleTechniqueProgress(techniqueId: string, isCompleted: boolean) {
  console.log(`[Progress Action] Toggling technique ${techniqueId} to ${isCompleted}`)
  
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore error from setAll during Server Action
          }
        },
      },
    }
  )

  // 1. Get current user securely
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error(`[Progress Action] Auth Error:`, userError)
    throw new Error('User not authenticated')
  }

  console.log(`[Progress Action] Authenticated user: ${user.id}`)

  // 2. Check if a record already exists
  const { data: existingRecord, error: selectError } = await supabase
    .from('progress')
    .select('id, completed')
    .eq('user_id', user.id)
    .eq('technique_id', techniqueId)
    .limit(1)
    .maybeSingle()

  if (selectError) {
    console.error(`[Progress Action] Select Error:`, selectError)
    throw new Error(`Select Error: ${selectError.message} (Code: ${selectError.code})`)
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
