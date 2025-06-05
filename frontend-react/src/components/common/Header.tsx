import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Button } from "../ui/button";
import { ModeToggle } from "./mode-toggle";

import { logout } from "@/redux/features/auth/authSlice";

import {
  User,
  LogOut,
  LayoutDashboard,
  Menu,
} from "lucide-react"; 

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const links = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Apartments", link: "/apartments" },
    { name: "Contact", link: "/contact" },
  ];

  const commonMenuItems = (
    <>
      <DropdownMenuItem>
        <Link className="flex gap-2" to={"/profile"} replace>
          <User />
          Profile
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <button
          onClick={() => dispatch(logout())}
          className="flex gap-2 cursor-pointer w-full text-left"
        >
          <LogOut />
          Log out
        </button>
      </DropdownMenuItem>
    </>
  );

  const renderUserRole = () => {
    if (!user) return null;

    const avatarContent = (
      <Avatar className="w-9 h-9 cursor-pointer">
        <AvatarImage src={user.profileImage || ""} />
        <AvatarFallback>{user.username[0]?.toUpperCase() ?? "U"}</AvatarFallback>
      </Avatar>
    );

    switch (user.role) {
      case "ADMIN":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger>{avatarContent}</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                <h4 className="text-lg">{user.username}</h4>
                <p className="text-muted-foreground text-sm font-light">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {commonMenuItems}
              <DropdownMenuItem>
                <Link className="flex gap-2" to={"/admin"} replace>
                  <LayoutDashboard />
                  Admin Dashboard
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      case "HOST":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger>{avatarContent}</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                <h4 className="text-lg">{user.username}</h4>
                <p className="text-muted-foreground text-sm font-light">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {commonMenuItems}
              <DropdownMenuItem>
                <Link className="flex gap-2" to={"/host"} replace>
                  <LayoutDashboard />
                  Host Dashboard
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      case "CLIENT":
      default:
        return (
          <DropdownMenu>
            <DropdownMenuTrigger>{avatarContent}</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                <h4 className="text-lg">{user.username}</h4>
                <p className="text-muted-foreground text-sm font-light">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {commonMenuItems}
            </DropdownMenuContent>
          </DropdownMenu>
        );
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg border-b border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-[1200px] flex items-center justify-between px-4 py-3 md:px-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold">
            LuxStay
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {links.map((nav, idx) => (
              <NavLink
                key={idx}
                to={nav.link}
                className={({ isActive }) =>
                  `text-sm font-medium p-2 rounded transition-colors duration-300 hover:bg-muted dark:hover:text-white ${
                    isActive ? "font-semibold underline" : ""
                  }`
                }
              >
                {nav.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              renderUserRole()
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </div>

          <button
            onClick={toggleMenu}
            aria-label="Toggle Menu"
            className="md:hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white"
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-background border-t border-black/10 dark:border-white/10">
          <ul className="flex flex-col space-y-2 px-4 py-4">
            {links.map((nav, idx) => (
              <li key={idx}>
                <NavLink
                  to={nav.link}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block w-full text-center rounded-md py-2 text-lg transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      isActive ? "font-semibold underline" : ""
                    }`
                  }
                >
                  {nav.name}
                </NavLink>
              </li>
            ))}

            {user ? (
              <li className="pt-4 border-t border-black/10 dark:border-white/10">
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.profileImage || ""} />
                    <AvatarFallback>{user.username[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                  </Avatar>
                  <p className="text-lg font-semibold">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>

                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center rounded-md py-2 bg-muted dark:bg-muted-dark"
                  >
                    Profile
                  </Link>

                  {(user.role === "ADMIN" || user.role === "HOST") && (
                    <Link
                      to={user.role === "ADMIN" ? "/admin" : "/host"}
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center rounded-md py-2 bg-muted dark:bg-muted-dark"
                    >
                      {user.role === "ADMIN" ? "Admin Dashboard" : "Host Dashboard"}
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      dispatch(logout());
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Log out
                  </button>
                </div>
              </li>
            ) : (
              <li className="pt-4 border-t border-black/10 dark:border-white/10 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center rounded-md py-2 bg-muted dark:bg-muted-dark"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center rounded-md py-2 bg-primary text-white"
                >
                  Sign up
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
