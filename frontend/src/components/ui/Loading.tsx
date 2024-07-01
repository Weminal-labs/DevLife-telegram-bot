import { FaSpinner } from 'react-icons/fa';

const Loading = () => (
  <div className="flex flex-col justify-center items-center h-screen">
    <div className="flex flex-col items-center">
        <img src="/assets/UI/console_1.png" alt="Devlife Game" className="mb-4 rounded-lg" style={{ width: "300px", height: "auto" }} />
        <button className="flex items-center px-4 py-2 bg-gray-300 rounded-md mt-4">
        <FaSpinner className="animate-spin mr-2" /> {/* Icon spinner */}
      </button>
    </div>
  </div>
);

export default Loading;
