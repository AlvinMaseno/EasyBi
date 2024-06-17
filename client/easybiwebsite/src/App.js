import Homepage from "./pages/Homepage";
import { BrowserRouter, Route, Routes } from "react-router-dom"; // Correct import
import { CookiesProvider } from "react-cookie";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import React, { useState, createContext } from "react";
import Verify from "./pages/Verify";
import "../src/pagescss/slideanimation.css";
import LandingPage from "./pages/LandingPage";
import ResetPassword from "./pages/ResetPassword";
import VerifyPassword from "./pages/VerifyPassword";

function App() {
  const [messageInfo, setMessageInfo] = useState();
  const [coordinateData, setCoordinateData] = useState(); //used by AdContext to pass the data about the ad

  return (
    <CoordinateContext.Provider value={{ coordinateData, setCoordinateData }}>
      <MessageContext.Provider value={{ messageInfo, setMessageInfo }}>
        <CookiesProvider>
          <BrowserRouter>
            <div style={{ fontFamily: "MyFont" }}>
              <Routes>
                <Route path="/" exact element={<LandingPage />} />
                <Route path="/HomePage" exact element={<Homepage />} />
                <Route path="/SignIn" exact element={<SignIn />} />
                <Route path="/SignUp" exact element={<SignUp />} />
                <Route path="/Verify" exact element={<Verify />} />
                <Route path="*" exact element={<NotFound />} />
                <Route path="/LandingPage" exact element={<LandingPage />} />
                <Route path="/ResetPassword" exact element={<ResetPassword />} />
                <Route path="/VerifyPassword" exact element={<VerifyPassword />} />
              </Routes>
            </div>
          </BrowserRouter>
        </CookiesProvider>
      </MessageContext.Provider>
    </CoordinateContext.Provider>
  );
}

export default App;

export const MessageContext = createContext();
export const CoordinateContext = createContext();
