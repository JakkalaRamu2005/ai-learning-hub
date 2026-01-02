import React from 'react';
import '@/components/style/static-pages.css';

const TermsOfService = () => {
    return (
        <div className="static-page">
            <div className="static-container">
                <h1 className="static-title">Terms of Service</h1>
                <p className="static-subtitle">Last Updated: January 1, 2026</p>

                <div className="static-content">
                    <section>
                        <h2>1. Acceptance of Terms</h2>
                        <p>By accessing or using AI Learning Hub, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.</p>
                    </section>

                    <section>
                        <h2>2. User Accounts</h2>
                        <p>To access certain features, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                    </section>

                    <section>
                        <h2>3. Use of Services</h2>
                        <p>You agree to use our services only for lawful purposes and in accordance with these terms. You may not:</p>
                        <ul>
                            <li>Use the service in any way that violates applicable laws</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Interfere with or disrupt the integrity or performance of the service</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Intellectual Property</h2>
                        <p>All content and materials available on AI Learning Hub, including but not limited to text, graphics, logos, and software, are the property of AI Learning Hub or its licensors and are protected by intellectual property laws.</p>
                    </section>

                    <section>
                        <h2>5. Limitation of Liability</h2>
                        <p>In no event shall AI Learning Hub be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the service.</p>
                    </section>

                    <section>
                        <h2>6. Termination</h2>
                        <p>We reserve the right to terminate or suspend your account and access to our services at our sole discretion, without notice, for conduct that we believe violates these terms or is harmful to other users.</p>
                    </section>

                    <section>
                        <h2>7. Governing Law</h2>
                        <p>These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
