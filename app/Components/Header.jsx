"use client";

import Link from "next/link";
import React from "react";
import logo from "@/public/ins_logo.png";
import wrilogo from "@/public/ins_wri.png";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
export default function Header() {
  const { data: session } = useSession();
  console.log(session);

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

        {/* menu items */}

        {session ? (
          <img
            src={session.user.image}
            alt={session.user.name}
            className="h-10 w-10 rounded-full cursor-pointer object-cover"
            onClick={signOut}
          />
        ) : (
          <button
            onClick={signIn}
            className="text-sm font-semibold text-blue-500"
          >
            Log In
          </button>
        )}
      </div>
    </div>
  );
}
