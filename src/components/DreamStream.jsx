"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';

const DreamItem = ({ dream }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [comment, setComment] = useState("");
  const [showModal, setShowModal] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleLeaveComment = async () => {
    const response = await axios.post('/api/dream/comment/leaveComment', {
      dreamID: dream._id,
      dreamComment: comment,
    });
    setComment('');
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <div className="bg-[rgba(128,128,128,0.1)] rounded-xl overflow-hidden shadow-2xl mb-4 w-full mx-auto p-2">
        <Image
          src={dream.imageURL}
          alt={"No Image Available"}
          className="w-full h-auto object-cover rounded-lg"
          layout="responsive"
          width={1}
          height={1}
        />
        <p className="mt-2 text-gray-300">{new Date(dream.dreamDate).toLocaleDateString()}</p>
        <div className="p-4 pt-0">
          <p className="text-white">
            {isExpanded || dream.dream.length <= 200
              ? dream.dream
              : `${dream.dream.substring(0, 200)}...`}
            {dream.dream.length > 200 && (
              <button
                onClick={toggleReadMore}
                className="text-gray-400 ml-2"
              >
                {isExpanded ? "" : "more"}
              </button>
            )}
          </p>
        </div>
        {dream.comments.length > 0 && (
          <button
            onClick={toggleModal}
            className="text-gray-400 text-sm mt-2 mb-1"
          >
            View all {dream.comments.length} comments
          </button>
        )}

        {/* Comment Text Area and Button */}
        <div className="flex items-center">
          <textarea
            placeholder="Add comment..."
            value={comment}
            onChange={handleCommentChange}
            className="w-full bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none resize-none"
            rows="2"
          ></textarea>
          {comment && (
            <button
              className="ml-2 px-2 py-1 text-sm text-blue-500 bg-transparent hover:bg-blue-500 hover:text-white rounded-lg transition-all duration-200"
              onClick={handleLeaveComment}
            >
              Comment
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 max-h-full overflow-y-auto rounded-lg p-6 relative">
            <button
              onClick={toggleModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <div className="flex flex-col md:flex-row">
              {/* Dream Image and Text */}
              <div className="md:w-2/3 p-4">
                <Image
                  src={dream.imageURL}
                  alt={"Dream Image"}
                  className="w-full h-auto object-cover rounded-lg"
                  layout="responsive"
                  width={1}
                  height={1}
                />
                <p className="mt-4 text-gray-800 text-lg">{dream.dream}</p>
              </div>

              {/* Comments Section */}
              <div className="md:w-1/3 md:border-l md:border-gray-300 p-4">
                <h3 className="text-gray-700 font-semibold mb-2">Comments</h3>
                {dream.comments.length > 0 ? (
                  dream.comments.map((comment, index) => (
                    <p key={index} className="text-gray-600 text-sm mb-2">
                      {comment.dreamCommentContent}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">No comments yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
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
        console.log("dreams: ", data.dreams);
        setDreamStream(data.dreams);
      } catch (error) {
        console.error('Error fetching dreams:', error);
      }
    };

    fetchPublicDreams();
  }, []);

  return (
    <div className="w-full h-screen overflow-y-auto px-3 py-8">
      <h2 className="text-center gradient-title-text golden-ratio-4 mb-4">Dream Stream</h2>
      <h3 className="text-center mb-6 text-gray-100 w-2/3 mx-auto">
        Welcome to the Dream Oracles community! Share your dreams and engage with fellow dreamers, offering supportive insights and interpretations. Let's keep our space positive, respectful, and inspiring as we explore dreams together.
      </h3>
      <div className="mt-8 flex flex-col gap-4 md:w-1/4 md:mx-auto">
        {dreamStream.map((dream) => (
          <DreamItem key={dream._id} dream={dream} />
        ))}
      </div>
    </div>
  );
};

export default DreamStream;
