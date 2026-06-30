import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/user";
import apiCall from "../../util/apiCall";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

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
    <nav className="fixed top-0 left-0 z-50 flex h-[75px] w-full items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md lg:px-20">
      <Button variant="outline" size="lg" asChild>
        <Link to="/">ABC</Link>
      </Button>

      <ul
        className={`${
          menuOpen ? "top-full" : "top-[-500%]"
        } absolute left-0 flex w-full flex-col items-center gap-4 py-6 text-base font-medium transition-all duration-500 ease-in-out max-lg:bg-background/95 max-lg:shadow-xl lg:static lg:w-auto lg:flex-row lg:bg-transparent lg:py-0 lg:shadow-none`}
      >
        {isAuthenticated ? (
          user?.role === "client" ? (
            <>
              <li>
                <Button variant="ghost" asChild>
                  <Link
                    to="/client/post-a-bid"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    Post a Bid
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="ghost" asChild>
                  <Link
                    to="/client/bids"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    My Bids
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="ghost" asChild>
                  <Link
                    to="/client/manage-trusted-transporters"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    Manage Trusted Transporters
                  </Link>
                </Button>
              </li>
              <li>
                <Button onClick={handleLogout}>Logout</Button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Button variant="ghost" asChild>
                  <Link
                    to="/transporter/bids"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    Bids
                  </Link>
                </Button>
              </li>
              <li>
                <Button onClick={handleLogout}>Logout</Button>
              </li>
            </>
          )
        ) : (
          <>
            <li>
              <Button variant="ghost" asChild>
                <Link to="/loginAs" onClick={() => setMenuOpen(!menuOpen)}>
                  Login
                </Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild>
                <Link to="/signUpAs" onClick={() => setMenuOpen(!menuOpen)}>
                  Create Account
                </Link>
              </Button>
            </li>
          </>
        )}
      </ul>

      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Menu className="size-5" />
      </Button>
    </nav>
  );
}

export default Navbar;
