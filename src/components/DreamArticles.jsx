"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const DreamArticles = () => {
  const [dreamArticles, setDreamArticles] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchDreamArticles = async () => {
      try {
        const response = await axios.get('/api/dream/articles');
        setDreamArticles(response.data);
      } catch (error) {
        console.error('Error fetching dream articles:', error);
      }
    };

    fetchDreamArticles();
  }, []);

  return (
    <div className="md:w-2/3 md:mx-auto md:px-0 md:py-8 px-3 py-8 bg-transparent">
      <h3 className="text-center font-thin golden-ratio-2 text-gray-200">Most Common Dreams</h3>
      <h2 className="text-center gradient-title-text golden-ratio-4">In-Depth Symbol Analysis</h2>
      <h3 className="text-center golden-ratio-2 text-gray-100">
        Read our in-depth interpretations of our most common dream symbols
      </h3>

      {/* Articles grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6">
        {dreamArticles.map((article, index) => (
          <Link key={index} href={`/dream-meaning/${article.articleURL}`}>
            <div className="bg-gray-800 rounded-md overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <img
                src={article.articlePicture}
                alt={article.articleTitle}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="text-xl font-semibold text-gray-100 mb-2">
                  {article.articleTitle}
                </h4>
                <p className="text-gray-400 text-sm">
                  Click to read more
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-center mt-3">
        <button onClick={() => router.push('/dream-meaning')} className="start-button">View More Articles</button>
      </div>
    </div>
  );
};

export default DreamArticles;
