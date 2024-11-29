"use client";

import React from "react";
import { FaUser } from "react-icons/fa";
import { MdOutlineBalance } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";

const UsersIcons = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center bg-white p-4 rounded-full mr-4">
      {pathname.startsWith("/juez") ? (
        <Link href="/" passHref>
          <MdOutlineBalance size={30} className="text-tsjcolor cursor-pointer" />
        </Link>
      ) : (
        <Link href="/juez" passHref>
          <FaUser size={30} className="text-tsjcolor cursor-pointer" />
        </Link>
      )}
    </div>
  );
};

export default UsersIcons;
