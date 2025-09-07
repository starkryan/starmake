import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RedeemRequest } from '@/types';

export function useRedeemRequests(userId: string | null) {
  const [redeemRequests, setRedeemRequests] = useState<RedeemRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchRedeemRequests();
    } else {
      setRedeemRequests([]);
      setLoading(false);
    }
  }, [userId]);

  const fetchRedeemRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('redeem_requests')
        .select(`
          *,
          salary_codes!inner (code, task, price)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;
      setRedeemRequests(data || []);
    } catch (err) {
      console.error('Error fetching redemption requests:', err);
      setError('Failed to fetch redemption requests');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchRedeemRequests();
  };

  return {
    redeemRequests,
    loading,
    error,
    refetch
  };
}
