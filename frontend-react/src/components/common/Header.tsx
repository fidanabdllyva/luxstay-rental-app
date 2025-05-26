import { Menu, UserCircle2 } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const { user } = useSelector((state: RootState) => state.auth);

  const links = [
    { name: "Home", link: "/" },
    { name: "Apartments", link: "/apartments" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
  ];

  const renderUserRole = () => {
    if (!user) return null;

    const commonClasses = "text-sm font-medium hover:bg-muted p-2 rounded transition-all duration-300";

    switch (user.role) {
      case "ADMIN":
        return (
          <Link to="/admin" className={commonClasses}>
            Admin Panel
          </Link>
        );
      case "HOST":
        return (
          <Link to="/host" className={commonClasses}>
            Host Dashboard
          </Link>
        );
      case "CLIENT":
      default:
        return (
          <Link to="/profile" className="flex items-center gap-2">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <UserCircle2 className="w-8 h-8 text-muted-foreground" />
            )}
            <span className="hidden md:inline text-sm">{user.username}</span>
          </Link>
        );
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg px-4 border-b border-black/10 dark:border-white/10">
      <div className="mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex gap-4">
          <Link to="/" className="text-2xl font-bold">LuxStay</Link>

          <nav className="hidden md:flex items-center gap-6 px-4">
            {links.map((nav, idx) => (
              <NavLink
                key={idx}
                to={nav.link}
                className="text-sm font-medium hover:bg-muted p-2 rounded dark:hover:text-white transition-all duration-300"
              >
                {nav.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex gap-2 items-center">
          <ModeToggle />
          {user ? (
            renderUserRole()
          ) : (
            <>
              <Link to="/login"><Button variant="outline">Log in</Button></Link>
              <Link to="/register"><Button>Sign up</Button></Link>
            </>
          )}
        </div>

        <button onClick={toggleMenu} className="block md:hidden">
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Menu */}
      <menu className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <ul className="mt-2 space-y-2 px-4 pb-4">
          {links.map((nav, idx) => (
            <li key={idx}>
              <NavLink
                to={nav.link}
                onClick={toggleMenu}
                className="block w-full text-center rounded-md py-2 text-lg transition hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {nav.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </menu>
    </header>
  );
};

export default Header;
