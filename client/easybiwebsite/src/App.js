import Homepage from "./pages/Homepage";
import { BrowserRouter, Route, Routes } from "react-router-dom"; // Correct import
import { CookiesProvider } from "react-cookie";
import SearchPage from "./pages/SearchPage";
import SignIn from "./pages/SignIn";
import CreateAd from "./pages/CreateAd";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import AdScreen from "./pages/AdScreen";
import Messages from "./pages/Messages";
import React, { useState, createContext } from "react";
import ProfilePage from "./pages/ProfilePage";
import Verify from "./pages/Verify";
import VerifyPassword from "./pages/VerifyPassword";
import ResetPassword from "./pages/ResetPassword";
import Boost from "./pages/Boost";
import Analytics from "./pages/Analytics";

import "../src/pagescss/slideanimation.css";
import LandingPage from "./pages/LandingPage";

function App() {
  const [coordinateData, setCoordinateData] = useState(); //used by AdContext to pass the data about the ad
  const [messageInfo, setMessageInfo] = useState();

  return (
    <MessageContext.Provider value={{ messageInfo, setMessageInfo }}>
      <CoordinateContext.Provider value={{ coordinateData, setCoordinateData }}>
        <CookiesProvider>
          <BrowserRouter>
            <div style={{ fontFamily: "MyFont" }}>
              <Routes>
                <Route path="/" exact element={<LandingPage />} />
                <Route path="/HomePage" exact element={<Homepage />} />
                <Route path="/SearchPage" exact element={<SearchPage />} />
                <Route path="/SignIn" exact element={<SignIn />} />
                <Route path="/CreateAd" exact element={<CreateAd />} />
                <Route path="/SignUp" exact element={<SignUp />} />
                <Route path="/Verify" exact element={<Verify />} />
                <Route path="*" exact element={<NotFound />} />
                <Route path="/ProfilePage" exact element={<ProfilePage />} />
                <Route path="/LandingPage" exact element={<LandingPage />} />
                <Route path="/AdScreen/:id" exact element={<AdScreen />} />
                <Route path="/Messages" exact element={<Messages />} />
                <Route
                  path="/VerifyPassword"
                  exact
                  element={<VerifyPassword />}
                />
                <Route
                  path="/ResetPassword"
                  exact
                  element={<ResetPassword />}
                />
                <Route path="/Boost" exact element={<Boost />} />
                <Route path="/Analytics" exact element={<Analytics />} />
              </Routes>
            </div>
          </BrowserRouter>
        </CookiesProvider>
      </CoordinateContext.Provider>
    </MessageContext.Provider>
  );
}

export default App;

export const MessageContext = createContext();
export const CoordinateContext = createContext();
