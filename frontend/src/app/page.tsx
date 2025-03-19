"use client";
import { useState } from "react";
import Head from "next/head";
import LoginRegisterModal from "../components/LoginRegisterModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Journal App - Capture Your Thoughts</title>
        <meta name="description" content="A simple and secure journal app to capture your thoughts." />
      </Head>

      <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center">
        <h1 className="text-5xl font-bold mb-6 animate-fade-in">Welcome to Journal App</h1>
        <p className="text-lg max-w-md mb-8 opacity-90">Capture your thoughts, reflect on your journey, and analyze your habits.</p>

        <button
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-100 transition duration-200"
          onClick={() => setIsModalOpen(true)}
        >
          Get Started
        </button>

        {/* Modal for Login/Register */}
        <LoginRegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </main>
    </>
  );
}
