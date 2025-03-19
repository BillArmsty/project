import { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginRegisterModal({ isOpen, onClose }: ModalProps) {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{isLogin ? "Login" : "Register"}</h2>
          <button onClick={onClose}>
            <FaTimes className="text-gray-500 hover:text-gray-800" />
          </button>
        </div>

        {/* Form Fields */}
        <form className="flex flex-col space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="border rounded p-2 w-full"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="border rounded p-2 w-full"
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded p-2 w-full"
          />
          <button className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* Toggle between Login/Register */}
        <p className="text-center text-sm mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {" "}
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
