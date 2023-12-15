import Login from "./components/Login.js";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./assets/css/App.css";

import MainPage from "./components/MainPage.js";
import axios from "axios";
import MapPage from "./components/MapPage.js";
import NavBar from "./components/Navbar.js";
import NewImage from "./components/NewImage.js";
import MyProfile from "./components/MyProfile.js";
import About from "./components/About.js";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // const server = "http://localhost:5000";
  const server = "https://backend-rho-eosin-74.vercel.app"

  const validateTokenGoogle = async (token) => {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + token
      );
      return response.status === 200;
    } catch (error) {
      return null;
    }
  };

  const validateTokenBackend = async (token) => {
    try {
      const response = await axios.get(server + "/verifyToken/" + token,
        {
          headers: {
            Authorization: process.env.REACT_APP_CLIENTID,
          },
        });


      return response.status === 200;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("usuario");
    const fetchData = async () => {
      if (token) {
        const response = await validateTokenBackend(token);
        if (response) {
          const userObject = jwtDecode(token);
          setUser(userObject);
        } else {
          localStorage.removeItem("usuario");
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <BrowserRouter>
      <NavBar user={user} setUser={setUser} />
      <Routes>
        <Route
          path="/"
          element={
            !loading &&
            (user ? (
              <About
                user={user}
                setUser={setUser}
                validateToken={validateTokenBackend}
                server={server} />
            ) : (
              <Login
                user={user}
                setUser={setUser}
                validateToken={validateTokenGoogle}
                server={server}
              />
            ))
          }
        />
        <Route
          path="/main"
          element={
            !loading &&
            (user ? (
              <MainPage
                user={user}
                setUser={setUser}
                validateToken={validateTokenBackend}
                server={server} />
            ) : (
              <Login
                user={user}
                setUser={setUser}
                validateToken={validateTokenGoogle}
                server={server}
              />
            ))
          }
        />
        <Route
          path="/map"
          element={
            <MapPage
              user={user}
              setUser={setUser}
              validateToken={validateTokenBackend}
              server={server}
            />
          }
        />
        <Route
          path="/new-image"
          element={
            <NewImage
              user={user}
              setUser={setUser}
              validateToken={validateTokenBackend}
              server={server}
            />
          }
        />
        <Route
          path="/my-profile"
          element={
            !loading &&
            (user ? (
              <MyProfile
                user={user}
                setUser={setUser}
                server={server}
                validateToken={validateTokenBackend} />
            ) : (
              <Login
                user={user}
                setUser={setUser}
                validateToken={validateTokenGoogle}
                server={server}
              />
            ))
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
