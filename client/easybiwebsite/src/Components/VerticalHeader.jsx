import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";


function VerticalHeader({ page }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [cookie, removeCookie] = useCookies(["user"]);
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

  const logOut = () => {
    setTimeout(() => {
      removeCookie("user");
      navigate("/SignIn");
    }, 3000);
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <div className=" text-white bg-slate-950 flex fixed h-screen pb-10 w-[200px] justify-between flex-col">
      <div className="flex  justify-between w-full  h-1/2 flex-col">
        <div className="flex h-1/4 items-center pl-3">
          <div className="font-medium text-2xl">Easy</div>
          <div className="font-medium text-2xl">Bi</div>
        </div>
        <NavLink
          to="/HomePage"
          activeclassname="current"
          exact="true"
          className={
            page === "HomePage"
              ? " py-2 flex justify-between pr-[100px] pl-2 items-center border-r-2 border-r-black  cursor-pointer"
              : " py-2 flex justify-between pr-[102px] pl-2 items-center cursor-pointer"
          }
        >
          <img alt="" src={homeImage} className="h-6 w-6" />
          <div className="text-sm">Home</div>
        </NavLink>
        <NavLink
          to="/SearchPage"
          activeclassname="current"
          exact="true"
          className={
            page === "SearchPage"
              ? " py-2 flex  justify-between pr-24 pl-2 items-center border-r-2 border-r-black  cursor-pointer"
              : " py-2 flex justify-between pr-24 pl-2 items-center cursor-pointer"
          }
        >
          <img alt="" src={searchIcon} className="w-6 h-6" />
          <div className="text-sm">Search</div>
        </NavLink>
        <NavLink
          to="/CreateAd"
          activeclassname="current"
          exact="true"
          className={
            page === "CreateAd"
              ? " py-2 flex justify-between pr-[70px] pl-2 items-center border-r-2 border-r-black  cursor-pointer"
              : " py-2 flex justify-between pr-[70px] pl-2 items-center cursor-pointer"
          }
        >
          <img alt="" src={shop} className="w-6 h-6" />
          <div className="text-sm">My Adverts</div>
        </NavLink>
        <NavLink
          to="/Messages"
          activeclassname="current"
          exact="true"
          className={
            page === "Messages"
              ? " py-2 flex justify-between pr-[80px] pl-2 items-center border-r-2 border-r-black  cursor-pointer"
              : " py-2 flex justify-between pr-[80px] pl-2 items-center cursor-pointer"
          }
        >
          <img alt="" src={messageIcon} className="w-7 h-7" />
          <div className="text-sm">Messages</div>
        </NavLink>
      </div>
      {!loggedIn ? (
        <div className="mr-5 w-full">
          <NavLink
            className=" py-2 flex justify-between pr-5 pl-2 items-center cursor-pointer"
            to="/SignIn"
            activeclassname="current"
            exact="true"
          >
            <div className="text-sm cursor-pointer">SIGN IN</div>
          </NavLink>
          <NavLink
            className=" py-2 flex justify-between pr-5 pl-2 items-center cursor-pointer"
            to="/SignUp"
            activeclassname="current"
            exact="true"
          >
            <div className="text-sm cursor-pointer">SIGN UP</div>
          </NavLink>
        </div>
      ) : (
        <div className=" items-center flex flex-col">
          <NavLink
            className={
              page === "ProfilePage"
                ? " py-2 flex justify-between pr-[60px] pl-2 items-center border-r-2 border-r-black  cursor-pointer"
                : " py-2 flex w-full justify-between pr-[60px] pl-2 items-center cursor-pointer"
            }
            to="/ProfilePage"
            activeclassname="current"
            exact="true"
          >
            <img alt="" src={profileImage} className="w-7 h-7" />
            <div className="text-sm cursor-pointer">MY ACCOUNT</div>
          </NavLink>
          <div className=" py-2 flex justify-between pr-[60px] pl-2 items-center cursor-pointer">
            <div onClick={logOut} className="text-sm cursor-pointer">LOG OUT</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerticalHeader;
