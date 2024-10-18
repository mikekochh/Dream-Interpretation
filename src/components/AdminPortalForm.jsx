import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingComponent from './LoadingComponent';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';


const AdminPortalForm = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state for sidebar visibility
  const { user, userLoading } = useContext(UserContext) || {};
  const router = useRouter();
  const [profileCheckDone, setProfileCheckDone] = useState(false);

  useEffect(() => {
    if (userLoading) {
      return;
    }
    else if (!user || !user?.is_admin) {
      router.push("/");
    }
    else {
      setProfileCheckDone(true);
    }
  }, [user, userLoading]);

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'dreams':
        return <DreamManagement />;
      case 'views':
        return <ViewsManagement />;
      case 'settings':
        return <Settings />;
      case 'sales':
        return <SalesAndRevenue />
      default:
        return <UserManagement />;
    }
  };

  if (!profileCheckDone) {
    return <LoadingComponent loadingText={"Loading"} />
  }

  return (
    <div className="main-content">
      <div>
        <div className="md:hidden bg-gray-800 text-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-teal-400 mr-1">Admin Portal</h2>
          <button className="text-2xl" onClick={() => setIsSidebarOpen(true)}>
            ☰
          </button>
        </div>
      </div>
      <div className="flex h-screen font-sans">

        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  return (
    <nav
      className={`bg-gray-800 text-gray-200 p-6 md:block ${
        isOpen ? 'block' : 'hidden'
      } fixed md:static top-0 left-0 h-full z-50 w-48`}
    >
      {/* Close button for mobile */}
      <div className="md:hidden mb-4">
        <button onClick={() => setIsOpen(false)} className="text-white">
          ✕
        </button>
      </div>

      <h2 className="text-2xl font-bold text-center text-teal-400 mb-8">Admin Portal</h2>
      <ul>
        {['users', 'dreams', 'views', 'sales', 'settings'].map((tab) => (
          <li
            key={tab}
            className={`py-3 px-4 rounded cursor-pointer ${
              activeTab === tab ? 'bg-teal-400 text-gray-800' : 'hover:bg-gray-700'
            }`}
            onClick={() => {
              setActiveTab(tab);
              setIsOpen(false); // Close sidebar on mobile after selecting
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
          </li>
        ))}
      </ul>
    </nav>
  );
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [timeframe, setTimeframe] = useState(5);
    const [loading, setLoading] = useState(false);
    const [selectedCard, setSelectedCard] = useState(1);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(false);
    const [signUpTypes, setSignUpTypes] = useState([]);

    useEffect(() => {
      const fetchSignUpTypeData = async () => {
        const response = await axios.get('/api/admin/getSignUpTypeData');
        setSignUpTypes(response.data.data);
      }

      fetchSignUpTypeData();
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [timeframe]);

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/admin/getUserData/' + timeframe);
  
        const responseSubscribers = await axios.get('/api/admin/getSubscriberData/' + timeframe);
  
        setUsers(response.data.data);
        setSubscribers(responseSubscribers.data.data);
        setLoading(false);
      } catch (error) {
        console.log("There was an error fetching user admin data: ", error);
        setLoading(false);
      }
    };

    const handleTimeFrameChange = (value) => {
      setTimeframe(Number(value)); // Directly update the state with the numeric value
    };

    const sortByName = () => {
      const sortedUsers = [...users].sort((a, b) => b.name.localeCompare(a.name));
      setUsers(sortedUsers);
    };
    
    const sortByEmail = () => {
      const sortedUsers = [...users].sort((a, b) => b.email.localeCompare(a.email));
      setUsers(sortedUsers);
    };
    
    const sortByCreateDate = () => {
      const sortedUsers = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setUsers(sortedUsers);
    };
    
    const sortByDreamsJournaled = () => {
      const sortedUsers = [...users].sort((a, b) => b.dreamCount - a.dreamCount);
      setUsers(sortedUsers);
    };    

    const sortByViews = () => {
      const sortedUsers = [...users].sort((a, b) => b.viewsCount - a.viewsCount);
      setUsers(sortedUsers);
    };

    const handleDeleteClick = (user) => {
      setIsDeleteModalOpen(true);
      setSelectedUser(user);
    }

    const confirmDelete = async () => {
      await axios.delete(`/api/admin/deleteUser`, { 
        data: { 
          userID: selectedUser._id,
          is_admin: selectedUser.is_admin,
          is_subscriber: selectedUser.subscribed
        }
      });
      setUsers(users.filter(user => user._id !== selectedUser._id));
      setIsDeleteModalOpen(false);
    }

    const getSignUpTypeNameByID = (signUpTypeID) => {
      const signUpType = signUpTypes.find(s => s.signUpTypeID === signUpTypeID);
      return signUpType ? signUpType.signUpTypeName : 'N/A';
    }
  
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl text-white font-bold">User Management</h1>
          </div>
        </div>

        <div className="mb-4 text-center">
          <label htmlFor="timeFrame" className="mr-2 font-semibold text-white text-xl">User Data For </label>
          <select
            id="timeFrame"
            className="border border-gray-300 rounded px-3 py-2"
            value={timeframe}
            onChange={(e) => handleTimeFrameChange(e.target.value)} // Replace with your actual handler
          >
            <option value={0}>Today</option>
            <option value={1}>Last 7 Days</option>
            <option value={2}>Last 30 Days</option>
            <option value={3}>Last 90 Days</option>
            <option value={4}>Last Year</option>
            <option value={5}>All Time</option>
          </select>
        </div>

        {/* New Section for Cards */}
        {loading ? (
          <LoadingComponent loadingText={"Loading User Data"} altScreen={true} />
        ) : (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div 
                className="bg-white shadow rounded-lg p-4 text-center cursor-pointer"
                onClick={() => setSelectedCard(1)}  
              >
                <h3 className="text-xl font-bold mb-2">Users</h3>
                <p className="text-2xl">{users?.length}</p>
              </div>
              <div 
                className="bg-white shadow rounded-lg p-4 text-center cursor-pointer"
                onClick={() => setSelectedCard(2)}  
              >
                <h3 className="text-xl font-bold mb-2">Subscribers</h3>
                <p className="text-2xl">{subscribers?.length}</p>
              </div>
            </div>
            <div className="overflow-x-auto text-white">
              <h1 className="text-center text-3xl font-semibold mb-2">
                {selectedCard === 1 ? 'Users' : 'Subscribers'}
              </h1>
              <table className="w-full table-auto">
                <thead>
                <tr className="text-left bg-gray-200 bg-opacity-50">
                  <th className="px-4 py-2 cursor-pointer">
                    Name
                    <i 
                      onClick={sortByName} 
                      className={`fas fa-sort-up ml-2`}
                    ></i>
                  </th>
                  <th className="px-4 py-2 cursor-pointer">
                    Email
                    <i 
                      onClick={sortByEmail} 
                      className={`fas fa-sort-up ml-2`}
                    ></i>
                  </th>
                  <th className="px-4 py-2 cursor-pointer">
                    Sign Up Type
                    <i 
                      onClick={sortByName} 
                      className={`fas fa-sort-up ml-2`}
                    ></i>
                  </th>
                  <th className="px-4 py-2 cursor-pointer">
                    {selectedCard === 1 ? 'Create Date' : 'Subscribed Date'}
                    <i 
                      onClick={sortByCreateDate} 
                      className={`fas fa-sort-up ml-2`}
                    ></i>
                  </th>
                  <th className="px-4 py-2 cursor-pointer">
                    Dreams
                    <i 
                      onClick={sortByDreamsJournaled} 
                      className={`fas fa-sort-up ml-2`}
                    ></i>
                  </th>
                  <th className="px-4 py-2 cursor-pointer">
                    Views
                    <i 
                      onClick={sortByViews} 
                      className={`fas fa-sort-up ml-2`}
                    ></i>
                  </th>
                  <th className="px-4 py-2 cursor-pointer">
                    Action
                  </th>
                </tr>
                </thead>
                <tbody>
                  {selectedCard === 1 ? (
                    <>
                      {users?.map((user) => (
                        <tr className="border-b" key={user._id}>
                          <td className="px-4 py-2">{user.name}</td>
                          <td className="px-4 py-2">{user.email}</td>
                          <td className="px-4 py-2">{getSignUpTypeNameByID(user.signUpTypeID)}</td>
                          <td className="px-4 py-2">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            })}
                          </td>
                          <td className="px-4 py-2">{user.dreamCount}</td>
                          <td className="px-4 py-2">{user.viewsCount}</td>
                          <td className="px-4 py-2">
                            <button 
                              className="bg-red-500 px-2 rounded"
                              onClick={() => handleDeleteClick(user)}
                            >Delete</button>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <>
                      {subscribers?.map((user) => (
                        <tr className="border-b" key={user._id}>
                          <td className="px-4 py-2">{user.name}</td>
                          <td className="px-4 py-2">{user.email}</td>
                          <td className="px-4 py-2">
                            {new Date(user.subscribeDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            })}
                          </td>
                          <td className="px-4 py-2">{user.dreamCount}</td>
                          <td className="px-4 py-2">{user.viewsCount}</td>
                          <td className="px-4 py-2">
                            <button 
                              className="bg-red-500 px-2 rounded"
                              onClick={() => handleDeleteClick(user)}
                            >Delete</button>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {isDeleteModalOpen && (
          <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Are you sure you want to delete this user?</h2>
              <p className="mb-4 text-gray-700">There is no reverting this action.</p>
              {selectedUser && (
                <>
                  <p className="mb-2"><strong>Name: </strong>{selectedUser.name}</p>
                  <p className="mb-4"><strong>Email: </strong>{selectedUser.email}</p>
                </>
              )}
              <div className="flex justify-center space-x-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={confirmDelete}>Confirm Delete</button>
                <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
      )}
      </div>
    );
  };

  const SalesAndRevenue = () => {
    const [timeframe, setTimeframe] = useState(5);
    const [loading, setLoading] = useState(false);
    const [totalRevenue, setTotalRevenue] = useState(0);

    const [purchases, setPurchases] = useState([]);

    const handleTimeFrameChange = (value) => {
      setTimeframe(Number(value)); // Directly update the state with the numeric value
    };

    useEffect(() => {
      const fetchSalesData = async () => {
        setLoading(true);
        const response = await axios.get('/api/sales/getBidSales', {
          params: {
            timeframeID: timeframe
          },
        });

        console.log("response: ", response);

        const responseTotalRevenue = await axios.get('/api/sales/getTotalRevenue', {
          params: {
            timeframeID: timeframe
          },
        });

        console.log("responseTotalRevenue: ", responseTotalRevenue);

        setPurchases(response.data.data);
        setTotalRevenue(responseTotalRevenue.data.totalRevenue);
        setLoading(false);
      }

      fetchSalesData();
    }, [timeframe]);

    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Sales & Revenue</h1>
        <div className="mb-4 text-center">
          <label htmlFor="timeFrame" className="mr-2 font-semibold text-xl">Sales Data For </label>
          <select 
            id="timeFrame" 
            className="border border-gray-300 rounded px-3 py-2" 
            value={timeframe}
            onChange={(e) => handleTimeFrameChange(e.target.value)}
          >
            <option value={0}>Today</option>
            <option value={1}>Last 7 Days</option>
            <option value={2}>Last 30 Days</option>
            <option value={3}>Last 90 Days</option>
            <option value={4}>Last Year</option>
            <option value={5}>All Time</option>
          </select>
        </div>
        {loading ? (
          <LoadingComponent loadingText={"Loading Sales Data"} />
        ) : (
          <div>
            <div className="bg-gray-100 p-6 rounded-lg shadow text-center">
              <h3 className="text-xl font-semibold mb-2">Total Revenue</h3>
              <p className="text-2xl font-bold">${totalRevenue}</p>
            </div>
            <div className="overflow-x-auto">
                <h1 className="text-center text-3xl font-semibold mb-2 mt-2">
                  Bid Sales
                </h1>
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="px-4 py-2">Purchaser</th>
                      <th className="px-4 py-2">Bids Purchases</th>
                      <th className="px-4 py-2">Amount Spent</th>
                      <th className="px-4 py-2">Purchase Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {purchases.map((purchase) => (
                      <tr className="border-b" key={purchase.id}>
                        <td className="px-4 py-2">
                          <Link
                            href={`/profile/${purchase.user_id?.id}`}
                            className="text-blue-500 hover:underline"
                          >
                            {purchase.user_id?.first_name + ' ' + purchase.user_id?.last_name}
                          </Link>
                        </td>
                        <td className="px-4 py-2">
                          {purchase.amount_quantity}
                        </td>
                        <td className="px-4 py-2">
                          ${purchase.amount_dollars}
                        </td>
                        <td className="px-4 py-2">
                          {new Date(purchase.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
        )}
      </div>
    )
  }

  const ViewsManagement = () => {
    const [views, setViews] = useState([]);
    const [userViews, setUserViews] = useState([]);
    const [pages, setPages] = useState([]);
    const [timeframe, setTimeframe] = useState(5);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const fetchPageData = async () => {
        const response = await axios.get('/api/admin/getPageData');
        setPages(response.data.data);
      }

      fetchPageData();
    }, [])

    useEffect(() => {
      fetchViews();
    }, [timeframe]);

    const fetchViews = async () => {
      setLoading(true);
      const response = await axios.get('/api/admin/getViewsData/' + timeframe);

      const responseUserViews = await axios.get('/api/admin/getUserViewsData/' + timeframe);

      setViews(response.data.data);
      setUserViews(responseUserViews.data.data);
      setLoading(false);
    }

    const handleTimeFrameChange = (value) => {
      setTimeframe(Number(value)); // Directly update the state with the numeric value
    };

    const handleDeleteView = async () => {
      const response = await axios.delete('/api/admin/deleteAllViews');
    }

    const getPageNameByID = (pageID) => {
      const page = pages.find(p => p.pageID === pageID);
      return page ? page.pageName : 'Page not found';
    };

    const sortByViewDate = () => {
      const sortedViews = [...views].sort((a, b) => new Date(b.view_date) - new Date(a.view_date));
      setViews(sortedViews);
    }

    const sortByViewDateAscending = () => {
      const sortedViews = [...views].sort((a, b) => new Date(a.view_date) - new Date(b.view_date));
      setViews(sortedViews);
    }
    


    return (
      <div>
        <h1 className="text-3xl font-bold mb-6 text-white">Views Management</h1>
        <div className="mb-4 text-center">
          <label htmlFor="timeFrame" className="mr-2 font-semibold text-xl text-white">Views Data For </label>
          <select
            id="timeFrame"
            className="border border-gray-300 rounded px-3 py-2"
            value={timeframe}
            onChange={(e) => handleTimeFrameChange(e.target.value)} // Replace with your actual handler
          >
            <option value={0}>Today</option>
            <option value={1}>Last 7 Days</option>
            <option value={2}>Last 30 Days</option>
            <option value={3}>Last 90 Days</option>
            <option value={4}>Last Year</option>
            <option value={5}>All Time</option>
          </select>
        </div>
        {loading ? (
          <LoadingComponent loadingText={"Loading Views Data"} />
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-100 p-6 rounded-lg shadow text-center">
                <h3 className="text-xl font-semibold mb-2">Total Views</h3>
                <p className="text-2xl font-bold">{views.length}</p>
              </div>
              
              <div className="bg-gray-100 p-6 rounded-lg shadow text-center">
                <h3 className="text-xl font-semibold mb-2">User Views</h3>
                <p className="text-2xl font-bold">{userViews.length}</p>
              </div>
            </div>


            <div className="overflow-x-auto ">
              <h1 className="text-center text-3xl font-semibold mb-2 text-white">Views</h1>
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="px-4 py-2">Viewer</th>
                    <th className="px-4 py-2">Page</th>
                    <th className="px-4 py-2 cursor-pointer">
                      <div className="flex items-center">
                        View Date & Time
                        <div className="flex flex-col ml-2">
                          <i 
                            onClick={sortByViewDate} 
                            className={`fas fa-sort-up cursor-pointer`} 
                          />
                          <i 
                            onClick={sortByViewDateAscending} 
                            className={`fas fa-sort-down cursor-pointer`}
                          ></i>
                        </div>
                      </div>
                    </th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {views.map((view) => (
                    <tr className="border-b" key={view._id}>
                      <td className="px-4 py-2">
                        {view.user?.name || "No Account"}
                      </td>
                      <td className="px-4 py-2">{getPageNameByID(view.pageID)}</td>
                      <td className="px-4 py-2">
                          {new Date(view.view_date).toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true // This will display the time in 12-hour format. You can set it to false for 24-hour format.
                          })}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded"
                          onClick={() => handleDeleteView()}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )
  }
  
  const DreamManagement = () => {
    const [dreams, setDreams] = useState([]);
    const [timeframe, setTimeframe] = useState(5);
    const [loading, setLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDream, setSelectedDream] = useState(null);
  
    const router = useRouter();
  
    useEffect(() => {
      fetchDreams();
    }, [timeframe]);
  
    const fetchDreams = async () => {
      setLoading(true);
      const response = await axios.get('/api/admin/getDreamData/' + timeframe);
      setDreams(response.data.data);
      setLoading(false);
    };
  
    const handleTimeFrameChange = (value) => {
      setTimeframe(Number(value));
    };
  
    const openDeleteModal = (dream) => {
      setSelectedDream(dream);
      setIsDeleteModalOpen(true);
    };
  
    const closeDeleteModal = () => {
      setIsDeleteModalOpen(false);
      setSelectedDream(null);
    };
  
    const handleDeleteDream = async () => {
      await axios.delete(`/api/admin/deleteDream`, { data: { dreamID: selectedDream._id } });
      setDreams(dreams.filter(dream => dream._id !== selectedDream._id));
      closeDeleteModal();
    };

    const sortByDreamDate = () => {
      const sortedDreams = [...dreams].sort((a, b) => new Date(b.dreamDate) - new Date(a.dreamDate));
      setDreams(sortedDreams);
    }
    
    const sortByPublic = () => {
      const sortedDreams = [...dreams].sort((a, b) => {
        if (a.isPublic === b.isPublic) {
          return 0; // If both dreams have the same value for isPublic, leave them in the same order
        }
        return a.isPublic ? -1 : 1; // If a.isPublic is true, it comes first; otherwise, b.isPublic comes first
      });
      setDreams(sortedDreams);
    }
    
  
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6 text-white">Dreams Management</h1>
        <div className="mb-4 text-center">
          <label htmlFor="timeFrame" className="mr-2 font-semibold text-xl text-white">
            Dream Data For
          </label>
          <select
            id="timeFrame"
            className="border border-gray-300 rounded px-3 py-2"
            value={timeframe}
            onChange={(e) => handleTimeFrameChange(e.target.value)}
          >
            <option value={0}>Today</option>
            <option value={1}>Last 7 Days</option>
            <option value={2}>Last 30 Days</option>
            <option value={3}>Last 90 Days</option>
            <option value={4}>Last Year</option>
            <option value={5}>All Time</option>
          </select>
        </div>
  
        {loading ? (
          <LoadingComponent loadingText={"Loading Dream Data"} />
        ) : (
          <div>
            <div className="mb-6">
              <div className="bg-white shadow rounded-lg p-4 text-center cursor-pointer">
                <h3 className="text-xl font-bold mb-2">Dreams</h3>
                <p className="text-2xl">{dreams.length}</p>
              </div>
            </div>
  
            <div className="overflow-x-auto">
              <h1 className="text-center text-3xl font-semibold mb-2 text-white">Dreams</h1>
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="px-4 py-2">Dreamer</th>
                    <th className="px-4 py-2">Interpretation</th>
                    <th className="px-4 py-2">
                      Dream Date
                      <i
                        onClick={sortByDreamDate} 
                        className={`fas fa-sort-up ml-2 cursor-pointer`}
                      ></i>
                    </th>
                    <th className="px-4 py-2">
                      Public Status
                      <i
                        onClick={sortByPublic} 
                        className={`fas fa-sort-up ml-2 cursor-pointer`}
                      ></i>
                    </th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {dreams.map((dream) => (
                    <tr className="border-b" key={dream._id}>
                      <td className="px-4 py-2">
                        {dream.userID !== 0 && dream.user?.name ? (
                          dream.user.name
                        ) : dream.userID !== 0 && !dream.user?.name ? (
                          <span style={{ color: "red" }}>DELETED</span>
                        ) : (
                          "No User"
                        )}
                      </td>
                      <td className="px-4 py-2">{dream.interpretation ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-2">
                        {new Date(dream.dreamDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-2">{dream.isPublic ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-2">
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded mr-1"
                          onClick={() => router.push('/dreamDetails?dreamID=' + dream._id)}
                        >
                          View
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded"
                          onClick={() => openDeleteModal(dream)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
  
            {/* Delete Confirmation Modal */}
            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                <div className="bg-white rounded-lg p-8 max-w-md mx-auto my-4 max-h-full overflow-y-auto">
                  <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this dream?</h2>
                  <p>&apos;{selectedDream.dream}&apos;</p>
                  <p>
                    Dream Date:{" "}
                    {new Date(selectedDream.dreamDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </p>
                  <p>
                    From this user:{" "}
                    {selectedDream.user?.name
                      ? selectedDream.user.name
                      : "No user holds this dream"}
                  </p>
                  <p className="mb-6">This action cannot be undone.</p>
                  <div className="flex justify-end">
                    <button
                      className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                      onClick={closeDeleteModal}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded"
                      onClick={handleDeleteDream}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    );
  };
  

const Settings = () => {
  // Placeholder for settings content
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Site Settings</h1>
      <p>Site settings content goes here.</p>
    </div>
  );
};

export default AdminPortalForm;
