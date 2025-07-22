import React from 'react';

const Terms = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-6">Last updated: July 22, 2025</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p>
          By accessing and using this website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you are prohibited from using or accessing this site.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of the materials on this website for personal, non-commercial transitory viewing only. This is a grant of a license, not a transfer of title.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Disclaimer</h2>
        <p>
          The materials on this website are provided "as is". We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Limitations</h2>
        <p>
          In no event shall the website or its suppliers be liable for any damages arising out of the use or inability to use the materials on this website.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Accuracy of Materials</h2>
        <p>
          The materials appearing on this website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on the website are accurate, complete, or current.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Links</h2>
        <p>
          We are not responsible for the contents of any linked site. The inclusion of any link does not imply endorsement by us.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Modifications</h2>
        <p>
          We may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the current version of these Terms of Service.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance with the laws of your local jurisdiction.
        </p>
      </section>

      <p className="mt-8">
        If you have any questions about these Terms, please contact us at{' '}
        <a href="mailto:contact@yourwebsite.com" className="text-blue-600 underline">
          contact@yourwebsite.com
        </a>.
      </p>
    </div>
  );
};

export default Terms;
