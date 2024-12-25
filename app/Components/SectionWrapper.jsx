"use client";

import { SessionProvider } from "next-auth/react";

const SectionWrapper = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SectionWrapper;
