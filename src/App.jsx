import { useState, useContext, useRef, useEffect } from 'react';
import { StoreGlobal } from './Store';
import Popup from './components/Popup';
import { CircleUserRound, Loader, Send } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import Login from './components/Login';
import Register from './components/Register';
import { ToastContainer } from 'react-toastify';
import { fetchHistory, promt } from './service/Api';
import { useOutsideClick } from './hooks/useOutsideClick';

function App() {
  const [promptMsg, setpromptMsg] = useState("");
  const { popup, setPopup, popupMsg, setPopupMsg } = useContext(StoreGlobal);
  const [chats, setChats] =  useState([]);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showlogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const menuRef = useOutsideClick(()=>setShowMenu(false))
  const token = localStorage.getItem("token");

  // Auto-resize logic
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";

      const maxHeight = window.innerWidth < 768 ? 200 : 300;
      const scrollHeight = textarea.scrollHeight;

      if (scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = "auto";
      } else {
        textarea.style.height = `${scrollHeight}px`;
        textarea.style.overflowY = "hidden";
      }
    }
  }, [promptMsg]);

  useEffect(() => {
    token && fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      let response;
      if(token) {
        response = (await fetchHistory())?.data;
      } else {
        setChats([]);
        return;
      }
      setChats(response)
    } catch (error) {
      setChats([]);
      console.error("Error fetching chats:", error);
    }
  };

  const onChangeHandler = (e) => {
    setpromptMsg(e.target.value);
  };

  async function onSearch() {
    if (!String(promptMsg).trim()) {
      setPopupMsg({
        heading: "Prompt Empty",
        message: "Please enter something you want to know."
      });
      setPopup(true);
      return;
    }
    try {
      setResponse('');
      setIsLoading(true);
      let res;
      if(token) {
        res = await promt(promptMsg, token);
      } else {
        setPopupMsg({
          heading: 'Welcome Back',
          message: 'Please login to continue using the chatbot.'
        });
        setIsLoading(false);
        setPopup(true);
        return;
      }
      if (res.status < 300 && res.data?.statusCodeValue < 300) {
        setChats(pre => [
          ...pre,
          {
            role : "User",
            message : promptMsg
          },
          {
            role: 'AI',
            message: res.data?.body
          }
        ]
        );
        setResponse(res.data?.body);
        setpromptMsg("");
      } 
      else {
        setPopupMsg({
          heading: res.data?.statusCode,
          message: res.data?.body
        });
        setPopup(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.error({error})
      setPopupMsg({
        heading: error?.code ? error.code : 'Server error',
        message: error.response ? error.response?.data : 'Please refresh browser.'
      });
      setIsLoading(false);
      setPopup(true);
    }
  }

  function handleMenu(callback) {
    callback(true);
    setShowMenu(false);
  }

  return (
    <div className="min-h-screen flex ">
      {/* Overlays */}
      {
        showlogin && <Login setShowLogin={setShowLogin} setShowRegister={setShowRegister} fetchChats={fetchChats} />
      }
      {
        showRegister && <Register setShowRegister={setShowRegister} setShowLogin={setShowLogin} />
      }
      {
        popup && <Popup popupMsg={popupMsg} setPopupMsg={setPopupMsg} />
      }

      {/* Header */}
      <header className="fixed top-0 w-full h-16 md:h-20 z-50 bg-gray-600/90 backdrop-blur-sm p-3 md:p-5 flex items-center justify-between shadow-md">
        <h1 className="text-white font-semibold md:text-4xl text-xl">Welcome to JO</h1>
        <CircleUserRound className="md:h-10 md:w-10 h-8 w-8 text-white cursor-pointer hover:opacity-80" onClick={() => setShowMenu(true)} />
      </header>

      { showMenu &&
        <div ref={menuRef} className='fixed bg-gray-400 text-black/60 right-1 top-17 md:top-21 p-2 rounded-2xl'>
          <p className='hover:text-black hover:cursor-pointer' onClick={()=> handleMenu(setShowLogin)} >Login</p>
          <p className='hover:text-black hover:cursor-pointer' onClick={()=> handleMenu(setShowRegister)}>New Register</p>
          <p className='hover:text-black hover:cursor-pointer' onClick={()=>{
            localStorage.removeItem('token');
            setShowMenu(false);
            fetchChats();
          }} >Logout</p>
        </div>
      }

      <div className='flex  mt-15 md:mt-20 w-full flex-row'>
        {/* <div className='h-full w-52  md:w-72 bg-white'>

        </div> */}
        
        {/* Main Chat Content Area    ${response ? 'bg-white/70 shadow-xl' : ''} */}
        <main className="flex-1 flex flex-col items-center bg-gray-800 pt-5 pb-25 px-4">
          <div className={`w-full p-4 md:p-8 rounded-2xl transition-all 
            
            `}>
            {isLoading && (
              <div className="flex justify-center p-10">
                <Loader className="w-16 h-16 animate-spin text-white" />
              </div>
            )}

            <div ref={messagesEndRef} className="flex flex-col gap-8">
              {
                chats?.length > 0 &&
                chats.map((chat, index) => {
                  const isUser = chat.role === "User";
                  return (
                    <div key={index} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                      {/* Role Label */}
                      <h3 className={`md:text-2xl text-sm text-white mb-2 ${!isUser && "hidden"}`}>
                        You
                      </h3>
                      {/* Chat Bubble */}
                      <div className={`shadow-xl rounded-2xl p-2 max-w-[90%] ${isUser ? "bg-white text-black" : "bg-white/70 text-black"}`}>
                        {
                          isUser ? <div>{chat.message}</div> : <ChatMessage content={chat.message} />
                        }
                      </div>
                    </div>
                  );
                })
              }

            </div>
            

            {(chats?.length <= 1 && !isLoading)&& <div className="text-gray-400 text-2xl text-center mt-20 font-light">How can I help you today?</div>}

            <div className="fixed bottom-0 left-0 w-full z-40 p-4 pb-10 flex justify-center items-end pointer-events-none">
              <div className="relative w-full md:w-2/3 lg:w-1/2 flex items-end pointer-events-auto">
                <textarea
                  ref={textareaRef}
                  placeholder="Type your prompt..."
                  className="w-full p-4 pr-14 bg-white border-2 border-gray-300 rounded-3xl shadow-2xl resize-none focus:outline-none focus:border-blue-500 text-gray-800"
                  onChange={onChangeHandler}
                  value={promptMsg}
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      onSearch();
                    }
                  }}
                />
                {
                  String(promptMsg).trim() && (
                    <button
                      className="absolute right-3 bottom-3 p-2 text-black rounded-full transition-colors"
                      onClick={onSearch}
                    >
                      <Send size={20} />
                    </button>
                  )
                }
              </div>
            </div>
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;