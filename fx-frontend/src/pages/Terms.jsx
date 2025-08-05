import React, { useEffect, useState } from 'react';

const Terms = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <div>
      <style>{`
        .terms-container {
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

        .terms-container.loaded {
          opacity: 1;
          transform: translateY(0);
        }

        .terms-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: #1d4ed8; /* xanh dương đậm */
        }

        .terms-updated {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .terms-section {
          margin-bottom: 2.25rem;
          padding-left: 1rem;
          border-left: 4px solid #facc15; /* vàng tươi */
          background: #f9fafb;
          border-radius: 0.5rem;
          padding-top: 1rem;
          padding-bottom: 1rem;
        }

        .terms-heading {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #1d4ed8;
          transition: all 0.3s ease;
          position: relative;
        }

        .terms-heading::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0%;
          height: 3px;
          background-color: #facc15; /* vàng */
          transition: width 0.3s ease;
        }

        .terms-heading:hover::after {
          width: 100%;
        }

        .terms-text {
          font-size: 1rem;
          line-height: 1.75;
          color: #374151;
        }

        .terms-contact {
          margin-top: 2.5rem;
          font-size: 1rem;
          color: #1f2937;
        }

        .terms-contact a {
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

        .terms-contact a:hover {
          background-color: #eab308;
          color: white;
        }

        @media (max-width: 640px) {
          .terms-title {
            font-size: 2rem;
          }

          .terms-heading {
            font-size: 1.125rem;
          }

          .terms-container {
            border-radius: 0.75rem;
          }
        }
      `}</style>

      <div className={`terms-container ${loaded ? 'loaded' : ''}`}>
        <h1 className="terms-title">Terms of Service</h1>
        <p className="terms-updated">Last updated: July 22, 2025</p>

        {[
          {
            title: '1. Acceptance of Terms',
            content:
              'By accessing and using this website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you are prohibited from using or accessing this site.',
          },
          {
            title: '2. Use License',
            content:
              'Permission is granted to temporarily download one copy of the materials on this website for personal, non-commercial transitory viewing only. This is a grant of a license, not a transfer of title.',
          },
          {
            title: '3. Disclaimer',
            content:
              'The materials on this website are provided "as is". We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties.',
          },
          {
            title: '4. Limitations',
            content:
              'In no event shall the website or its suppliers be liable for any damages arising out of the use or inability to use the materials on this website.',
          },
          {
            title: '5. Accuracy of Materials',
            content:
              'The materials appearing on this website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on the website are accurate, complete, or current.',
          },
          {
            title: '6. Links',
            content:
              'We are not responsible for the contents of any linked site. The inclusion of any link does not imply endorsement by us.',
          },
          {
            title: '7. Modifications',
            content:
              'We may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the current version of these Terms of Service.',
          },
          {
            title: '8. Governing Law',
            content:
              'These terms and conditions are governed by and construed in accordance with the laws of your local jurisdiction.',
          },
        ].map((item, idx) => (
          <section key={idx} className="terms-section">
            <h2 className="terms-heading">{item.title}</h2>
            <p className="terms-text">{item.content}</p>
          </section>
        ))}

        <div className="terms-contact">
          <p>If you have any questions about these Terms, please contact us:</p>
          <a href="mailto:lehoangvi.work@gmail.com">lehoangvi.work@gmail.com</a>
        </div>
      </div>
    </div>
  );
};

export default Terms;
