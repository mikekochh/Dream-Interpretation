import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import LoadingComponent from './LoadingComponent';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';


const AdminPortalForm = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state for sidebar visibility
  const { user, userLoading } = useContext(UserContext) || {};
  const router = useRouter();
  const [profileCheckDone, setProfileCheckDone] = useState(false);
  const [hasUnreadFeedback, setHasUnreadFeedback] = useState(false);

  useEffect(() => {
    const checkUnreadFeedback = async () => {
      try {
        const response = await axios.get('/api/admin/unreadFeedback');
        setHasUnreadFeedback(response.data.hasUnreadFeedback);
      } catch (error) {
        console.error('Error checking for unread feedback:', error);
      }
    };

    checkUnreadFeedback();
  }, []);

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
      case 'interpretations':
        return <InterpretationManagement />;
      case 'views':
        return <ViewsManagement />;
      case 'feedback':
        return <FeedbackManagement />;
      case 'library':
        return <LibraryManagement />;
      case 'articles':
        return <ArticleManagement />;
      case 'settings':
        return <Settings />;
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
          hasUnreadFeedback={hasUnreadFeedback}
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

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, hasUnreadFeedback }) => {
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
        {['users', 'dreams', 'interpretations', 'views', 'feedback', 'library', 'articles', 'settings'].map((tab) => (
          <li
            key={tab}
            className={`py-3 px-4 rounded cursor-pointer flex items-center justify-between ${
              activeTab === tab ? 'bg-teal-400 text-gray-800' : 'hover:bg-gray-700'
            }`}
            onClick={() => {
              setActiveTab(tab);
              setIsOpen(false); // Close sidebar on mobile after selecting
            }}
          >
            <span>{tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}</span>
            {tab === 'feedback' && hasUnreadFeedback && (
              <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
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

    const [usersWithMultipleDreamsCount, setUsersWithMultipleDreamsCount] = useState(0);

    useEffect(() => {
      const fetchSignUpTypeData = async () => {
        const response = await axios.get('/api/admin/getSignUpTypeData');
        console.log("response: ", response);
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
    
        const users = response.data.data;
    
        // Calculate the count of users with dreamsCount >= 2
        const multipleDreamsUsersCount = users.filter(user => user.dreamCount >= 2).length;
    
        // Update state variables
        setUsers(users);
        setSubscribers(responseSubscribers.data.data);
        setUsersWithMultipleDreamsCount(multipleDreamsUsersCount);
    
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
      console.log("sortedUsers: ", sortedUsers);
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
            <div className="text-white mb-6">
              <p className="font-semibold text-3xl text-center mb-6">Stats</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* # of users with multiple dreams */}
                <div className="bg-blue-900 shadow-lg rounded-lg p-6 text-center">
                  <p className="text-xl font-bold"># of Users with Multiple Dreams</p>
                  <p className="text-2xl mt-2">{usersWithMultipleDreamsCount}</p>
                </div>

                {/* # of dreams excluding the current user */}
                <div className="bg-blue-900 shadow-lg rounded-lg p-6 text-center">
                  <p className="text-xl font-bold">% of Users with Multiple Dreams</p>
                  <p className="text-2xl mt-2">
                    {users.length > 0
                      ? Math.floor((usersWithMultipleDreamsCount / users.length) * 100) + "%"
                      : "0%"}
                  </p>
                </div>

                {/* # of dreams with no user */}
                <div className="bg-blue-900 shadow-lg rounded-lg p-6 text-center">
                  <p className="text-xl font-bold">Dreams with No User</p>
                </div>
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

  const ArticleManagement = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newArticle, setNewArticle] = useState({
      articleTitle: '',
      articleURL: '',
      articlePicture: '',
      prompt: '',
      replyTweet: ''
    });

    useEffect(() => {
      fetchArticlesData();
    }, []);

    const fetchArticlesData = async () => {
      setLoading(true);
      const response = await axios.get('/api/dream/articles');
      setArticles(response.data);
      setLoading(false);
    }

    const openAddArticle = () => {
      setNewArticle({
        articleTitle: '',
        articleURL: '',
        articlePicture: '',
        prompt: '',
        replyTweet: ''
      });
      setIsAddModalOpen(true);
    }

    const openEditModal = (article) => {
      setSelectedArticle(article);
      setIsEditModalOpen(true);
    }

    const handleEditSave = async () => {
      await axios.post('/api/admin/article/editArticle', {
        articleTitle: selectedArticle.articleTitle,
        articleURL: selectedArticle.articleURL,
        articlePicture: selectedArticle.articlePicture,
        prompt: selectedArticle.prompt,
        replyTweet: selectedArticle.replyTweet,
        articleID: selectedArticle.articleID
      });
      setIsEditModalOpen(false);
      setSelectedArticle(null);
    }

    const handleAddArticle = async () => {
      await axios.post('/api/admin/article/addArticle', {
        articleTitle: newArticle.articleTitle,
        articleURL: newArticle.articleURL,
        articlePicture: newArticle.articlePicture,
        prompt: newArticle.prompt,
        replyTweet: newArticle.replyTweet,
        articleID: articles.length + 1
      });
      setIsAddModalOpen(false);
      fetchArticlesData();
    }

    return (
      <div>
        <h1 className="text-3xl font-bold mb-6 text-white">Dream Articles</h1>
        <div className="flex gap-4 mb-4">
          <div onClick={openAddArticle} className="bg-blue-500 text-white p-6 rounded-lg cursor-pointer flex items-center justify-center w-1/2 h-24">
            <span className="text-xl font-semibold">Add Article</span>
          </div>
          <div className="bg-gray-200 p-6 rounded-lg flex items-center justify-center w-1/2 h-24">
            <span className="text-xl font-semibold">Total Articles: {articles.length}</span>
          </div>
        </div>
        {loading ? (
          <LoadingComponent loadingText={"Loading Dream Articles"} />
        ) : (
          <ul className="space-y-2">
            {articles.map((article) => (
              <li key={article._id} className="flex justify-between items-center p-2 bg-gray-800 text-white rounded">
                <span>{article.articleTitle}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(article)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {isEditModalOpen && selectedArticle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div
              className="bg-white p-6 rounded shadow-lg w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto relative"
            >
              <button
                className="absolute top-2 right-2 text-gray-500"
                onClick={() => setIsEditModalOpen(false)}
              >
                X
              </button>
              <h2 className="text-2xl font-bold mb-4">Edit Article</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Article Title</label>
                  <input
                    type="text"
                    value={selectedArticle.articleTitle}
                    onChange={(e) =>
                      setSelectedArticle({ ...selectedArticle, articleTitle: e.target.value })
                    }
                    className="w-full border p-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Article URL</label>
                  <input
                    type="text"
                    value={selectedArticle.articleURL}
                    onChange={(e) =>
                      setSelectedArticle({ ...selectedArticle, articleURL: e.target.value })
                    }
                    className="w-full border p-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Article Picture URL</label>
                  <input
                    type="text"
                    value={selectedArticle.articlePicture}
                    onChange={(e) =>
                      setSelectedArticle({ ...selectedArticle, articlePicture: e.target.value })
                    }
                    className="w-full border p-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Prompt</label>
                  <textarea
                    value={selectedArticle.prompt}
                    rows={4}
                    onChange={(e) =>
                      setSelectedArticle({ ...selectedArticle, prompt: e.target.value })
                    }
                    className="w-full border p-2"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Reply Tweet</label>
                  <textarea
                    value={selectedArticle.replyTweet}
                    rows={4}
                    onChange={(e) =>
                      setSelectedArticle({ ...selectedArticle, replyTweet: e.target.value })
                    }
                    className="w-full border p-2"
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleEditSave}
                  className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div
              className="bg-white p-6 rounded shadow-lg w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto relative"
            >
              <button
                className="absolute top-2 right-2 text-gray-500"
                onClick={() => setIsAddModalOpen(false)}
              >
                X
              </button>
              <h2 className="text-2xl font-bold mb-4">Add Article</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Article Title</label>
                  <input
                    type="text"
                    placeholder="Enter article title"
                    value={newArticle.articleTitle || ''}
                    onChange={(e) =>
                      setNewArticle({ ...newArticle, articleTitle: e.target.value })
                    }
                    className="w-full border p-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Article URL</label>
                  <input
                    type="text"
                    placeholder="Enter article URL"
                    value={newArticle.articleURL || ''}
                    onChange={(e) =>
                      setNewArticle({ ...newArticle, articleURL: e.target.value })
                    }
                    className="w-full border p-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Article Picture URL</label>
                  <input
                    type="text"
                    placeholder="Enter article picture URL"
                    value={newArticle.articlePicture || ''}
                    onChange={(e) =>
                      setNewArticle({ ...newArticle, articlePicture: e.target.value })
                    }
                    className="w-full border p-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Prompt</label>
                  <textarea
                    placeholder="Enter prompt"
                    rows={4}
                    value={newArticle.prompt || ''}
                    onChange={(e) =>
                      setNewArticle({ ...newArticle, prompt: e.target.value })
                    }
                    className="w-full border p-2"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Reply Tweet</label>
                  <textarea
                    placeholder="Enter reply tweet"
                    rows={4}
                    value={newArticle.replyTweet || ''}
                    onChange={(e) =>
                      setNewArticle({ ...newArticle, replyTweet: e.target.value })
                    }
                    className="w-full border p-2"
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleAddArticle}
                  className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
                >
                  Add
                </button>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )


  }

  const LibraryManagement = () => {
    const [library, setLibrary] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newSymbol, setNewSymbol] = useState({ symbol: '', meaning: '' });
  
    useEffect(() => {
      fetchLibraryData();
    }, []);

    const fetchLibraryData = async () => {
      setLoading(true);
      const response = await axios.get('/api/dream/symbols');
      setLibrary(response.data);
      setLoading(false);
    };
  
    const openEditModal = (symbol) => {
      setSelectedSymbol(symbol);
      setIsEditModalOpen(true);
    };
  
    const openDeleteModal = (symbol) => {
      setSelectedSymbol(symbol);
      setIsDeleteModalOpen(true);
    };
  
    const openAddModal = () => {
      setNewSymbol({ symbol: '', meaning: '' });
      setIsAddModalOpen(true);
    };
  
    const handleEditSave = async () => {
      await axios.post('/api/admin/library/editSymbol', { symbolID: selectedSymbol._id, meaning: selectedSymbol.meaning });
      setIsEditModalOpen(false);
      fetchLibraryData();
    };
  
    const handleDeleteConfirm = async () => {
      await axios.delete(`/api/admin/library/deleteSymbol`, { 
        data: { 
          symbolID: selectedSymbol._id
        }
      });
      setIsDeleteModalOpen(false);
      fetchLibraryData();
    };
  
    const handleAddSymbol = async () => {
      await axios.post('/api/admin/library/addSymbol', { symbol: newSymbol.symbol, meaning: newSymbol.meaning });
      setIsAddModalOpen(false);
      fetchLibraryData();
    };
  
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6 text-white">Dream Symbols Library</h1>
        <div className="flex gap-4 mb-4">
          {/* Add Symbol Card */}
          <div
            onClick={openAddModal}
            className="bg-blue-500 text-white p-6 rounded-lg cursor-pointer flex items-center justify-center w-1/2 h-24"
          >
            <span className="text-xl font-semibold">Add Symbol</span>
          </div>

          {/* Total Dream Symbols Card */}
          <div className="bg-gray-200 p-6 rounded-lg flex items-center justify-center w-1/2 h-24">
            <span className="text-xl font-semibold">Total Symbols: {library.length}</span>
          </div>
        </div>

  
        {loading ? (
          <LoadingComponent loadingText={"Loading Library Data"} />
        ) : (
          <ul className="space-y-2">
            {library.map((symbol) => (
              <li key={symbol._id} className="flex justify-between items-center p-2 bg-gray-800 text-white rounded">
                <span>{symbol.symbol}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(symbol)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(symbol)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
  
        {/* Edit Modal */}
        {isEditModalOpen && selectedSymbol && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
              <button className="absolute top-2 right-2 text-gray-500" onClick={() => setIsEditModalOpen(false)}>
                X
              </button>
              <h2 className="text-2xl font-bold mb-4">Edit Symbol</h2>
              <p className="text-gray-700 mb-4">{selectedSymbol.symbol}</p>
              <textarea
                value={selectedSymbol.meaning}
                rows={6}
                onChange={(e) => setSelectedSymbol({ ...selectedSymbol, meaning: e.target.value })}
                className="w-full border p-2 mb-4"
              ></textarea>
              <button onClick={handleEditSave} className="bg-blue-500 text-white py-2 px-4 rounded mr-2">
                Save
              </button>
              <button onClick={() => setIsEditModalOpen(false)} className="bg-gray-500 text-white py-2 px-4 rounded">
                Cancel
              </button>
            </div>
          </div>
        )}
  
        {/* Delete Modal */}
        {isDeleteModalOpen && selectedSymbol && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
              <button className="absolute top-2 right-2 text-gray-500" onClick={() => setIsDeleteModalOpen(false)}>
                X
              </button>
              <h2 className="text-2xl font-bold mb-4">Delete Symbol</h2>
              <p className="mb-2 text-lg font-semibold">Are you sure you want to delete the symbol {selectedSymbol.symbol}?</p>
              <p className="mb-2">Meaning: {selectedSymbol.meaning}</p>
              <button onClick={handleDeleteConfirm} className="bg-red-500 text-white py-2 px-4 rounded mr-2">
                Delete
              </button>
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-500 text-white py-2 px-4 rounded">
                Cancel
              </button>
            </div>
          </div>
        )}
  
        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
              <button className="absolute top-2 right-2 text-gray-500" onClick={() => setIsAddModalOpen(false)}>
                X
              </button>
              <h2 className="text-2xl font-bold mb-4">Add Symbol</h2>
              <input
                type="text"
                placeholder="Symbol"
                value={newSymbol.symbol}
                onChange={(e) => setNewSymbol({ ...newSymbol, symbol: e.target.value })}
                className="w-full border p-2 mb-4"
              />
              <textarea
                placeholder="Meaning"
                rows={6}
                value={newSymbol.meaning}
                onChange={(e) => setNewSymbol({ ...newSymbol, meaning: e.target.value })}
                className="w-full border p-2 mb-4"
              ></textarea>
              <button onClick={handleAddSymbol} className="bg-blue-500 text-white py-2 px-4 rounded mr-2">
                Add
              </button>
              <button onClick={() => setIsAddModalOpen(false)} className="bg-gray-500 text-white py-2 px-4 rounded">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const FeedbackManagement = () => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    useEffect(() => {
      const fetchFeedbackData = async () => {
        setLoading(true);
        const response = await axios.get('/api/admin/getFeedbackData');
        setFeedback(response.data.data);
        setLoading(false);
      };
  
      fetchFeedbackData();
    }, []);

    const openModal = async (feedback) => {
      setSelectedFeedback(feedback);
    
      // Mark feedback as read in the backend
      const response = await axios.post('/api/admin/readFeedback', {
        feedbackID: feedback._id
      });
    
      // Update the feedback state locally
      if (response.data.message === 'Feedback marked as read') {
        setFeedback((prevFeedback) =>
          prevFeedback.map((fb) =>
            fb._id === feedback._id ? { ...fb, hasBeenRead: true } : fb
          )
        );
      }
    
      setIsModalOpen(true);
    };    
  
    const closeModal = () => {
      setIsModalOpen(false);
      setSelectedFeedback(null);
    };
  
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6 text-white">Feedback</h1>
        {loading ? (
          <LoadingComponent loadingText={"Loading Feedback"} />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {feedback.map((fb, index) => (
              <div
                key={index}
                className="p-4 bg-gray-800 text-white rounded shadow cursor-pointer flex justify-between items-center"
                onClick={() => openModal(fb)}
              >
                <div>
                  <p className="font-semibold">{fb.userEmail}</p>
                  <p>{new Date(fb.feedbackDate).toLocaleDateString()}</p>
                </div>
                {!fb.hasBeenRead && (
                  <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </div>
            ))}
          </div>
        )}
  
        {isModalOpen && selectedFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
              <button className="absolute top-2 right-2 text-gray-500" onClick={closeModal}>X</button>
              <h2 className="text-2xl font-bold mb-4">{selectedFeedback.userEmail}</h2>
              <p className="text-gray-700 mb-4">{selectedFeedback.feedback}</p>
              <p className="text-sm text-gray-500">
                {new Date(selectedFeedback.feedbackDate).toLocaleDateString()}
              </p>
              <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ViewsManagement = () => {
    const [views, setViews] = useState([]);
    const [userViews, setUserViews] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [pages, setPages] = useState([]);
    const [timeframe, setTimeframe] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedCard, setSelectedCard] = useState(1);

    useEffect(() => {
      const fetchPageData = async () => {
        const response = await axios.get('/api/admin/getPageData');
        setPages(response.data.data);
      }

      fetchPageData();
    }, [])

    useEffect(() => {
      if (selectedCard === 1 && views.length) {
        setDisplayData(views);
      }
      else {
        setDisplayData(userViews);
      }
    }, [selectedCard, views, userViews])

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

    const getPageNameByID = (pageID) => {
      const page = pages.find(p => p.pageID === pageID);
      return page ? page.pageName : 'Page not found';
    };

    const sortByViewDate = () => {
      const sortedViewsData = [...displayData].sort((a, b) => new Date(b.view_date) - new Date(a.view_date));
      setDisplayData(sortedViewsData);
    }

    const sortByViewDateAscending = () => {
      const sortedViewsData = [...displayData].sort((a, b) => new Date(a.view_date) - new Date(b.view_date));
      setViews(sortedViewsData);
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
              <div className="bg-gray-100 p-6 rounded-lg shadow text-center cursor-pointer" onClick={() => setSelectedCard(1)}>
                <h3 className="text-xl font-semibold mb-2">Total Views</h3>
                <p className="text-2xl font-bold">{views.length}</p>
              </div>
              
              <div className="bg-gray-100 p-6 rounded-lg shadow text-center cursor-pointer" onClick={() => setSelectedCard(2)}>
                <h3 className="text-xl font-semibold mb-2">User Views</h3>
                <p className="text-2xl font-bold">{userViews.length}</p>
              </div>
            </div>


            <div className="overflow-x-auto ">
              <h1 className="text-center text-3xl font-semibold mb-2 text-white">
                {selectedCard === 1 ? 'Total Views' : 'User Views'}
              </h1>
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
                    <th className="px-4 py-2">Session Length</th>
                    <th className="px-4 py-2">Location</th>
                    <th className="px-4 py-2">Instagram?</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {displayData.map((view) => (
                    <tr className="border-b" key={view._id}>
                      <td className="px-4 py-2">{view.user?.name || "No Account"}</td>
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
                      <td className="px-4 py-2">{view.sessionLength}</td>
                      <td className="px-4 py-2">{view.location}</td>
                      <td className="px-4 py-2">{view.isFromInstagram == null ? 'N/A' : view.isFromInstagram ? 'Yes' : 'No'}</td>
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

  const InterpretationManagement = () => {
    const [interpretations, setInterpretations] = useState([]);
    const [oracles, setOracles] = useState([]);
    const [users, setUsers] = useState([]);
    const [timeframe, setTimeframe] = useState(1);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
      fetchInterpretations();
      fetchOracles();
      fetchUsers();
    }, [timeframe]);

    const fetchOracles = async () => {
      const response = await axios.get('/api/allOracles');
      setOracles(response.data);
    }

    const fetchUsers = async () => {
      const response = await axios.get('/api/admin/getUserData/5');
      setUsers(response.data.data);
    }

    const fetchInterpretations = async () => {
      setLoading(true);
      const response = await axios.get('/api/admin/getInterpretationData/' + timeframe);

      console.log("response: ", response.data.data);

      setInterpretations(response.data.data);
      setLoading(false);
    }

    const sortByInterpretationDate = () => {
      const sortedInterpretations = [...interpretations].sort((a, b) => new Date(b.interpretationDate) - new Date(a.interpretationDate));
      setInterpretations(sortedInterpretations);
    }

    const convertOracleIDToOracleName = (oracleID) => {
      const oracle = oracles.find(oracle => String(oracle.oracleID) === String(oracleID));
      return oracle ? oracle.oracleName : 'Oracle not found';
    }; 
    
    const convertUserIDToUserName = (userID) => {
      const user = users.find(user => String(user._id) === String(userID));
      return user ? user.name : "No User";
    }


    // we need to get the dream its connected to, who they selected for interpretation, the date, and like or disliked it, and who got the interpretation
    const handleTimeFrameChange = (value) => {
      setTimeframe(Number(value));
    };

    return (
      <div>
        <h1 className="text-3xl font-bold mb-6 text-white">Interpretations Management</h1>
        <div className="mb-4 text-center">
          <label htmlFor="timeFrame" className="mr-2 font-semibold text-xl text-white">
            Interpretation Data For
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
          <LoadingComponent loadingText={"Loading Interpretation Data"} />
        ) : (
          <div>
            <div className="mb-6">
              <div className="bg-white shadow rounded-lg p-4 text-center cursor-pointer">
                <h3 className="text-xl font-bold mb-2">Interpretations</h3>
                <p className="text-2xl">{interpretations.length}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <h1 className="text-center text-3xl font-semibold mb-2 text-white">Interpretations</h1>
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="px-4 py-2">Dreamer</th>
                    <th className="px-4 py-2">
                      Interpretation Date
                      <i
                        onClick={sortByInterpretationDate} 
                        className={`fas fa-sort-up ml-2 cursor-pointer`}
                      ></i>
                    </th>
                    <th className="px-4 py-2">
                      Oracle
                      <i
                        className={`fas fa-sort-up ml-2 cursor-pointer`}
                      ></i>
                    </th>
                    <th className="px-4 py-2">Feedback</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {interpretations.map((interpretation) => (
                    <tr className="border-b" key={interpretation._id}>
                      <td className="px-4 py-2">
                        {convertUserIDToUserName(interpretation.dream?.userID)}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(interpretation.interpretationDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-2">{convertOracleIDToOracleName(interpretation.oracleID)}</td>
                      <td className="px-4 py-2">
                        {interpretation.liked === true ? 'Liked' : interpretation.liked === false ? 'Disliked' : 'N/A'}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded mr-1"
                          onClick={() => router.push('/dream-details?dreamID=' + interpretation.dreamID)}
                        >
                          View
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
    const [originalDreams, setOriginalDreams] = useState([]);

    const [totalDreamsLength, setTotalDreamsLength] = useState(0);
    const [userDreamsLength, setUserDreamsLength] = useState(0);
    const [nonuserDreamsLength, setNonuserDreamsLength] = useState(0);
    const [totalDreamsLengthIncludeMe, setTotalDreamsLengthIncludeMe] = useState(0);
    const [userDreamsLengthIncludeMe, setUserDreamsLengthIncludeMe] = useState(0)
    const [nonuserDreamsLengthIncludeMe, setNonuserDreamsLengthIncludeMe] = useState(0);


    const [displayDreams, setDisplayDreams] = useState([]);
    const [timeframe, setTimeframe] = useState(5);
    const [loading, setLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDream, setSelectedDream] = useState(null);
    const [selectedCard, setSelectedCard] = useState(1);
    const [includeMe, setIncludeMe] = useState(true);
  
    const router = useRouter();
  
    useEffect(() => {
      fetchDreams();
    }, [timeframe]);

    useEffect(() => {
      let filteredDreams;

      console.log('running...');
      setLoading(true);
      if (selectedCard === 1) {
        if (includeMe) {
          // Include all dreams
          filteredDreams = originalDreams;
        } else {
          // Exclude dreams with your userID
          filteredDreams = originalDreams.filter(dream => dream.userID !== '65639dbb9811fa19c4dca43d');
        }
      } else if (selectedCard === 2) {
        if (includeMe) {
          // Include all dreams with a userID
          filteredDreams = originalDreams.filter(dream => dream.userID);
        } else {
          // Exclude dreams with your userID among those with a userID
          filteredDreams = originalDreams.filter(dream => dream.userID && dream.userID !== '65639dbb9811fa19c4dca43d');
        }
      } else {
        // Get all dreams without a userID
        filteredDreams = originalDreams.filter(dream => !dream.userID);
      }
    
      setDisplayDreams(filteredDreams);
      setLoading(false);
    }, [selectedCard, includeMe, originalDreams]);    
    
  
    const fetchDreams = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/getDreamData/' + timeframe);
    
        const fetchedDreams = response.data.data;
    
        // Filter dreams with and without userID
        const userDreams = fetchedDreams.filter(dream => dream.userID);
        const nonuserDreams = fetchedDreams.filter(dream => !dream.userID);
    
        // Exclude dreams with your userID
        const dreamsExcludeMe = fetchedDreams.filter(dream => dream.userID !== '65639dbb9811fa19c4dca43d');
        const userDreamsExcludeMe = userDreams.filter(dream => dream.userID !== '65639dbb9811fa19c4dca43d');
        const nonuserDreamsExcludeMe = nonuserDreams.filter(dream => dream.userID !== '65639dbb9811fa19c4dca43d');
    
        // IncludeMe counts (default)
        const userDreamsIncludeMe = userDreams.length;
        const nonuserDreamsIncludeMe = nonuserDreams.length;
    
        // Update state variables
        setTotalDreamsLength(dreamsExcludeMe.length); // Exclude your dreams
        setUserDreamsLength(userDreamsExcludeMe.length);
        setNonuserDreamsLength(nonuserDreamsExcludeMe.length);
        setTotalDreamsLengthIncludeMe(fetchedDreams.length); // All dreams including yours
        setUserDreamsLengthIncludeMe(userDreamsIncludeMe);
        setNonuserDreamsLengthIncludeMe(nonuserDreamsIncludeMe);
    
        // Save original fetched dreams
        setOriginalDreams(fetchedDreams);
      } catch (error) {
        console.error("Error fetching dreams:", error);
      } finally {
        setLoading(false);
      }
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
      setOriginalDreams(originalDreams.filter(dream => dream._id !== selectedDream._id));
      closeDeleteModal();
    };

    const sortByDreamDate = () => {
      const sortedDreams = [...originalDreams].sort((a, b) => new Date(b.dreamDate) - new Date(a.dreamDate));
      setOriginalDreams(sortedDreams);
    }
    
    const sortByPublic = () => {
      const sortedDreams = [...originalDreams].sort((a, b) => {
        if (a.isPublic === b.isPublic) {
          return 0; // If both dreams have the same value for isPublic, leave them in the same order
        }
        return a.isPublic ? -1 : 1; // If a.isPublic is true, it comes first; otherwise, b.isPublic comes first
      });
      setOriginalDreams(sortedDreams);
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white shadow rounded-lg p-4 text-center cursor-pointer" onClick={() => setSelectedCard(1)}>
                <h3 className="text-xl font-bold mb-2">Total Dreams</h3>
                <p className="text-2xl">{includeMe ? totalDreamsLengthIncludeMe : totalDreamsLength}</p>
              </div>
              <div className="bg-white shadow rounded-lg p-4 text-center cursor-pointer" onClick={() => setSelectedCard(2)}>
                <h3 className="text-xl font-bold mb-2">User Dreams</h3>
                <p className="text-2xl">{includeMe ? userDreamsLengthIncludeMe : userDreamsLength}</p>
              </div>
              <div className="bg-white shadow rounded-lg p-4 text-center cursor-pointer" onClick={() => setSelectedCard(3)}>
                <h3 className="text-xl font-bold mb-2">Non-User Dreams</h3>
                <p className="text-2xl">{includeMe ? nonuserDreamsLengthIncludeMe : nonuserDreamsLength}</p>
              </div>
            </div>

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="includeMe"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                onChange={(e) => setIncludeMe(e.target.checked)}
              />
              <label htmlFor="includeMe" className="ml-2 text-sm font-semibold text-white">
                Include Me
              </label>
            </div>
  
            <div className="overflow-x-auto">
              <h1 className="text-center text-3xl font-semibold mb-2 text-white">{selectedCard === 1 ? 'Total Dreams' : selectedCard === 2 ? 'User Dreams' : 'Non-User Dreams'}</h1>
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
                  {displayDreams.map((dream) => (
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
                          onClick={() => router.push('/dream-details?dreamID=' + dream._id)}
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-white">Site Settings</h1>
      <p className="text-white">Site settings content goes here.</p>
    </div>
  );
};

export default AdminPortalForm;
