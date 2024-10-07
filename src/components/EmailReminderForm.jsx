"use client";
import axios from 'axios';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import validator from 'validator';
import { createPortal } from 'react-dom'; // Import createPortal

export default function EmailReminderForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [settingReminder, setSettingReminder] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");

  // Define the Modal component using React Portals
  const Modal = ({ children }) => {
    return createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {children}
      </div>,
      document.body
    );
  };

  const sendEmailReminder = async () => {
    try {
      await axios.post('/api/user/sendReminderEmail', {
        email: 'mkoch@michaelgkoch.com'
      });
    } catch (error) {
      console.log("Error");
    }
  };

  const setEmailReminder = async (e) => {
    e.preventDefault();
    setSettingReminder(true);
    setError("");

    if (!email) {
      setError("Please enter an email address");
      setSettingReminder(false);
      return;
    } else if (!validator.isEmail(email)) {
      setError("Please enter a valid email");
      setSettingReminder(false);
      return;
    }

    try {
      const emailLower = email.toLowerCase();

      // Set the email reminder here
      const res = await axios.post('api/user/setEmailReminder', {
        email: emailLower
      });

      if (res.status !== 200) {
        console.log("There was an error!");
        setError("There was an issue setting the reminder, please check your email and try again.");
      } else {
        // Check if there is already an account with the email address they provided
        const resUser = await fetch(`api/user/${emailLower}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (resUser.ok) {
          setModalText("It looks like you already have an account with this email address. We've signed you in, so you'll be able to use your account to interpret your dream tomorrow.");

          // Sign them in
          await signIn("credentials", {
            email: emailLower,
            password: "password",
            redirect: false
          });
        } else {
          // If they do not have an account, create an account for them with that email
          await fetch('api/register', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: "Carl Jung",
              email: emailLower,
              password: "password"
            }),
          });

          // Send a verification email
          await axios.post('api/sendVerificationEmail', { email: emailLower });
          setModalText("To view your dream interpretation, you'll need to create an account. We've sent you a verification email—you can verify your account now or wait until tomorrow when you receive your interpretation.");
        }
      }

      setSettingReminder(false);
      setIsModalVisible(true);
    } catch (error) {
      console.log("There was an error setting email reminder: ", error);
      setError("An error occurred. Please try again later.");
      setSettingReminder(false);
    }
  };

  return (
    <div className="text-center bg-gray-800 bg-opacity-30 shadow-lg rounded-3xl p-4 mt-5">
      <h2 className="text-2xl font-semibold mb-3">
        Don&apos;t Remember Your Dream?
      </h2>
      <p className="text-base mb-5">
        Sign up now, and we&apos;ll remind you tomorrow morning to enter your dream.
      </p>
      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <label
            htmlFor="email"
            className="block text-left font-medium mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your Email Address"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-black w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        <button
          className="w-full py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
          onClick={setEmailReminder}
          disabled={settingReminder}
        >
          {settingReminder ? "Setting Reminder..." : "Set Reminder"}
        </button>
      </div>

      {isModalVisible && (
        <Modal>
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-black">
            <h3 className="text-xl font-bold mb-4">Reminder Set!</h3>
            <p className="mb-4">Your reminder has been scheduled 😁</p>
            <p className="mb-6">
              {modalText}
            </p>
            <button
              className="w-full py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
              onClick={() => setIsModalVisible(false)}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
