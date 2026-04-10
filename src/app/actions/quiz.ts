'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { BELTS } from '@/lib/data'
import { QuizQuestion, QuizAttempt } from '@/types/quiz'
import { revalidatePath } from 'next/cache'

// Count rules defined based on requirement overlap decisions
const COUNT_RULES: Record<string, number> = {
  'branca-cinza': 10,
  'cinza': 10,
  'cinza-azul': 10,
  'azul': 15,
  'azul-amarela': 15,
  'amarela': 15,
  'amarela-laranja': 15,
  'laranja': 20,
  'verde': 20,
  'roxa': 25,
  'marrom': 30,
  'preta': 30
};

export async function fetchQuizQuestions(beltId: string): Promise<QuizQuestion[]> {
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
            // Ignore error
          }
        },
      },
    }
  )

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) throw new Error('User not authenticated')

  const beltIndex = BELTS.findIndex(b => b.id === beltId || b.slug === beltId)
  if (beltIndex === -1) throw new Error('Invalid belt')

  const allowedBelts = BELTS.slice(0, beltIndex + 1).map(b => b.id)
  const limit = COUNT_RULES[beltId] || 10;

  // Fetch all allowed questions
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*')
    .in('belt_id', allowedBelts)

  if (error) {
    console.error('[Quiz] Error fetching questions:', error)
    throw new Error('Failed to fetch questions')
  }

  const questions = (data as QuizQuestion[]) || [];

  // Shuffle options for all questions
  questions.forEach(q => {
    const opts = [...q.options];
    for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    q.options = opts;
  });

  // Balanced distribution: split by type
  const byType: Record<string, QuizQuestion[]> = { technique: [], history: [], vocab: [] }
  
  // Shuffle array before distributing to ensure randomness inside buckets
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }

  questions.forEach(q => {
     if (!byType[q.type]) byType[q.type] = [];
     byType[q.type].push(q);
  });
  
  const result: QuizQuestion[] = [];
  const types = Object.keys(byType).filter(k => byType[k].length > 0);
  
  if (types.length === 0) return result; // No questions found

  let turn = 0;
  while(result.length < limit) {
     const currentType = types[turn % types.length];
     const question = byType[currentType].pop();
     if (question) {
       result.push(question);
     }
     
     // Check if we ran out of all questions
     const totalLeft = types.reduce((acc, t) => acc + byType[t].length, 0);
     if (totalLeft === 0) break;
     
     turn++;
  }
  
  // Final shuffle to mix types
  for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export async function saveQuizAttempt(attempt: Pick<QuizAttempt, 'belt_id' | 'score' | 'total_questions' | 'answers'>) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: user.id,
      belt_id: attempt.belt_id,
      score: attempt.score,
      total_questions: attempt.total_questions,
      answers: attempt.answers
    })

  if (error) {
    console.error('[Quiz Action] Insert Error:', error)
    throw new Error('Failed to save attempt')
  }

  revalidatePath('/quiz')
}

export async function fetchQuizHistory(): Promise<QuizAttempt[]> {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[Quiz Action] Fetch Error:', error)
    return []
  }

  return data as QuizAttempt[]
}
