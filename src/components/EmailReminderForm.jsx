"use client";
import axios from 'axios';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import validator from 'validator';
import { createPortal } from 'react-dom'; // Import createPortal

export default function EmailReminderForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [settingReminder, setSettingReminder] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reminderModalTitle, setReminderModalTitle] = useState("");
  const [reminderModalText, setReminderModalText] = useState("");
  const [reminderSet, setReminderSet] = useState(false);

  // Define the Modal component using React Portals
  const Modal = ({ children }) => {
    return createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {children}
      </div>,
      document.body
    );
  };

  const handleCloseModal = async () => {
    // if reminder is already set, then refresh page when they close it.
    setIsModalVisible(false);
    if (reminderSet) {
      window.location.reload();
    }
  }

  const setEmailReminder = async (e) => {
    e.preventDefault();
    setSettingReminder(true);
    setError("");

    if (!email) {
      setError("Please enter an email address");
      setSettingReminder(false);
      return;
    } else if (!name) {
      setError("Please enter an name");
      setSettingReminder(false);
      return;
    } else if (!validator.isEmail(email)) {
      setError("Please enter a valid email");
      setSettingReminder(false);
      return;
    }

    try {
      const emailLower = email.toLowerCase();

        // check if they already have an account
      const resExistingUser = await fetch(`api/user/${emailLower}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (resExistingUser.ok) {
        const resActivated = await fetch(`api/user/activated/${emailLower}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await resActivated.json();

        if (resActivated.ok) {
            if (data.isActivated) {
                setReminderModalTitle("Reminder Set!");
                setReminderModalText("Your dream reminder has been set. See you tomorrow! 😁");
                const resSendReminder = await axios.post('api/user/sendDreamReminder', { userID: data.user._id });

                // Check if the response is successful
                if (resSendReminder.data.success) {
                  // sign them in
                  await signIn('credentials', {
                    email: emailLower,
                    password: 'password',
                    redirect: false,
                  });
                  setReminderSet(true);
                } else {
                  console.log('Failed to update sendReminder');
                  setError("There was an error setting your reminder. Please refresh and try again.");
                }

                setSettingReminder(false);
                setIsModalVisible(true);
                return;
            }
            else {
                // send them verification email
                const resSendEmail = await axios.post('api/sendReminderVerificationEmail', { email: emailLower, name: name });
                if (resSendEmail.status === 200) {
                  setReminderModalTitle("Check your email! 😁");
                  setReminderModalText("We've just sent a confirmation email to verify your email address. Once verified, your reminder will be set and your account will be fully set up, which will allow you to jump right into your interpretation tomorrow.");
                  setSettingReminder(false);
                  setIsModalVisible(true);
                  return;
                }
                else {
                  setError("There was an error setting the reminder. Please refresh and try again.");
                  setSettingReminder(false);
                  return;
                }
            }
        }
      } 
      else { // if the email address is not associated with an account yet
        // first, we register the new account
        const resNewUser = await fetch('api/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email: emailLower,
                password: "password"
            }),
        });

        if (resNewUser.ok) {
          // then we send them the reminder verification email
          const resSendEmail = await axios.post('api/sendReminderVerificationEmail', { email: emailLower, name: name });
          console.log("resSendEmail: ", resSendEmail);
          if (resSendEmail.status === 200) {
            setReminderModalTitle("Check your email! 😁");
            setReminderModalText("We've just sent a confirmation email to verify your email address. Once verified, your reminder will be set and your account will be fully set up, which will allow you to jump right into your interpretation tomorrow.");
            setSettingReminder(false);
            setIsModalVisible(true);
            return;
          }
          else {
            setError("There was an error setting the reminder. Please refresh and try again.");
            setSettingReminder(false);
            return;
          }
        }
      }
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
            htmlFor="name"
            className="block text-left font-medium mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Name"
            onChange={(e) => setName(e.target.value)}
            required
            className="text-black w-full px-4 py-2 mb-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
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
            <h3 className="text-xl font-bold mb-4">{reminderModalTitle}</h3>
            <p className="mb-4">{reminderModalText}</p>
            <button
              className="w-full py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
