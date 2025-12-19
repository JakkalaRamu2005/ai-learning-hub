export default function VerifySuccess() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Email Verified! ✅</h1>
                <p className="mb-4">Your email has been successfully verified.</p>
                <a href="/login" className="text-blue-500 underline">
                    Go to Login
                </a>
            </div>
        </div>
    );
}
