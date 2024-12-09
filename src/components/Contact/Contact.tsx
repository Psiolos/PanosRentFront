import React, { useRef } from 'react';
import emailjs from 'emailjs-com';
import './Contact.css';


function Contact() {
  const form = useRef<HTMLFormElement>(null);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.current) {
      emailjs.sendForm(
        'service_lw53yrq', // Edw to Service ID
        'template_ljinoog', // Edw to template ID
        form.current,
        'xl0Imzr_VwqM8CGrL' //Edw to user id public
      )
      .then((result) => {
          console.log(result.text);
          alert("Email sent successfully!");
      }, (error) => {
          console.log(error.text);
          alert("There was an error sending the email. Please try again later.");
      });
      
      
      form.current.reset();
    }
  };

  return (
    <>
      <section className="contact-page">
        <div className="container">
          <div className="contact-div">
            <div className="contact-div__text">
              <br />
              <h2>Need additional information?</h2>
              <p>
                You can send us email, you can call us or come by our local.
                We are here to give you the best experience.
              </p>
              <a href="/">
                <i className="fa-solid fa-phone"></i>&nbsp; 26510 26510
              </a>
              <a href="/">
                <i className="fa-solid fa-envelope"></i>&nbsp;
                psiolos@outlook.com
              </a>
              <a href="/">
                <i className="fa-solid fa-location-dot"></i>&nbsp; Stauraki,
                Ioannina, Greece
              </a>
              <div className="google-map">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d767.9215489542742!2d20.81878112894207!3d39.6567762937285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMznCsDM5JzI0LjYiTiAyMMKwNDknMDkuNCJF!5e0!3m2!1sel!2sgr!4v1729941353797!5m2!1sel!2sgr" 
                  width="600" 
                  height="450" 
                  style={{ border: "0" }}
                  allowFullScreen
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
            <div className="contact-div__form">
              <form ref={form} onSubmit={sendEmail}>
                <label>
                  Full Name <b>*</b>
                </label>
                <input type="text" name="user_name" placeholder='E.g: "John Papadopoulos"' required />

                <label>
                  Email <b>*</b>
                </label>
                <input type="email" name="user_email" placeholder="email@example.com" required />

                <label>
                  Tell us about it <b>*</b>
                </label>
                <textarea name="message" placeholder="Write Here.." required />

                <button type="submit">
                  <i className="fa-solid fa-envelope-open-text"></i>&nbsp; Send
                  Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
