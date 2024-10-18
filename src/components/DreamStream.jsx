"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const DreamItem = ({ dream }) => {
  const [showFullText, setShowFullText] = useState(false);
  const router = useRouter();

  const handleReadMore = () => {
    setShowFullText(true);
  };

  return (
    <div className="bg-[rgba(128,128,128,0.1)] rounded-xl overflow-hidden shadow-2xl mb-4 w-full md:w-1/2 mx-auto p-2">
      <Image
        src={dream.imageURL}
        alt={"No Image Available"}
        className="w-full h-auto object-cover rounded-lg"
        layout="responsive"
        width={1}
        height={1}
      />
      <p className="mt-2 golden-ratio-2">{new Date(dream.dreamDate).toLocaleDateString()}</p>
      <div className="p-4 pt-0">
        <p className="text-white">
          {showFullText ? dream.dream : dream.dream.substring(0, 200)}
          {!showFullText && dream.dream.length > 200 && (
            <>
              ...{' '}
              <button
                onClick={handleReadMore}
                className="text-blue-500 bg-transparent border-none p-0 cursor-pointer"
              >
                read more
              </button>
            </>
          )}
        </p>
        <div className="text-center">
          <button
            onClick={() => router.push("/dreamDetails?dreamID=" + dream._id)}
            className="start-button"
          >
            View Dream
          </button>
        </div>
      </div>
    </div>
  );
};

const DreamStream = () => {
  const [dreamStream, setDreamStream] = useState([]);

  useEffect(() => {
    const fetchPublicDreams = async () => {
      try {
        const res = await axios.get('/api/dream/dreamStream', {
          headers: {
            'Cache-Control': 'no-store', // Prevent caching
          },
        });
        setDreamStream(res.data.dreams);
      } catch (error) {
        console.error('Error fetching dreams:', error);
      }
    };

    // Fetch dreams initially
    fetchPublicDreams();

    // Set up a polling interval to fetch the latest dreams every 10 seconds
    const interval = setInterval(() => {
      fetchPublicDreams();
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="md:w-2/3 md:mx-auto md:px-0 md:py-8 px-3 py-8 bg-transparent">
      <h2 className="text-center mb-6 gradient-title-text golden-ratio-4">Dream Stream</h2>
      {/* Dream Stream section */}
      <div className="mt-8">
        {dreamStream.map((dream) => (
          <DreamItem key={dream._id} dream={dream} />
        ))}
      </div>
    </div>
  );
};

export default DreamStream;
