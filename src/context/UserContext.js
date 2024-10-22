"use client";
import { createContext, useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') {
      // still loading session
      return;
    }
    if (session && !user) {
      // session loaded and there is a user
      setUserData();
    }
    else {
      // session loaded and there is no user
      setUserLoading(false);
    }
  }, [session, status]);

  const setUserData = async () => {
    const userEmail = session?.user?.email;
    if (userEmail) {
        try {
            const res = await fetch(`api/user/${userEmail}`, { method: "GET", headers: { "Content-Type":"application/json" } });
            const userData = await res.json();
            setUser(userData);
            setUserLoading(false);
        } catch (error) {
            console.log("There was an error fetching user data: ", error);
            setUserLoading(false);
        }
    }
  }

  const logout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/interpret' });
      setUser({});
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const getUser = () => {
    return user;
  };

  return (
    <UserContext.Provider value={{ 
      user,
      userLoading,
      session,
      status, 
      logout, 
      getUser,
      setUserData
    }}>
      {children}
    </UserContext.Provider>
  );
};
