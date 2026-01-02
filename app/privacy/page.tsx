import React from 'react';
import '@/components/style/static-pages.css';

const PrivacyPolicy = () => {
    return (
        <div className="static-page">
            <div className="static-container">
                <h1 className="static-title">Privacy Policy</h1>
                <p className="static-subtitle">Last Updated: January 1, 2026</p>

                <div className="static-content">
                    <section>
                        <h2>1. Introduction</h2>
                        <p>Welcome to AI Learning Hub ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.</p>
                    </section>

                    <section>
                        <h2>2. Information We Collect</h2>
                        <p>We collect information that you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support. This may include:</p>
                        <ul>
                            <li>Name and contact information (email address)</li>
                            <li>Social media profile information (if you use GitHub or Google sign-in)</li>
                            <li>Usage data and preferences</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul>
                            <li>Provide, maintain, and improve our services</li>
                            <li>Personalize your learning experience</li>
                            <li>Communicate with you about updates and features</li>
                            <li>Protect the security and integrity of our platform</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Data Security</h2>
                        <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>
                    </section>

                    <section>
                        <h2>5. Your Rights</h2>
                        <p>You have the right to access, correct, or delete your personal information. You can manage your account settings or contact us for assistance regarding your data.</p>
                    </section>

                    <section>
                        <h2>6. Changes to This Policy</h2>
                        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
                    </section>

                    <section>
                        <h2>7. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at support@ailearninghub.com.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
