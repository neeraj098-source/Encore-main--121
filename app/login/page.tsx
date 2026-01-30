import LoginForm from '@/components/onboarding/LoginForm';

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            <div className="relative z-10 w-full">
                <LoginForm />
            </div>
        </main>
    );
}
