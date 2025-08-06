import React from 'react';
import '../css/About.css'; // 👈 Import file CSS vừa tạo

function About() {
  return (
    <div className="about-container">
      <section className="about-section section-blue">
        <h2>💼 About FX Rate Dashboard</h2>
        <p>
          FX Rate Dashboard is a real-time currency monitoring platform designed to help you track exchange rates effortlessly and make smarter financial decisions every day.
        </p>  
        <p>
          Whether you're a traveler planning your next trip, an entrepreneur managing international payments, or simply someone who wants to stay informed — FX Rate Dashboard delivers accurate, live data when it matters most.
        </p>  
      </section>  

      <section className="about-section section-purple">
        <h2>🌟 Why Choose Us?</h2>
        <ul>
          <li><strong>🌐 Real-Time Global Rates:</strong> Get up-to-the-second updates from reliable financial sources across the world.</li>
          <li><strong>📊 User-Friendly Design:</strong> Intuitive for beginners, insightful for analysts. Clean interface. Instant data.</li>
          <li><strong>🔐 Privacy-Focused:</strong> We respect your privacy. No ads. No trackers. No nonsense.</li>
          <li><strong>🚀 Future-Ready Tools:</strong> Historical charts, custom alerts, and AI-driven trends — coming soon.</li>
        </ul>
      </section>

      <section className="about-section section-green">
        <h2>👁️ Our Vision</h2>
        <p>
          We envision a world where financial transparency is universal — where anyone, regardless of location or expertise, can access accurate, real-time exchange data and use it confidently in their daily lives.
        </p>
        <p>
          At FX Rate Dashboard, our goal is to democratize financial insight, empower individuals, and bridge gaps across global economies with a simple yet powerful tool.
        </p>
      </section>

      <section className="about-section section-indigo">
        <h2>🤝 Our Team</h2>
        <p>
          We're a small but passionate team of developers, designers, and data lovers committed to building tools that put users first. Every pixel, every API call, and every update is crafted with care, performance, and purpose.
        </p>
        <p>
          We collaborate across borders and time zones, inspired by a shared mission to make exchange rates transparent, useful, and empowering.
        </p>
      </section>

      <section className="about-section section-founder">
        <h2>👤 Founder’s Story – Lê Hoàng Vĩ</h2>
        <p>Lê Hoàng Vĩ is the heart and mind behind FX Rate Dashboard.</p>
        <p>
          Growing up in Vietnam, Vĩ always had a deep curiosity about technology and global finance. As a student of computer science with a passion for clean design and social impact, he noticed how hard it was for ordinary people to access real-time currency data — especially in local communities with limited financial tools.
        </p>
        <p>Instead of settling for complex or outdated solutions, Vĩ decided to build his own.</p>
        <p>
          Starting with just a laptop, a strong cup of coffee, and a dream, he developed FX Rate Dashboard — a lightweight, fast, and privacy-focused app that brings exchange rates to everyone in an intuitive way.
        </p>
        <blockquote>
          "Technology should empower, not overwhelm. Everyone deserves financial clarity — not just experts."
        </blockquote>
        <p>
          Today, Lê Hoàng Vĩ continues to lead development, driven by a mission to make financial tools accessible, reliable, and human-centered.
        </p>
      </section>
    </div>
  );
}

export default About;
