import { useState, useContext, useRef, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { StoreGlobal } from './Store';
import Popup from './components/Popup';
import { CircleUserRound, Loader, Send } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import Login from './components/Login';
import Register from './components/Register';

const API = import.meta.env.VITE_API_URL;

function App() {
  const [promtMesg, setpromtMesg] = useState("");
  const { popup, setPopup, popupMsg, setPopupMsg } = useContext(StoreGlobal);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showlogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize logic
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";

      const maxHeight = window.innerWidth < 768 ? 200 : 300;
      const scrollHeight = textarea.scrollHeight;

      if (scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.scroll
        textarea.style.overflowY = "auto";
      } else {
        textarea.style.height = `${scrollHeight}px`;
        textarea.style.overflowY = "hidden";
      }
    }
  }, [promtMesg]);

  const onChangeHandler = (e) => {
    setpromtMesg(e.target.value);
  };

  async function onSearch() {
    if (!String(promtMesg).trim()) {
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
      const res = await axios.post(`${API}/`, promtMesg);
      if (res.status < 300) {
        setResponse(res.data);
      }
      setIsLoading(false);
      setpromtMesg("");
    } catch (error) {
      setPopupMsg({
        heading: 'Server Error',
        message: 'Please refresh browser.'
      });
      setIsLoading(false);
      setPopup(true);
    }
  }

  return (
    <div className="min-h-screen flex ">
      {/* Overlays */}
      {
        showlogin && <Login setShowLogin={setShowLogin} setShowRegister={setShowRegister} />
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
        <CircleUserRound className="md:h-10 md:w-10 h-8 w-8 text-white cursor-pointer hover:opacity-80" onClick={() => setShowLogin(true)} />
      </header>

      <div className='flex  mt-15 md:mt-20 w-full flex-row'>
        {/* <div className='h-full w-52  md:w-72 bg-white'>

        </div> */}
        
        {/* Main Chat Content Area */}
        <main className="flex-1 flex flex-col items-center bg-gray-800 pt-5 pb-25 px-4">
          <div className={`w-full p-4 md:p-8 rounded-2xl transition-all ${response ? 'bg-white/70 shadow-xl' : ''}`}>
            {isLoading && (
              <div className="flex justify-center p-10">
                <Loader className="w-16 h-16 animate-spin text-white" />
              </div>
            )}

            {response ? (
              <ChatMessage content={response} />
            ) : (
              !isLoading && <div className="text-gray-400 text-2xl text-center mt-20 font-light">How can I help you today?</div>
            )}

            <div className="fixed bottom-0 left-0 w-full z-40 p-4 pb-10 flex justify-center items-end pointer-events-none">
              <div className="relative w-full md:w-2/3 lg:w-1/2 flex items-end pointer-events-auto">
                <textarea
                  ref={textareaRef}
                  placeholder="Type your prompt..."
                  className="w-full p-4 pr-14 bg-white border-2 border-gray-300 rounded-3xl shadow-2xl resize-none focus:outline-none focus:border-blue-500 text-gray-800"
                  onChange={onChangeHandler}
                  value={promtMesg}
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      onSearch();
                    }
                  }}
                />
                {
                  String(promtMesg).trim() && (
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
    </div>
  );
}

export default App;