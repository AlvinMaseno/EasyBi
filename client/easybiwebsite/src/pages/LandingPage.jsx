import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const binoculars = require("../assets/binoculars.png");
  const pin = require("../assets/pin.png");
  const customerReview = require("../assets/customer-review.png");
  const chatBubbles = require("../assets/chat-bubbles-with-ellipsis.png");
  const navigate = useNavigate();
  return (
    <div className="h-screen w-full">
      <div className="flex sm:px-10  3xs:pl-2 justify-between my-2 border-b pb-2 ">
        <div className="flex">
          <div className="text-custom-purple font-bold ml-1">Easy</div>{" "}
          <div className="font-bold">Bi</div>
        </div>
        <div className="flex">
          <div
            onClick={() => {
              navigate("/SignIn");
            }}
            className="mr-4 px-4 cursor-pointer text-sm justify-center items-center rounded-3xl   border-[1.5px] py-1"
          >
            <div className="4xs:text-xs 3xs:text-sm">Log In</div>
          </div>
          <div
            onClick={() => {
              navigate("/SignUp");
            }}
            className="sm:mr-4 mr-1 px-5 flex text-sm cursor-pointer  justify-center items-center rounded-3xl bg-black py-1"
          >
            <div className="text-white font-light 4xs:text-xs 3xs:text-sm">
              Get Started
            </div>
          </div>
        </div>
      </div>
      <div className="2xs:h-[23%] h-[20%]  items-center px-[10%] text-center flex-col flex justify-center">
        <div className="3xs:text-4xl 4xs:text-2xl  font-semibold">
          Welcome to EasyBi!
        </div>
        <div className="3xs:text-4xl 4xs:text-2xl font-semibold">
          Find Services and Places with ease.
        </div>
      </div>
      <div className=" 2xs:h-[5%] h-[4%] text-gray-700 px-[10%] text-center flex justify-center">
        Online marketing and service discovery
      </div>
      <div className=" 2xs:h-[8%] h-[4%] mt-8 items-center px-[10%] flex justify-center">
        <div
          onClick={() => {
            navigate("/Homepage");
          }}
          className="mr-4 px-7 py-[6px] flex cursor-pointer hover:scale-105 transition-transform duration-100  justify-center items-center rounded-3xl bg-custom-purple"
        >
          <div className="text-white font-light 4xs:text-xs 3xs:text-base">
            Continue
          </div>
        </div>
      </div>
      <div className="  h-[8%] items-center sm:mx-24 4xs:ml-2 flex font-bold">
        App Features
      </div>

      <div className="grid bottom-6 pb-4 sm:px-16 4xs:ml-2 gap-2 lg:grid-cols-4 grid-cols-2 my-4 w-full">
        <div className="relative">
          <div className="absolute 3xs:w-[195px] xs:w-[238px] xs:h-[248px] 4xs:w-[175px] 4xs:h-[175px] rounded-xl 3xs:h-[195px] border-2 border-black"></div>
          <div className="3xs:w-[200px] xs:w-[240px] xs:h-[250px] xs:p-5 3xs:h-[200px] 4xs:h-[180px] 4xs:w-[180px] p-3 rounded-xl bg-emerald-300  inset-0 transform transition-transform duration-300 hover:rotate-3 origin-bottom-left">
            <div className="flex items-center justify-between">
              <div className="font-bold">Search</div>
              <img alt="" src={binoculars} className="w-10 h-10" />
            </div>
            <div className="text-xs font-bold mt-2">Use Search Page</div>
            <hr className="border-black mt-6" />
            <div className="text-xs mt-1">
              Employ the search functionality to explore fresh services and
              locations.
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute xs:w-[238px] xs:h-[248px] 3xs:w-[195px] 4xs:w-[175px] 4xs:h-[175px] p-3 rounded-xl 3xs:h-[195px] border-2 border-black"></div>
          <div className="3xs:w-[200px] xs:w-[240px] xs:h-[250px] xs:p-5 3xs:h-[200px] 4xs:h-[180px] 4xs:w-[180px] p-3 rounded-xl bg-black text-white inset-0 transform transition-transform duration-300 hover:rotate-3 origin-bottom-left">
            <div className="flex items-center justify-between">
              <div className="font-bold  ">Review</div>
              <img alt="" src={customerReview} className="w-8 h-8" />
            </div>
            <div className="text-xs font-medium mt-2">
              View customer reviews
            </div>
            <hr className="border-white mt-6" />
            <div className="text-xs font-thin mt-1">
              Check out feedback from various customers of the business you're
              interested in.
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute xs:w-[238px] xs:h-[248px] 3xs:w-[195px] 4xs:w-[175px] 4xs:h-[175px] p-3 rounded-xl 3xs:h-[195px] border-2  border-black"></div>
          <div className="3xs:w-[200px] xs:w-[240px] xs:h-[250px] xs:p-5 3xs:h-[200px] 4xs:h-[180px] 4xs:w-[180px] p-3 rounded-xl bg-purple-300 inset-0 transform transition-transform duration-300 hover:rotate-3 origin-bottom-left">
            <div className="flex items-center justify-between">
              <div className="font-bold ">Messaging</div>
              <img alt="" src={chatBubbles} className="w-8 h-8" />
            </div>
            <div className="text-xs font-bold mt-2">
              Message clients or businesses
            </div>
            <hr className="border-black mt-6" />
            <div className="text-xs mt-1">
              Utilize the messaging feature to inquire about a business or
              communicate with your clients.
            </div>
          </div>
        </div>
        <div>
          <div className="absolute xs:w-[238px] xs:h-[248px] 3xs:w-[195px] 4xs:w-[175px] 4xs:h-[175px] p-3 rounded-xl 3xs:h-[195px] border-2  border-black"></div>
          <div className="3xs:w-[200px] xs:w-[240px] xs:h-[250px] xs:p-5 3xs:h-[200px] 4xs:h-[180px] 4xs:w-[180px] p-3 rounded-xl bg-yellow-100 inset-0 transform transition-transform duration-300 hover:rotate-3 origin-bottom-left">
            <div className="flex items-center justify-between">
              <div className="font-bold">Maps</div>
              <img alt="" src={pin} className="w-7 h-7" />
            </div>
            <div className="text-xs font-bold mt-2">Use Maps</div>
            <hr className="border-black mt-6" />
            <div className="text-xs mt-1">
              EasyBi provides the functionality to pinpoint a business's
              location on a map.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
