import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import VerticalHeader from "../Components/VerticalHeader";
import Header from "../Components/Header";

const Analytics = () => {
  const [personalAdInfoCookies] = useCookies(["personalAdInfo"]);
  const [largeScreen, setLargeScreen] = useState(false);

  const personalAdInfo = personalAdInfoCookies.personalAdInfo;

  //convert date from db format to ddmmyyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
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
    <div className="flex">
      {largeScreen ? (
        <div className="z-20">
          <VerticalHeader page="CreateAd" />
        </div>
      ) : (
        <></>
      )}
      <div className="lg:ml-[164px] w-full justify-center items-center">
        <div
          style={{ background: "#f0f0f0" }}
          className="-z-40 h-[100%] w-[100%]  blur-sm  absolute "
        ></div>
        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex flex-col justify-center items-center">
            <div className="md:text-5xl 4xs:text-3xl mt-9 sm:mb-4 4xs:mb-[15%]">Subscription Plan</div>
            <div className="text-3xl mt-10 pb-5">Summary</div>
          </div>

          <div className="flex items-center justify-center  w-full">
            <div className=" bg-white lg:py-10 4xs:py-6 border-2 border-blue-200 shadow-2xl w-[85%] md:w-[50%] flex justify-center rounded-xl p-4">
              <div className="w-4/5  flex flex-col h-[150px] justify-between">
                <div className="flex justify-between">
                  <div className="font-semibold">Date Created:</div>
                  <div className="font-light">
                    {formatDate(personalAdInfo.DateCreated)}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="font-semibold">Expiry Date:</div>
                  <div className="font-light">
                    {formatDate(personalAdInfo.ExpiryDate)}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="font-semibold">Plan:</div>
                  <div className="font-light">{personalAdInfo.Plan}</div>
                </div>
              </div>
            </div>
          </div>
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
  );
};

export default Analytics;
