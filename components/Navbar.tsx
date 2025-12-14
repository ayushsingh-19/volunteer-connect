"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoggedIn = !!session;

  return (
    <nav
      className="
        w-full sticky top-0 z-50
        bg-white/80 backdrop-blur-xl
        border-b border-gray-200
        shadow-sm
        px-6 py-3
        flex items-center justify-between
      "
    >
      {/* LEFT: Logo */}
      <Link
        href="/"
        className="
          text-2xl font-extrabold
          text-indigo-600
          tracking-tight
          hover:scale-105
          transition-transform
        "
      >
        Volunteer Connect
      </Link>

      {/* CENTER: Links (ONLY WHEN LOGGED IN) */}
      {isLoggedIn && (
        <div className="hidden md:flex gap-6 font-medium text-gray-700">
          {[
            { href: "/", label: "Home" },
            { href: "/tasks", label: "Browse Tasks" },
            { href: "/tasks/add", label: "Post a Task" },
            { href: "/mine", label: "My Tasks" },
            { href: "/invites/incoming", label: "Incoming Requests" },
            { href: "/volunteering", label: "My Volunteering" },
            { href: "/dashboard", label: "Progress" },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="
                relative
                hover:text-indigo-600
                transition-colors
                after:absolute
                after:left-0
                after:-bottom-1
                after:h-[2px]
                after:w-0
                after:bg-indigo-600
                after:transition-all
                hover:after:w-full
              "
            >
              {link.label}
            </Link>
          ))}

          {session?.user?.role === "Admin" && (
            <Link
              href="/admin"
              className="text-red-600 hover:text-red-700 font-semibold"
            >
              Admin
            </Link>
          )}
        </div>
      )}

      {/* RIGHT: Auth Section */}
      {status === "loading" ? (
        <p className="text-sm text-gray-500 animate-pulse">
          Loading...
        </p>
      ) : isLoggedIn ? (
        <div className="flex items-center gap-4">
          {/* Profile */}
          <button
            onClick={() => router.push("/profile")}
            className="
              flex items-center gap-2
              px-3 py-1.5
              rounded-xl
              hover:bg-gray-100
              transition
            "
          >
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt="profile"
                width={36}
                height={36}
                className="rounded-full border border-gray-200"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
                {session.user?.name?.[0]}
              </div>
            )}

            <span className="hidden md:block font-medium text-gray-700">
              {session.user?.name}
            </span>
          </button>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="
              px-4 py-2
              bg-red-500
              text-white
              rounded-xl
              hover:bg-red-600
              hover:shadow-md
              active:scale-95
              transition
            "
          >
            Logout
          </button>
        </div>
      ) : null}
    </nav>
  );
}