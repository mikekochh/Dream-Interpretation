import React from 'react';

const TermsView = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-3xl mx-auto overflow-auto h-[80vh]">
                <h1 className="text-2xl font-bold mb-4 text-center">Dream Oracles - Terms of Service</h1>
                <div className="text-gray-800 space-y-4">
                    <p>
                        Welcome to Dream Oracles! By accessing or using our website, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">1. Introduction</h2>
                    <p>
                        These terms govern your use of our website and services, including any AI-powered dream interpretation features. By using our site, you acknowledge that the interpretations provided are for informational and entertainment purposes only.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">2. Disclaimer of Liability</h2>
                    <p>
                        The AI-generated interpretations on this website do not constitute professional advice. We make no guarantees as to the accuracy or relevance of any content provided. Please consult a professional for any serious mental health or well-being concerns.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">3. Limitation of Liability</h2>
                    <p>
                        To the fullest extent permitted by law, Dream Oracles disclaims all liability for any damages resulting from the use of our website or reliance on the interpretations provided.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">4. Intellectual Property</h2>
                    <p>
                        All content on this website, including AI interpretations, is owned by Dream Oracles. Users may not distribute, modify, or commercially exploit any part of the content.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">5. Prohibited Uses</h2>
                    <p>
                        Users agree not to engage in any activities that could harm our website, including hacking, scraping, or using the service for unlawful purposes.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">6. User Accounts and Security</h2>
                    <p>
                        Users are responsible for maintaining the security of their accounts and agree to notify us of any unauthorized access.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">7. Modifications to Service</h2>
                    <p>
                        We reserve the right to modify or discontinue our service at any time without notice. Continued use of the site after modifications implies acceptance of the updated terms.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">8. Governing Law</h2>
                    <p>
                        These terms are governed by the laws of the State of New Jersey, USA. Any disputes shall be resolved in the courts of New Jersey.
                    </p>

                    <p className="text-sm text-gray-600 mt-4">
                        Last updated on 11/2/2024.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsView;
