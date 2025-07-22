import React from 'react';

const Disclaimer = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Disclaimer</h1>
      <p className="text-sm text-gray-500 mb-6">Last updated: July 22, 2025</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. General Information</h2>
        <p>
          The information provided by FX Rate Dashboard (“we,” “us,” or “our”) on this website is for general informational purposes only. All information on the site is provided in good faith; however, we make no representation or warranty of any kind regarding the accuracy, adequacy, validity, reliability, or completeness of any information on the site.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. No Professional Advice</h2>
        <p>
          The site cannot and does not contain financial or investment advice. The information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with appropriate professionals.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. External Links Disclaimer</h2>
        <p>
          The site may contain (or you may be sent through the site) links to other websites or content belonging to or originating from third parties. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Investment Risks</h2>
        <p>
          Foreign exchange and investment markets involve risks, including the loss of your investment. We do not accept liability for any loss or damage that may arise directly or indirectly from use of or reliance on such information.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Use at Your Own Risk</h2>
        <p>
          Your use of the site and your reliance on any information on the site is solely at your own risk.
        </p>
      </section>

      <p className="mt-8">
        If you have any questions or concerns about this disclaimer, feel free to contact us at{' '}
        <a href="mailto:contact@yourwebsite.com" className="text-blue-600 underline">
          contact@yourwebsite.com
        </a>.
      </p>
    </div>
  );
};

export default Disclaimer;
