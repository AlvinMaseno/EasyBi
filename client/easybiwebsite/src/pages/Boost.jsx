import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { IoClose } from "react-icons/io5";
import VerticalHeader from "../Components/VerticalHeader";
import Header from "../Components/Header";

const Boost = () => {
  const [personalAdInfoCookies] = useCookies(["personalAdInfo"]);
  const [largeScreen, setLargeScreen] = useState(false);
  const [id, setId] = useState();
  const [invalidPhoneNo, setInvalidPhoneNo] = useState(false);
  const [phoneNo, setPhoneNo] = useState();
  const [phoneNoMenu, setPhoneNoMenu] = useState();
  const [userID, setUserID] = useState();
  const [adName, setAdName] = useState();
  const [userName, setUserName] = useState();
  const [weeklyPrice, setWeeklyPrice] = useState("1");
  const [monthlyPrice, setMonthlyPrice] = useState("2");
  const navigate = useNavigate();
  const [plan, setPlan] = useState(); //when a certain plan is called
  const weeklyPng = require("../assets/weekly.png");
  const monthlyPng = require("../assets/monthly.png");

  const handlePayment = async () => {
    const phoneNoRegex = /^\+[0-9]{10,15}$/; // Regex pattern for exactly 9 digits

    if (!phoneNoRegex.test(phoneNo)) {
      setInvalidPhoneNo(true);
      return; // Exit the function if phoneNo is not 9 characters long
    }
    const phoneNumber = phoneNo.slice(4);
    const data = {
      PhoneNumber: phoneNumber,
      Amount: plan,
      AdID: id,
      UserName: userName,
      AdName: adName,
      UserID: userID,
    };
    //send stk push
    axios
      .post(`https://www.adinfinite.co.ke/stk`, data)
      .then(() => {
        document.body.style.overflow = "visible";
        navigate("/HomePage");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  //request database for current pricing
  const getPricing = async () => {
    
  };

  useEffect(() => {
    getPricing();

    const personalAdInfo = personalAdInfoCookies.personalAdInfo;
    setId(personalAdInfo._id);
    setUserID(personalAdInfo.UserID);
    setAdName(personalAdInfo.Name);
    setUserName(personalAdInfo.UserName);
    const handleResize = () => {
      setLargeScreen(window.innerWidth >= 1000);
    };

    window.addEventListener("resize", handleResize);
    // Initial check on component mount
    handleResize();
    // Cleanup the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      {phoneNoMenu === true ? (
        <div className="z-30 h-screen w-full absolute">
          <div
            onClick={() => {
              setPhoneNoMenu(false);
              document.body.style.overflow = "visible";
            }}
            className="absoulte z-40 bg-black flex flex-row-reverse sm:pr-10"
          >
            <IoClose size={40} className="opacity-70" color="white" />
          </div>
          <div className="absolute flex bg-black z-10 w-full h-screen opacity-80 items-center justify-center "></div>
          <div className="flex justify-center items-center absolute z-20 w-full h-screen">
            <div className="bg-white w-[600px] h-[300px] rounded p-5">
              <div className="flex justify-center">
                <div className="text-xl">Enter Contact</div>
              </div>
              <div className="flex justify-center my-5">
                <div className="text-xs">
                  Enter the Mpesa Number and a message will appear in your phone
                </div>
              </div>
              <div className="flex justify-center my-5">
                <div className="relative w-full flex justify-center items-center ">
                  <input
                    placeholder="( +254 ) Phone Number"
                    onChange={(e) => {
                      setPhoneNo(e.target.value);
                    }}
                    value={phoneNo}
                    className="border-[1.5px] text-xl placeholder:text-sm  max-h-20 sm:w-3/4 w-5/6  my-2 p-4 focus:outline-none"
                  />
                  <div
                    className=" inline-block absolute top-1/3 left-[74%] "
                    onClick={() => {
                      handlePayment();
                    }}
                  >
                    <div className=" rounded flex h-7 w-16 justify-center items-center absolute cursor-pointer">
                      <div className="text-blue-400">SEND</div>
                    </div>
                  </div>
                </div>
              </div>
              {invalidPhoneNo ? (
                <div className="flex justify-center">
                  <div className="text-sm text-red-500 ">
                    INVALID PHONE NUMBER FORMAT
                  </div>
                </div>
              ) : (
                <></>
              )}

              <div className="flex justify-center">
                <div className="text-xs text-gray-600">
                  This will charge you the Ksh {plan}/-
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="flex">
        {largeScreen ? (
          <div className="z-20">
            <VerticalHeader page="CreateAd" />
          </div>
        ) : (
          <></>
        )}
        <div className="lg:ml-[164px] w-full h-screen  flex-col flex items-center">
          <div className="flex justify-centerr text-center">
            <div className="sm:my-10 mt-10  sm:text-5xl 4xs:text-3xl ">
              Boosted Advertisements
            </div>
          </div>
          <div className="flex justify-center w-full">
            <div className="my-5 mx-4">
              Only paid advertisements appear on the home screen, otherwise,
              they must be searched to be located.
            </div>
          </div>

          <div className="flex justify-center w-full">
            <div className="flex justify-center md:w-[85%] lg:w-[70%] w-[75%] lg:justify-between items-center 4xs:flex-col md:flex-row">
              <div
                className="border-l-8 mr-8 hover:scale-105 rounded-l-none transition-transform duration-400 cursor-pointer my-5 border-black border-r-8 shadow-2xl p-5 4xs:w-full md:w-[350px] bg-white"
                onClick={() => {
                  document.body.style.overflow = "hidden";
                  setPlan(weeklyPrice);
                  setPhoneNoMenu(true);
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className=" 2xs:text-xl">Weekly Plan</div>
                    <div className="mt-1">
                      <div className=" text-gray-500 text-sm">
                        Ksh {weeklyPrice}/week
                      </div>
                    </div>
                  </div>
                  <div>
                    <img
                      alt=""
                      src={weeklyPng}
                      className="4xs:w-10 4xs:h-10 md:h-12 md:w-12"
                    />
                  </div>
                </div>

                <div className="lg:mt-5 mt-2">
                  <div className=" text-sm">
                    Displays this advert on the home screen for a week
                  </div>
                </div>
              </div>
              <div
                className="border-l-8 mr-8 hover:scale-105 transition-transform duration-400 cursor-pointer my-5  shadow-2xl p-5 border-l-black border-r-black border-r-8 md:h-40 h-36 4xs:w-full md:w-[350px] bg-white"
                onClick={() => {
                  document.body.style.overflow = "hidden";
                  setPlan(monthlyPrice);
                  setPhoneNoMenu(true);
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="2xs:text-xl">Monthly Plan</div>
                    <div className="mt-1">
                      <div className=" text-gray-500 text-sm">
                        Ksh {monthlyPrice}/month
                      </div>
                    </div>
                  </div>
                  <div>
                    <img
                      alt=""
                      src={monthlyPng}
                      className="4xs:w-10 4xs:h-10 md:h-12 md:w-12 "
                    />
                  </div>
                </div>
                <div className="lg:mt-5 mt-2">
                  <div className=" text-sm">
                    Displays this advert on the home screen for a month
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex lg:mt-20 mt-5 pb-20 flex-col items-center text-gray-500 text-sm">
            <div>Contact AdInfinite: +254758525285</div>
            <div>Email AdInfinite: tom.ndemo.adinfinite@gmail.com</div>
          </div>
        </div>
        {largeScreen ? (
          <></>
        ) : (
          <div className="z-20 absolute">
            <Header page="CreateAd" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Boost;
