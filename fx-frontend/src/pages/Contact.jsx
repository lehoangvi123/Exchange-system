import React, { useState } from 'react';
import axios from 'axios';
import '../css/Contact.css';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/feedback', form);
      if (res.data.success) {
        setStatus('✅ Message sent successfully!');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('❌ Failed to send message.');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('❌ Server error. Please try again.');
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2>Contact Us</h2>
      <input
        type="text"
        name="name"
        placeholder="Your Name" 
        class="Yourname"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        class="YourEmail"
        value={form.email}
        onChange={handleChange}
        required
      />
      <textarea
        name="message"
        placeholder="Your Message" 
        class="YourMessage"
        value={form.message}
        onChange={handleChange}
        required
      />
      <button type="submit">Send</button>
      {status && <p className="status">{status}</p>}
    </form>
  );
}

export default Contact;
