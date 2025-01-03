"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import logo from "@/public/ins_logo.png";
import wrilogo from "@/public/ins_wri.png";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { LuCirclePlus } from "react-icons/lu";
import { HiCamera } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import ReactModal from "react-modal";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
export default function Header() {
  const { data : session } = useSession();
  const [isOpen, setisOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const filePiker = useRef(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [postUploading, setPostUploading] = useState(false);
  const [caption, setCaption] = useState("");

  function addImagehandler(e) {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
      setFileUrl(URL.createObjectURL(file));
    }
  }

  useEffect(() => {
    uploadImageToStorage();
  }, [selectedFile]);

  async function uploadImageToStorage() {
    setImageFileUploading(true);
    const storage = getStorage('');
    const fileName = new Date().getTime() + "-" + selectedFile;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(" Upload is " + progress + " % Done");
      },
      (error) => {
        console.error(error);
        setImageFileUploading(false);
        setFileUrl(null);
        setSelectedFile(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFileUrl(downloadURL);
          setImageFileUploading(false);
        });
      }
    );
  }

  const db = getFirestore(app);
  async function handleSubmit() {
    setPostUploading(true);
    const docRef = await addDoc(collection(db, "posts"), {
      username: session.user.username,
      caption,
      profileImg: session.user.image,
      image: fileUrl,
      timestamp: serverTimestamp(),
    });
    setPostUploading(false);
    setisOpen(false);
  }
  return (
    <div className="shadow-sm border-b sticky top-0 bg-white z-30 p-3">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Logo */}

        <Link className="hidden md:inline-flex" href="/">
          <Image
            src={wrilogo}
            alt="logo"
            width={96}
            height={96}
            priority={true}
          />
        </Link>
        <Link className="md:hidden" href="/">
          <Image src={logo} alt="logo" width={40} height={40} priority={true} />
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
              onClick={signOut}
              src={session?.user?.image}
              alt={session?.user?.name}
              className="w-10 h-10 rounded-full cursor-pointer"
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
        <ReactModal
          className="max-w-lg outline-none w-[90%] p-6 absolute top-[110px] left-[50%] translate-x-[-50%] border-2 rounded-md shadow-md bg-white"
          isOpen={isOpen}
          onRequestClose={() => setisOpen(false)}
          ariaHideApp={false}
        >
          <div className="flex flex-col justify-center items-center">
            {selectedFile ? (
              <img
                onClick={() => setSelectedFile(null)}
                src={fileUrl}
                alt="Upload Image"
                className={`w-full max-h-[250px] object-cover rounded-md ${
                  imageFileUploading ? "animate-pulse" : ""
                }`}
              />
            ) : (
              <HiCamera
                onClick={() => filePiker.current.click()}
                className="text-5xl text-gray-400 cursor-pointer"
              />
            )}
            <input
              hidden
              ref={filePiker}
              type="file"
              accept="image/*"
              onChange={addImagehandler}
            />
            <input
              type="text"
              maxLength="150"
              placeholder="Enter your caption..."
              className="text-center w-full focus:ring-0 outline-none my-3"
              onChange={(e) => setCaption(e.target.value)}
            />
            <button
              onClick={handleSubmit}
              disabled={
                !selectedFile || caption.trim() === "" || postUploading || imageFileUploading
              }
              className="w-full bg-red-600 text-white p-2 rounded-md shadow-lg hover:brightness-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:brightness-100"
            >
              Upload post
            </button>
            <AiOutlineClose
              onClickCapture={() => setSelectedFile(null)}
              className="cursor-pointer absolute top-2 right-2 hover:text-red-800 transition duration-300"
              onClick={() => setisOpen(false)}
            />
          </div>
        </ReactModal>
      )}
    </div>
  );
}
