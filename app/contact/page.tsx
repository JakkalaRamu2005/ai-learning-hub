import React from 'react';
import '@/components/style/static-pages.css';

const Contact = () => {
    return (
        <div className="static-page">
            <div className="static-container">
                <h1 className="static-title">Contact Us</h1>
                <p className="static-subtitle">Have questions or feedback? We'd love to hear from you. Our team typically responds within 24 hours.</p>

                <div className="static-content">
                    <div className="static-grid">
                        <section>
                            <h2>Get in Touch</h2>
                            <p>For general inquiries, partnership opportunities, or support questions, feel free to reach out through any of the channels below.</p>

                            <div className="static-card contact-card-margin">
                                <h3>📧 Email</h3>
                                <p>support@ailearninghub.com</p>
                            </div>

                            <div className="static-card">
                                <h3>📍 Location</h3>
                                <p>Hyderabad, India<br />Global Remote Team</p>
                            </div>
                        </section>

                        <section>
                            <h2>Send a Message</h2>
                            <form className="contact-form">
                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Message</label>
                                    <textarea
                                        rows={4}
                                        placeholder="How can we help you?"
                                        className="form-input form-textarea"
                                    ></textarea>
                                </div>
                                <button
                                    type="button"
                                    className="submit-btn"
                                >
                                    Send Message
                                </button>
                            </form>
                        </section>
                    </div>

                    <section className="support-hours">
                        <h2>Support Hours</h2>
                        <p>Monday — Friday: 9:00 AM — 6:00 PM (IST)</p>
                        <p>Saturday: 10:00 AM — 2:00 PM (IST)</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Contact;
