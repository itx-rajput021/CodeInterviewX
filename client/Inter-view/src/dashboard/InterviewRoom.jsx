import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const InterviewRoom = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const userName = user?.name;
  const userRole = user?.role;
  const [code, setCode] = useState('// Write your solution here\n');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userName) {
      navigate('/signin');
      return;
    }
    const socket = io('http://localhost:5000');
    socketRef.current = socket;
    socket.emit('room:join', { roomCode, name: userName, role: userRole });
    socket.on('code:change', ({ code: incomingCode, language: incomingLanguage }) => {
      setCode(incomingCode);
      if (incomingLanguage) setLanguage(incomingLanguage);
    });
    socket.on('chat:new', (chat) => setMessages((items) => [...items, chat]));
    return () => socket.disconnect();
  }, [roomCode, navigate, userName, userRole]);

  const changeCode = (value) => {
    setCode(value);
    socketRef.current?.emit('code:change', { roomCode, code: value, language });
  };

  const changeLanguage = (value) => {
    setLanguage(value);
    socketRef.current?.emit('code:change', { roomCode, code, language: value });
  };

  const runCode = () => {
    setOutput('Running demo JavaScript execution...\n');
    if (language !== 'javascript') {
      setOutput(`Demo mode: ${language} execution is available in production, but this preview can execute JavaScript only.`);
      return;
    }
    try {
      const logs = [];
      const sandboxConsole = { log: (...args) => logs.push(args.map(String).join(' ')) };
      const runner = new Function('console', code);
      runner(sandboxConsole);
      setOutput(logs.length ? logs.join('\n') : 'Execution completed with no console output.');
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    socketRef.current?.emit('chat:send', { roomCode, message: message.trim(), name: user.name });
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <header className="mx-auto mb-4 flex max-w-[1600px] items-center justify-between rounded-xl border border-gray-800 bg-gray-900 px-5 py-3">
        <div><p className="text-sm text-gray-400">Interview room</p><h1 className="font-bold">{roomCode}</h1></div>
        <button onClick={() => navigate('/dashboard')} className="rounded-lg bg-gray-800 px-4 py-2 hover:bg-gray-700">Leave Room</button>
      </header>
      <main className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[1fr_330px]">
        <section className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
          <div className="flex items-center justify-between border-b border-gray-800 p-3">
            <select value={language} onChange={(event) => changeLanguage(event.target.value)} className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2">
              <option value="javascript">JavaScript</option><option value="python">Python (preview)</option><option value="cpp">C++ (preview)</option>
            </select>
            <button onClick={runCode} className="rounded-lg bg-green-600 px-5 py-2 font-semibold hover:bg-green-700">Run</button>
          </div>
          <textarea aria-label="Code editor" value={code} onChange={(event) => changeCode(event.target.value)} spellCheck="false" className="h-[56vh] w-full resize-none bg-[#0b1020] p-5 font-mono text-sm leading-6 text-blue-100 outline-none" />
          <pre className="h-32 overflow-auto border-t border-gray-800 bg-black p-4 text-sm text-green-400">{output || 'Output will appear here.'}</pre>
        </section>
        <aside className="flex h-[70vh] flex-col rounded-xl border border-gray-800 bg-gray-900">
          <h2 className="border-b border-gray-800 p-4 font-semibold">Room Chat</h2>
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {messages.map((chat, index) => <div key={index} className="rounded-lg bg-gray-800 p-3"><p className="text-xs text-blue-400">{chat.name}</p><p className="mt-1 text-sm">{chat.message}</p></div>)}
          </div>
          <form onSubmit={sendMessage} className="flex gap-2 border-t border-gray-800 p-3">
            <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Type a message" className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 outline-none" />
            <button className="rounded-lg bg-blue-600 px-4">Send</button>
          </form>
        </aside>
      </main>
    </div>
  );
};

export default InterviewRoom;
