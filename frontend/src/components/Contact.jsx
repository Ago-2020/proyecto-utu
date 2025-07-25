import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { useEffect } from 'react';

const Contact = () => {
  const form = useRef();

  useEffect(() => {
    fetch('http://localhost:3000/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Response from backend:', data);
      })
      .catch((error) => {
        console.error('Error fetching from backend:', error);
      });
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();

    console.log('Sending email...', import.meta.env.EMAILJS_SERVICE_KEY);

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_KEY,
        import.meta.env.VITE_EMAILJS_TEMPLATE_KEY,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      )
      .then(
        (result) => {
          console.log('Email sent successfully:', result.text);
          alert('Message sent!');
        },
        (error) => {
          console.error('Email send error:', error.text);
          alert('Failed to send message.');
        },
      );
  };

  return (
    <form className="" ref={form} onSubmit={sendEmail}>
      <label>Name</label>
      <input
        className="input input-primary"
        type="text"
        name="user_name"
        placeholder="Name"
        required
      />

      <label>Email</label>
      <input
        className="input input-primary"
        type="email"
        name="user_email"
        placeholder="Email"
        required
      />

      <label>Message</label>
      <textarea name="message" required placeholder="Message" />

      <button className="btn btn-neutral" type="submit">
        Send
      </button>
    </form>
  );
};

export default Contact;
