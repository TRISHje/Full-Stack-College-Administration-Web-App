import React from 'react'
import './Contact.css'
import msgicon from '../../assets/msg-icon.png'
import mailicon from '../../assets/mail-icon.png'
import phicon from '../../assets/phone-icon.png'
import locicon from '../../assets/location-icon.png'

const Contact = () => {
    const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "43a2deaa-59d9-4b43-9915-1e690250443d");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };


  return (
    <div className='contact'>
      <div className="contact-col">
        <h3>Send us message <img src={msgicon} alt="" /></h3>
        <p>Feel free to reach out to us through the contact form or find the contact information below.</p>
        <ul>
            <li><img src={mailicon} alt="" /> Contact@CAMS.com</li>
            <li><img src={phicon} alt="" /> +91 123 456 7890</li>
            <li><img src={locicon} alt="" /> CAMS Tower, New Delhi</li>
        </ul>
      </div>
<div className="contact-col">
    <form onSubmit={onSubmit}>
        <label >Your name</label>
        <input type="text" name='name' placeholder='Enter your name' required/>
    <label >Phone Number</label>
    <input type="tel" name='phone' placeholder='Enter your number' required />
    <label >Write your message here</label>
    <textarea name="message" rows="6" placeholder='Enter your message'></textarea>
   <button type='submit' className='btn btn-primary'>Submit now</button>
    </form>
    <span>{result}</span>
</div>
    </div>
  )
}

export default Contact