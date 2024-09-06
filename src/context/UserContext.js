"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    setLoading(false);

    const setUserData = async () => {
        const userID = session?.user?.id;
        if (userID) {
            try {
                const res = await fetch(`api/user/getUserData/${userID}`, { method: "GET", headers: { "Content-Type":"application/json" } });
                const userData = await res.json();
                setUser(userData);
            } catch (error) {
                console.log("There was an error fetching user data: ", error);
            }
        }
        console.log("The user id for the session: ", userID);
    }
    
    if (session) {
        setUserData();
    }
  }, [session]);

  const login = async (email, password) => {
    // try {
    //   const { error, user } = await supabase.auth.signIn({ email, password });
    //   if (error) throw error;
    //   setUser(user);
    // } catch (error) {
    //   console.error('Error logging in:', error.message);
    // }
  };

  const logout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/interpret' });
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const getUser = () => {
    return user;
  };

  return (
    <UserContext.Provider value={{ user, login, logout, getUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
