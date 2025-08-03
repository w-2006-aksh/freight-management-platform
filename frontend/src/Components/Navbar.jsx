import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/user";
import apiCall from "../../util/apiCall";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const handleLogout = async () => {
    try {
     
      const res = await apiCall("/api/me/logout", { method: "POST" });
      if (res.success) {
        dispatch(logout());
        setMenuOpen(false);
        toast.success(res.message);
        navigate("/");
      }
    } catch (err) {
      toast.error("Logout failed!");
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="bg-gray-200 font-sans">
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-md h-[75px] flex items-center justify-between px-6 lg:px-20">
        <Link
          to="/"
          className="text-2xl font-bold border-2 border-gray-800 px-4 py-1 rounded-md hover:bg-gray-300 transition-all duration-300"
        >
          ABC
        </Link>

        <ul
          className={`${
            menuOpen ? "top-full" : "top-[-500%]"
          } absolute left-0 w-full max-lg:bg-white/70 max-lg:backdrop-blur-md max-lg:shadow-xl flex flex-col items-center gap-6 py-6 transition-all duration-500 ease-in-out lg:static lg:w-auto lg:flex lg:flex-row lg:bg-transparent lg:shadow-none lg:py-0 lg:gap-8 text-lg font-semibold`}
        >
          {isAuthenticated ? (
            user?.role === "client" ? (
              <>
                <li>
                  <Link
                    to="/client/postABid"
                    className="hover:text-orange-600 transition"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    Post a Bid
                  </Link>
                </li>
                <li>
                  <Link
                    to="/client/bids"
                    className="hover:text-orange-600 transition"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    My Bids
                  </Link>
                </li>
                <li>
                  <button
                    className="bg-orange-500 text-white px-4 py-1.5 rounded-md hover:bg-orange-600 transition"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/transporter/bids"
                    className="hover:text-orange-600 transition"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    Bids
                  </Link>
                </li>
                <li>
                  <Link
                    to="/transporter/trips"
                    className="hover:text-orange-600 transition"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    My Trips
                  </Link>
                </li>
                <li>
                  <button
                    className="bg-orange-500 text-white px-4 py-1.5 rounded-md hover:bg-orange-600 transition"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )
          ) : (
            <>
              <li>
                <Link
                  to="/loginAs"
                  className="hover:text-orange-600 transition"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signUpAs"
                  className="hover:text-orange-600 transition"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  Create Account
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="lg:hidden">
          <i
            className="fa-solid fa-bars fa-xl cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          ></i>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
