"use client";

import Link from "next/link";
import React, { useState } from "react";
import logo from "@/public/ins_logo.png";
import wrilogo from "@/public/ins_wri.png";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import Modal from "react-modal";
import { LuCirclePlus } from "react-icons/lu";
import { HiCamera } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
export default function Header() {
  const { data : session } = useSession();
  
  const [isOpen, setisOpen] = useState(false);  
  return (
    <div className="shadow-sm border-b sticky top-0 bg-white z-30 p-3">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Logo */}

        <Link className="hidden md:inline-flex" href="/">
          <Image src={wrilogo} alt="logo" width={96} height={96} />
        </Link>
        <Link className="md:hidden" href="/">
          <Image src={logo} alt="logo" width={40} height={40} />
        </Link>

        {/* search input */}
        <div>
          <input
            type="search"
            placeholder="Search"
            className="bg-gray-50 border border-gray-200 rounded text-sm w-full px-4 py-2 max-w-[210px]"
          />
        </div>

        {/* profile items */}

        {session ? (
          <div className="flex items-center gap-x-3">
            <LuCirclePlus
              className="text-2xl cursor-pointer hover:text-red-500 duration-200 transform hover:scale-125 transition"
              onClick={() => setisOpen(true)}
            />
            <img
              src={session.user.image}
              alt={session.user.name}
              className="h-10 w-10 rounded-full cursor-pointer object-cover"
              onClick={signOut}
            />
          </div>
        ) : (
          <button
            onClick={signIn}
            className="text-sm font-semibold text-blue-500"
          >
            Log In
          </button>
        )}
      </div>
      {isOpen && (
        <Modal
          className="max-w-lg outline-none w-[90%] p-6 absolute top-56 left-[50%] translate-x-[-50%] border-2 rounded-md shadow-md bg-white"
          isOpen={isOpen}
          onRequestClose={() => setisOpen(false)}
          ariaHideApp={false}
        >
          <div className="flex flex-col justify-center items-center">
            <HiCamera className="text-5xl text-gray-400 cursor-pointer" />
            <input
              type="text"
              maxLength="150"
              placeholder="Enter your caption..."
              className="text-center w-full focus:ring-0 outline-none my-3"
            />
            <button
              disabled
              className="w-full bg-red-600 text-white p-2 rounded-md shadow-lg hover:brightness-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:brightness-100"
            >
              Upload post
            </button>
            <AiOutlineClose
              className="cursor-pointer absolute top-2 right-2 hover:text-red-800 transition duration-300"
              onClick={() => setisOpen(false)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
