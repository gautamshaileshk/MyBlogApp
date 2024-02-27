import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import { Navigate } from "react-router-dom";
const Header = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  const logout = async () => {
    await fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
    <Navigate to="/" />;
  };
  const username = userInfo?.username;
  return (
    <header>
      <Link to="/" className="logo">
        MyBlog{" "}
      </Link>
      <nav>
        {username && (
          <>
            <Link to="/create"> Create new post</Link>
            <a onClick={logout}>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>

            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};
export default Header;
