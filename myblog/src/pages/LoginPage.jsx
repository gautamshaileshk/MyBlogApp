import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";
const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRredirect] = useState("");
  const { setUserInfo } = useContext(UserContext);
  const login = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        setRredirect(true);
      });
    } else {
      alert("wrong credentails");
    }
  };
  if (redirect) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <form onSubmit={login} className="login">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
};
export default LoginPage;
