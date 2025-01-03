import { atom } from 'recoil';

export const dreamSymbolsState = atom({
    key: 'dreamSymbolsState', // Unique key for this atom
    default: [],              // Default state (empty array)
    effects_UNSTABLE: [
        ({ setSelf, onSet }) => {
            if (typeof window !== 'undefined') { // Ensure we're in the browser
                const savedSymbols = sessionStorage.getItem('dreamSymbols');
                if (savedSymbols) {
                    setSelf(JSON.parse(savedSymbols)); // Set atom state to stored value
                }

                // Save the new state to sessionStorage whenever it changes
                onSet((newValue) => {
                    sessionStorage.setItem('dreamSymbols', JSON.stringify(newValue));
                });
            }
        },
    ],
});
