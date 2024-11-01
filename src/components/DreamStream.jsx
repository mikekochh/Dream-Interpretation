"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const DreamItem = ({ dream }) => {
  const [showFullText, setShowFullText] = useState(false);
  const router = useRouter();

  const handleReadMore = () => {
    // setShowFullText(true);
  };

  return (
    <div className="bg-[rgba(128,128,128,0.1)] rounded-xl overflow-hidden shadow-2xl mb-4 w-full mx-auto p-2">
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
        const res = await fetch(`/api/dream/dreamStream?_=${new Date().getTime()}`, {
          next: { revalidate: 0 }, // Force no caching, always fetch new data
          headers: {
            'Cache-Control': 'no-store',
          },
        });
        
        const data = await res.json();
        setDreamStream(data.dreams);
      } catch (error) {
        console.error('Error fetching dreams:', error);
      }
    };
    

    // Fetch dreams initially
    fetchPublicDreams();
  }, []);

  return (
    <div className="md:w-2/3 md:mx-auto md:px-0 md:py-8 px-3 py-8 bg-transparent">
      <h3 className="text-center font-thin golden-ratio-2 text-gray-200">The best part about dreams is sharing them.</h3>
      <h2 className="text-center gradient-title-text golden-ratio-4">Dream Stream</h2>
      <h3 className="text-center mb-6 golden-ratio-2 text-gray-100">Share your dreams with the Dream Oracles community. Engage with fellow dreamers, sharing interpretations and thoughts on one another&apos;s dreams, while watching your dreams come to life as AI-generated images.</h3>
      {/* Dream Stream section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {dreamStream.map((dream) => (
          <DreamItem key={dream._id} dream={dream} />
        ))}
      </div>
    </div>
  );
};

export default DreamStream;


// explore dreams 