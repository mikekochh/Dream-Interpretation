import axios from 'axios';
import Image from 'next/image';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { UserContext } from '@/context/UserContext';
import { useContext } from 'react';


const ViewInterpretation = ({ interpretation, oracle, isOpen, onClose, updateInterpretationFeedback, setCreateAccount }) => {
  const { user } = useContext(UserContext) || {};
  
  if (!isOpen) return null;

  function cleanHTML(interpretation) {
    const start = interpretation.indexOf('<');
    const end = interpretation.lastIndexOf('>') + 1; // Include the '>'

    if (start !== -1 && end !== -1) {
      let cleanedHtml = interpretation.substring(start, end);

      // Modify <h2> tags to include the desired styles
      cleanedHtml = cleanedHtml.replace(/<h2>/g, '<h2 style="font-size: 1.5em; font-weight: 600;">');

      return cleanedHtml;
    }

    return interpretation; // In case there is no valid HTML, return as is
  }

  const likeInterpretation = async (liked) => {
    await axios.post('/api/dream/interpretationFeedback', {
      liked,
      interpretationID: interpretation._id
    });
    updateInterpretationFeedback(interpretation._id, liked);
  }

  // Clean the interpretation HTML content
  const cleanInterpretation = cleanHTML(interpretation.interpretation);

  console.log("user: ", user);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="rounded-lg w-full max-w-lg p-4 relative max-h-[80vh] h-auto overflow-y-auto bg-gray-900 bg-opacity-90 shadow-2xl text-white hide-scrollbar">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white text-3xl"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-semibold mb-2 px-4 text-center">
          Dream Interpretation by {oracle.oracleName}
        </h2>

        {/* Oracle Image */}
        <div className="text-center justify-center flex mb-2">
          <Image
            src={oracle.oraclePicture}
            alt={oracle.oracleName}
            className="w-32 h-32 rounded-full border-gold-small"
            width={100}
            height={100}
            unoptimized={true}
          />
        </div>

        {/* Interpretation Text */}
        <div className="text-gray-200 text-center">
          <div dangerouslySetInnerHTML={{ __html: cleanInterpretation }} />
        </div>

        {/* Feedback Section */}
        <div className="text-gray-200 text-center border border-1 rounded-xl mt-5 p-3">
          <p>Was This Interpretation Helpful?</p>
          <div className="flex justify-center gap-4 mt-2">
            <button 
              className="bg-transparent focus:outline-none"
              onClick={() => likeInterpretation(true)}
            >
              <i 
                className={`fas fa-thumbs-up text-2xl ${
                  interpretation.liked === true ? 'text-gold' : 'text-gray-500 hover:text-green-500'
                }`}
              ></i>
            </button>
            <button 
              className="bg-transparent focus:outline-none"
              onClick={() => likeInterpretation(false)}  
            >
              <i 
                className={`fas fa-thumbs-down text-2xl ${
                  interpretation.liked === false ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              ></i>
            </button>
          </div>
        </div>
        {!user && (
          <div className="DreamBox mt-2 p-2 rounded-xl text-center">
            <p className="text-xl text-center font-thin">Create an account to start a dream journal and save your interpretations</p>
            <button className="start-button" onClick={() => setCreateAccount(true)}>Sign Up</button>
          </div>
        )}

        <div className="DreamBox mt-2 p-2 rounded-xl text-center">
          <p className="text-xl text-center font-thin">Want to dive deeper?</p>

        </div>

        {/* Modal Footer */}
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewInterpretation;
