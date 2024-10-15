// src/components/PhoneSignIn.js
import { useEffect, useState } from 'react';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { handleToast } from '~/customHooks/useToast';

const PhoneSignIn = () => {
  const auth = getAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'normal',
          'expired-callback': () => {
            handleToast('error', 'OTP expired! Please try again.');
          },
        }
      );
    }
  }, [auth]);

  const handleSendOtp = (event) => {
    event.preventDefault();
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, `+84${phoneNumber}`, appVerifier)
      .then((confirmationResult) => {
        setConfirmationResult(confirmationResult);
        handleToast('success', 'OTP has been sent!');
      })
      .catch(() => {
        handleToast('error', 'Failed to send OTP! Please try again.');
      });
  };

  const handleVerifyOtp = (event) => {
    event.preventDefault();
    if (confirmationResult && otp) {
      confirmationResult
        .confirm(otp)
        .then((result) => {
          const user = result.user;
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('accessToken', user.accessToken);
          handleToast('success', 'Successfully logged in!');
        })
        .catch(() => {
          handleToast('error', 'Invalid OTP! Please try again.');
        });
    }
  };

  return (
    <div className="phone-signin-container">
      <h2>Phone Sign In</h2>
      <form onSubmit={handleSendOtp} className="phone-signin-form">
        <input
          type="tel"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="input-field"
        />
        <div id="recaptcha-container" className="recaptcha"></div>
        <button type="submit" className="btn">
          Send OTP
        </button>
      </form>

      <form onSubmit={handleVerifyOtp} className="otp-verify-form">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="btn">
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default PhoneSignIn;
