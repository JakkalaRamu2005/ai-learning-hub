import React from 'react';
import '@/components/style/static-pages.css';

const CookiePolicy = () => {
    return (
        <div className="static-page">
            <div className="static-container">
                <h1 className="static-title">Cookie Policy</h1>
                <p className="static-subtitle">Last Updated: January 1, 2026</p>

                <div className="static-content">
                    <section>
                        <h2>1. What Are Cookies?</h2>
                        <p>Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.</p>
                    </section>

                    <section>
                        <h2>2. How We Use Cookies</h2>
                        <p>We use cookies for several reasons, including:</p>
                        <ul>
                            <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly, such as managing your login session.</li>
                            <li><strong>Analytical Cookies:</strong> These help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
                            <li><strong>Preference Cookies:</strong> These allow the website to remember choices you make (such as your theme preference) to provide a more personalized experience.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Your Choices Regarding Cookies</h2>
                        <p>Most web browsers allow you to control cookies through their settings. You can choose to block or delete cookies, but please note that some features of our website may not function correctly if you disable essential cookies.</p>
                    </section>

                    <section>
                        <h2>4. Third-Party Cookies</h2>
                        <p>We may also use third-party cookies, such as those from Google Analytics, to help us analyze website traffic and improve our services.</p>
                    </section>

                    <section>
                        <h2>5. Updates to This Policy</h2>
                        <p>We may update our Cookie Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date.</p>
                    </section>

                    <section>
                        <h2>6. Contact Information</h2>
                        <p>If you have any questions about our use of cookies, please contact us at support@ailearninghub.com.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default CookiePolicy;
