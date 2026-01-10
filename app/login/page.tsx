import LoginForm from '@/components/onboarding/LoginForm';

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 w-full">
                <LoginForm />
            </div>
        </main>
    );
}
