"use client";

import { motion } from "framer-motion";

interface ModalProps {
  closeModal: () => void;
}

export default function Modal({ closeModal }: ModalProps) {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center"
      >
        <h2 className="text-2xl font-bold text-gray-800">Join Journal ✍️</h2>
        <p className="text-gray-600 mt-2">Sign in or create an account to start your journey.</p>

        <div className="flex flex-col gap-4 mt-5">
          <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-500 transition-all">
            Log In
          </button>
          <button className="w-full px-4 py-2 bg-yellow-400 text-black rounded-lg shadow-md hover:bg-yellow-300 transition-all">
            Sign Up
          </button>
        </div>

        <button
          className="mt-4 text-gray-500 hover:text-gray-700"
          onClick={closeModal}
        >
          Close ❌
        </button>
      </motion.div>
    </div>
  );
}
