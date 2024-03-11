import { useEffect, useState } from "react";
import { FaCubes } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import Blank from "./Blank";
import { SideBar } from "./SideBar";

const Header = () => {
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  const location = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [location]);

  const openMenu = () => {
    setOpen(!open);
  };

  return (
    <header className="z-20 px-3 bg-white flex justify-between h-[50px] items-center shadow-lg fixed top-0 w-full">
      <button className="relative pl-2 block sm:hidden" onClick={openMenu}>
        <GiHamburgerMenu size={20} />
      </button>
      {open && (
        <div className="fixed top-[50px] block sm:hidden bg-[#efefef] border-r border-b border-slate-500 shadow-lg w-60 h-3/5">
          <SideBar open={open} openMenu={openMenu} />
        </div>
      )}
      <div className="flex mx-3 items-center">
        <FaCubes size={35} className="text-orange-400 mx-1" />
        <Link to="/" className="flex text-xl text-neutral-900">
          heap<span className="font-bold mx-1"> overflow</span>
        </Link>
      </div>
      {user ? (
        <div className="flex h-full">
          <Link
            to={`/users/${user._id}`}
            className="flex h-full items-center justify-center mr-10 hover:bg-slate-200 transition-colors px-4"
          >
            <img
              src={user.avatar}
              alt={user.username}
              className="w-6 h-6 rounded"
            />
            <span className="text-sm font-semibold text-slate-600 mx-1">
              {user.reputation}
            </span>
          </Link>
          <div className="fall-container flex items-center">
            <button
              className="text-sm font-semibold text-orange-500 fall"
              onClick={() => dispatch(logout())}
            >
              Log out
            </button>
          </div>
        </div>
      ) : (
        <div>
          <Link
            to="/login"
            className="p-2 mx-1 text-sm text-white rounded border border-blue-500 bg-blue-300 hover:bg-blue-400 transition-all"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="p-2 mx-1 text-sm text-white rounded border border-blue-700 bg-blue-500  hover:bg-blue-600 transition-all"
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
