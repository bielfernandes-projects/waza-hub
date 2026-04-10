import { fetchQuizQuestions } from '@/app/actions/quiz'
import { QuizFlow } from '@/components/quiz/QuizFlow'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function QuizFlowPage({ params }: { params: Promise<{ belt: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { belt } = await params;

  // Let Server Action do the DB fetching and shuffling
  let questions: any[] = [];
  try {
     questions = await fetchQuizQuestions(belt);
  } catch (error) {
     console.error('Failed to load quiz from DB:', error);
  }

  return (
     <main className="w-full min-h-[calc(100vh-80px)] bg-gray-50 flex">
        <QuizFlow questions={questions} beltId={belt} />
     </main>
  );
}
