"use client";
import { createContext, useState, useEffect, startTransition } from 'react';
import { signOut, useSession } from 'next-auth/react';
import axios from 'axios';
import { usePathname } from 'next/navigation';
import { 
  PAGE_INTERPRET_HOME,
  PAGE_DREAM_DETAILS,
  PAGE_LIBRARY,
  PAGE_DREAM_STREAM,
  PAGE_E_BOOK,
  PAGE_JOURNAL_MAIN
} from '@/types/pageTypes';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [viewStartTime, setViewStartTime] = useState(Date.now());
  const [currentPage, setCurrentPage] = useState();
  
  // if they change the page they are on, we just update what page they are on, and end the view
  // if they change what section they are on, we just update the page, and then end the view
  // if they leave the website, we log the view with the current page

  const getPageType = (pathname) => {
    if (pathname.startsWith('/')) {
      return PAGE_INTERPRET_HOME;
    } else if (pathname.startsWith('/dream-stream')) {
      return PAGE_DREAM_STREAM;
    } else if (pathname.startsWith('/library')) {
      return PAGE_LIBRARY;
    } else if (pathname.startsWith('/dream-details')) {
      return PAGE_DREAM_DETAILS;
    } else if (pathname.startsWith('/e-book')) {
      return PAGE_E_BOOK;
    } else if (pathname.startsWith('/dreams')) {
      return PAGE_JOURNAL_MAIN;
    } 
    else {
      return null;
    }
  }

  useEffect(() => {
      const handleVisibilityChange = () => {
          if (document.visibilityState === 'hidden') {
              handleEndView();
          } else if (document.visibilityState === 'visible') {
              // Restart the viewStartTime when the user returns to the page
              setViewStartTime(new Date());
          }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('beforeunload', handleEndView);

      return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          window.removeEventListener('beforeunload', handleEndView);
      };
  }, [viewStartTime]);


  useEffect(() => {
    if (viewStartTime !== Date.now()) {
      handleEndView();
      updatePageID();
      setViewStartTime(Date.now());
    }
  }, [pathname]);

  const handleChangeSection = (newPageID) => {
    handleEndView();
    setCurrentPage(newPageID);
    setViewStartTime(Date.now());
  }

  const handleEndView = async () => {
    const endTime = Date.now();
    const sessionLength = Math.floor((endTime - viewStartTime) / 1000);

    if (currentPage === null) {
      return;
    }

    try {
      if (window.location.hostname !== 'localhost') {
        const referrer = document.referrer;
        const isFromInstagram = referrer.includes('instagram.com');
  
        await axios.post('/api/views/addView', {
          pageID: currentPage,
          userID: user?._id,
          isFromInstagram,
          sessionLength
        });
      }
    } catch (error) {
      console.error("There was an error tracking the view: ", error);
    }
  }

  const updatePageID = () => {
    const pageID = getPageType(pathname);
    setCurrentPage(pageID);
  }

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
    setUserLoading(true);
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

  const toggleEmailNotifications = async () => {
      setUserLoading(true);
      try {
          const updatedNotificationStatus = user.optOutEmailNotifications == null ? true : !user.optOutEmailNotifications;

          console.log("updatedNotificationStatus: ", updatedNotificationStatus);

          setUser(prevUser => ({
              ...prevUser,
              optOutEmailNotifications: updatedNotificationStatus,
          }));

          // Call the API to update the email notification setting
          await axios.post('/api/user/updateEmailNotification', {
            emailNotification: updatedNotificationStatus,
            userID: user._id
          });

      } catch (error) {
          console.error("Failed to toggle email notification setting:", error);
      } finally {
          setUserLoading(false);
      }
  };

  const toggleEmailMarketing = async () => {
      setUserLoading(true);
      try {
          const updatedMarketingStatus = user.optOutEmailMarketing == null ? true : !user.optOutEmailMarketing;

          setUser(prevUser => ({
              ...prevUser,
              optOutEmailMarketing: updatedMarketingStatus,
          }));

          // Call the API to update the email marketing setting
          await axios.post('/api/user/updateEmailMarketing', {
            emailMarketing: updatedMarketingStatus,
            userID: user._id
          });

      } catch (error) {
          console.error("Failed to toggle email marketing setting:", error);
      } finally {
          setUserLoading(false);
      }
  };

  const logout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/' });
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
      setUserData,
      toggleEmailNotifications,
      toggleEmailMarketing,
      handleChangeSection
    }}>
      {children}
    </UserContext.Provider>
  );
};
