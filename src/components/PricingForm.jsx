import React, { useContext} from 'react';
import { useRouter } from 'next/navigation';
import PurchaseButton from './PurchaseButton';
import { UserContext } from '@/context/UserContext';

const PricingForm = () => {
    const router = useRouter();
    const { user } = useContext(UserContext) || {};

  return (
    <div className="flex flex-col md:flex-row justify-center items-start gap-8 p-8 main-content">
      {/* Free Version */}
      <div className="flex flex-col max-w-md w-full p-8 bg-gray-800 bg-opacity-60 border border-white rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">Free Version</h2>
        <ul className="text-left mb-6 space-y-3 text-white">
          <li className="flex items-center">
            <span className="text-green-400 mr-2">✓</span> One free dream interpretation
          </li>
          <li className="flex items-center">
            <span className="text-green-400 mr-2">✓</span> Access to our dream library
          </li>
          <li className="flex items-center">
            <span className="text-green-400 mr-2">✓</span> Dream interpretation eBook
          </li>
        </ul>
        <button className="secondary-button" onClick={() => router.push('/')}>
          Get Started
        </button>
      </div>

      {/* Member Version */}
      <div className="flex flex-col max-w-md w-full p-8 bg-gray-800 bg-opacity-60 border border-white rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">Member</h2>
        <p className="text-4xl font-extrabold text-white mb-2">
          $10<span className="text-xl">/month</span>
        </p>
        <p className="text-sm text-white mb-4">Billed monthly</p>
        <ul className="text-left mb-6 space-y-3 text-white">
          <li className="flex items-center">
            <span className="text-green-400 mr-2">✓</span> Unlimited dream interpretations
          </li>
          <li className="flex items-center">
            <span className="text-green-400 mr-2">✓</span> Access to all dream oracles
          </li>
          <li className="flex items-center">
            <span className="text-green-400 mr-2">✓</span> Access to community
          </li>
          <li className="flex items-center">
            <span className="text-green-400 mr-2">✓</span> Unlimited dream image generations
          </li>
          <li className="flex items-center">
            <span className="text-green-400 mr-2">✓</span> Dream journal to log dreams
          </li>
        </ul>
        {user ? (
            <PurchaseButton buttonText={"Upgrade Now"} user={user} />
        ) : (
            <button className="start-button" onClick={() => router.push('/register')}>Start Now</button>
        )}
      </div>
    </div>
  );
};

export default PricingForm;
