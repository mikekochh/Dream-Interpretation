"use client";
import axios from 'axios';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import validator from 'validator';
import { createPortal } from 'react-dom'; // Import createPortal
import { SIGN_UP_TYPE_DREAM_REMINDER } from '@/types/signUpTypes';
import Image from 'next/image';

export default function EmailReminderModal({ onClose, isReminderModalVisible }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [settingReminder, setSettingReminder] = useState(false);
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
                onClose();
                return;
            }
            else {
                // send them verification email
                const resSendEmail = await axios.post('api/sendReminderVerificationEmail', { email: emailLower, name: name });
                if (resSendEmail.status === 200) {
                  setReminderModalTitle("Check your email! 😁");
                  setReminderModalText("We've just sent a confirmation email to verify your email address. Once verified, your reminder will be set and your account will be fully set up, which will allow you to jump right into your interpretation tomorrow.");
                  setSettingReminder(false);
                  onClose();
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
                password: "password",
                signUpTypeID: SIGN_UP_TYPE_DREAM_REMINDER
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
            onClose(true);
            return;
          }
          else {
            setError("There was an error setting the reminder. Please refresh and try again.");
            setSettingReminder(false);
            return;
          }
        }
      }
      // set a view thing that they set a dream reminder with a certain address
    } catch (error) {
      console.log("There was an error setting email reminder: ", error);
      setError("An error occurred. Please try again later.");
      setSettingReminder(false);
    }
  };

  const signUpWithGoogle = async () => {
    localStorage.setItem("googleSignUp", true);
    localStorage.setItem("googleReminder", true);
    await signIn('google');
  }

  if (reminderSet) {
    return (
      <Modal>
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-1000 ease-in-out ${
            isReminderModalVisible ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-70"
            onClick={onClose}
          ></div>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative z-10 text-black">
            {/* X button in the top right corner */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-3 text-center">
              {reminderModalTitle}
            </h2>
            <h3 className="text-lg text-center">{reminderModalText}</h3>
            {/* Close button at the bottom */}
            <div className="text-center mt-6">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );    
  }

  return (
    <Modal>
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gray-800 bg-opacity-70" onClick={onClose}></div>

      {/* Modal content */}
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative z-10 text-black">
        <h2 className="text-2xl font-semibold mb-3 text-center">
          Don&apos;t Remember Your Dream?
        </h2>
        <p className="text-base mb-5 text-center">
        Sign up now, and you&apos;ll receive a reminder tomorrow morning, along with a free dream interpretation to help you understand your dream.
        </p>
        <div className="space-y-4 max-w-md mx-auto">
          <div>
            <label htmlFor="name" className="block text-left font-medium mb-1">
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
            <label htmlFor="email" className="block text-left font-medium mb-1">
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
        <div className="flex items-center justify-center my-2">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-4 text-black">Or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        <div className="flex justify-center">
            <button
                type="button"
                onClick={() => signUpWithGoogle()}
                className="flex items-center bg-white rounded-lg py-1 text-black font-bold text-center w-full"
            >
                <div className="flex items-center justify-center w-full border border-black rounded mx-2">
                    <Image src="/GoogleLogo.webp" className="rounded-lg mr-2" width={32} height={32} alt="logo" />
                    Sign up with Google
                </div>
            </button>
        </div>


        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
    </Modal>

  );
}
