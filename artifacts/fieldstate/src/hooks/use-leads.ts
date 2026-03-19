import { useState } from "react";

export interface LeadSubmissionData {
  source: string;
  name?: string;
  email: string;
  message?: string;
  inquiryType?: string;
  route?: string;
  honeypot?: string;
}

export function useSubmitLead() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const submit = async (data: LeadSubmissionData) => {
    setIsPending(true);
    setError(null);
    setIsSuccess(false);
    
    // Simulate honeypot check immediately on client
    if (data.honeypot) {
      setIsPending(false);
      // Fail silently for bots
      return; 
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to submit lead');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsPending(false);
    }
  };

  return { submit, isPending, error, isSuccess, reset: () => { setIsSuccess(false); setError(null); } };
}
