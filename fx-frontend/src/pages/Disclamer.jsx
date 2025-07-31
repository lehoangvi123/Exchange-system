import React, { useEffect, useState } from 'react';

const Disclaimer = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <div>
      <style>{`
        .disclaimer-container {
          max-width: 768px;
          margin: 2rem auto;
          padding: 2rem 1.5rem;
          background-color: white;
          border-radius: 1rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #1f2937;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .disclaimer-container.loaded {
          opacity: 1;
          transform: translateY(0);
        }

        .disclaimer-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: #1d4ed8; /* Xanh dương đậm */
        }

        .disclaimer-updated {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .disclaimer-section {
          margin-bottom: 2.25rem;
          padding-left: 1rem;
          border-left: 4px solid #facc15; /* Vàng */
          background: #f9fafb;
          border-radius: 0.5rem;
          padding-top: 1rem;
          padding-bottom: 1rem;
        }

        .disclaimer-heading {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #1d4ed8;
          transition: all 0.3s ease;
          position: relative;
        }

        .disclaimer-heading::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0%;
          height: 3px;
          background-color: #facc15;
          transition: width 0.3s ease;
        }

        .disclaimer-heading:hover::after {
          width: 100%;
        }

        .disclaimer-text {
          font-size: 1rem;
          line-height: 1.75;
          color: #374151;
        }

        .disclaimer-contact {
          margin-top: 2.5rem;
          font-size: 1rem;
          color: #1f2937;
        }

        .disclaimer-contact a {
          display: inline-block;
          margin-top: 0.5rem;
          background-color: #facc15;
          color: #1f2937;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          text-decoration: none;
          transition: background 0.3s ease;
        }

        .disclaimer-contact a:hover {
          background-color: #eab308;
          color: white;
        }

        @media (max-width: 640px) {
          .disclaimer-title {
            font-size: 2rem;
          }

          .disclaimer-heading {
            font-size: 1.125rem;
          }

          .disclaimer-container {
            border-radius: 0.75rem;
          }
        }
      `}</style>

      <div className={`disclaimer-container ${loaded ? 'loaded' : ''}`}>
        <h1 className="disclaimer-title">Disclaimer</h1>
        <p className="disclaimer-updated">Last updated: July 22, 2025</p>

        {[
          {
            title: '1. General Information',
            content:
              'The information provided by FX Rate Dashboard (“we,” “us,” or “our”) on this website is for general informational purposes only. All information on the site is provided in good faith; however, we make no representation or warranty of any kind regarding the accuracy, adequacy, validity, reliability, or completeness of any information on the site.',
          },
          {
            title: '2. No Professional Advice',
            content:
              'The site cannot and does not contain financial or investment advice. The information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with appropriate professionals.',
          },
          {
            title: '3. External Links Disclaimer',
            content:
              'The site may contain (or you may be sent through the site) links to other websites or content belonging to or originating from third parties. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites.',
          },
          {
            title: '4. Investment Risks',
            content:
              'Foreign exchange and investment markets involve risks, including the loss of your investment. We do not accept liability for any loss or damage that may arise directly or indirectly from use of or reliance on such information.',
          },
          {
            title: '5. Use at Your Own Risk',
            content:
              'Your use of the site and your reliance on any information on the site is solely at your own risk.',
          },
        ].map((item, index) => (
          <section key={index} className="disclaimer-section">
            <h2 className="disclaimer-heading">{item.title}</h2>
            <p className="disclaimer-text">{item.content}</p>
          </section>
        ))}

        <div className="disclaimer-contact">
          <p>If you have any questions or concerns about this disclaimer, feel free to contact us:</p>
          <a href="mailto:lehoangvi.work@gmail.com">lehoangvi.work@gmail.com</a>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
