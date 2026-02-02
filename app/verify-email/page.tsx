'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No token provided.');
            return;
        }

        // Prevent double firing in strict mode (useEffect runs twice)
        if (verifying) return;
        setVerifying(true);

        const verify = async () => {
            try {
                const res = await fetch('/api/verify-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();

                if (res.ok) {
                    setStatus('success');
                    setMessage('Email verified successfully! You can now log in.');
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Verification failed.');
                }
            } catch (err) {
                setStatus('error');
                setMessage('An error occurred. Please try again.');
            }
        };

        verify();
    }, [token]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">Email Verification</h1>

                {status === 'loading' && (
                    <div className="text-center">
                        <p className="text-gray-600">Verifying your email...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="text-center">
                        <div className="mb-4 flex justify-center text-green-500">
                            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="mb-6 text-gray-700">{message}</p>
                        <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                            Go to Login
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="text-center">
                        <div className="mb-4 flex justify-center text-red-500">
                            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <p className="mb-6 text-red-600">{message}</p>
                        <div className="space-y-2">
                            <Link href="/register" className="block text-blue-600 hover:text-blue-800 underline">
                                Back to Registration
                            </Link>
                            <Link href="/login" className="block text-gray-600 hover:text-gray-800 underline text-sm">
                                Go to Login
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}
