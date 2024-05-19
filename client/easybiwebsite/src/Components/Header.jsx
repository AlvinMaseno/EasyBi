import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useCookies } from "react-cookie";
function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const homeImage = require("../assets/home.png");
  const searchIcon = require("../assets/searchIcon.png");
  const messageIcon = require("../assets/send-mail.png");
  const shop = require("../assets/shop.png");
  const profileImage = require("../assets/profile.png");

  const [userCookies] = useCookies(["user"]);

  const checkLoginStatus = async () => {
    if (userCookies && userCookies.user) {
      const status = userCookies.user;
      if (status !== ("undefined" || undefined)) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <div className="flex bottom-0 h-16 fixed justify-center border shadow-sm py-2 bg-white w-full">
      <div className="flex  justify-between items-center w-11/12 ">
        <NavLink
          to="/HomePage"
          activeclassname="current"
          exact="true"
          className="font-semibold flex items-center flex-col justify-center text-xs cursor-pointer"
        >
          <img alt="" src={homeImage} className="h-6 w-6" />
          <div>Home</div>
        </NavLink>
        <NavLink
          to="/SearchPage"
          activeclassname="current"
          exact="true"
          className="font-semibold flex items-center flex-col justify-center text-xs cursor-pointer"
        >
          <img alt="" src={searchIcon} className="w-6 h-6" />
          <div>Search</div>
        </NavLink>
        <NavLink
          to="/CreateAd"
          activeclassname="current"
          exact="true"
          className="font-semibold flex items-center flex-col justify-center text-xs cursor-pointer"
        >
          <img alt="" src={shop} className="w-6 h-6" />
          <div>Create</div>
        </NavLink>
        <NavLink
          to="/Messages"
          activeclassname="current"
          exact="true"
          className="font-semibold flex items-center flex-col justify-center text-xs cursor-pointer"
        >
          <img alt="" src={messageIcon} className="w-6 h-6" />
          <div>Message</div>
        </NavLink>
        {!loggedIn ? (
          <NavLink
            className="font-semibold flex items-center flex-col justify-center text-xs cursor-pointer"
            to="/SignIn"
            activeclassname="current"
            exact="true"
          >
            <img alt="" src={profileImage} className="w-6 h-6" />
            <div>Sign In</div>
          </NavLink>
        ) : (
          <NavLink
            className="font-semibold flex items-center flex-col justify-centerz text-xs cursor-pointer"
            to="/ProfilePage"
            activeclassname="current"
            exact="true"
          >
            <img alt="" src={profileImage} className="w-7 h-7" />
            <div>My Profile</div>
          </NavLink>
        )}
      </div>
    </div>
  );
}

export default Header;
