"use client"; // Ensures this is a Client Component

import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { dreamSymbolsState } from '@/recoil/atoms';
import axios from 'axios';

export default function DreamSymbolsProvider({ children }) {
  const setDreamSymbols = useSetRecoilState(dreamSymbolsState);

  useEffect(() => {
    async function fetchDreamSymbols() {
      try {
        const response = await axios.get('/api/dream/symbols'); // Replace with your API endpoint
        console.log("response.data: ", response.data);
        console.log("response: ", response);
        setDreamSymbols(response.data);
      } catch (error) {
        console.error('Error fetching dream symbols:', error);
      }
    }

    fetchDreamSymbols();
  }, [setDreamSymbols]);

  return <>{children}</>;
}
