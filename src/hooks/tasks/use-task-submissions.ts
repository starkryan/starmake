import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { TaskSubmission } from '@/types';

export function useTaskSubmissions(userId: string | null) {
  const [taskSubmissions, setTaskSubmissions] = useState<TaskSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchTaskSubmissions();
    } else {
      setTaskSubmissions([]);
      setLoading(false);
    }
  }, [userId]);

  const fetchTaskSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('task_submissions')
        .select(`
          *,
          tasks!inner (title, task_type, price)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;
      setTaskSubmissions(data || []);
    } catch (err) {
      console.error('Error fetching task submissions:', err);
      setError('Failed to fetch task submissions');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchTaskSubmissions();
  };

  return {
    taskSubmissions,
    loading,
    error,
    refetch
  };
}
