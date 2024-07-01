import { useState, useEffect } from 'react';
import { messages } from './utils/Message';
import './styles.css';

const SubKnowledge = () => {
  const [currentMessages, setCurrentMessages] = useState<{ title: string; content: string; }[]>([]);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const getRandomMessages = () => {
      const numMessages = Math.floor(Math.random() * 2) + 2; // Lấy ngẫu nhiên 2 hoặc 3 tin nhắn
      const shuffled = messages.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, numMessages);
    };

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentMessages(prevMessages => {
          const newMessages = prevMessages.slice(1); // Xóa tin nhắn đầu tiên
          return newMessages.length > 0 ? newMessages : getRandomMessages();
        });
        setFade(true);
      }, 500); // Thời gian hiệu ứng mờ dần
    }, 10000); // 10 giây

    setCurrentMessages(getRandomMessages()); // Hiển thị tin nhắn ngay khi component mount

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sm:w-full w-1/4 p-2 nes-container bg-[#7e56f3] rounded-[24px] flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center text-white mb-2">
          <div>SUB-KNOWLEDGE</div>
        </div>
        <div className="p-2">
          <div className={` p-2 ${fade ? 'fade-in' : 'fade-out'}`}>
            <div className="cursor-pointer gap-5">
            {currentMessages.map((message, index) => (
                <div key={index} className="nes-balloon from-left nes-pointer mb-2" style={{ marginBottom: '5vh', transform: 'scale(1)' }}>
                  <div className="text-red-500">{message.title}</div>
                  <div className="text-black">
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubKnowledge;