import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../pagescss/slideanimation.css";
import { useCookies } from "react-cookie";
import VerticalHeader from "../Components/VerticalHeader";
import { BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { FaChevronCircleDown } from "react-icons/fa";
import "../pagescss/slideanimation.css";
import { IoIosArrowBack } from "react-icons/io";
import Header from "../Components/Header";

function Messages() {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [messagesResults, setMessagesResults] = useState([]);
  const [numberSearchResults, setNumberSearchResults] = useState(5);
  const [noResults, setNoResults] = useState(false);
  const [adIDs, setAdIDs] = useState(["xxxx"]);
  const [activeFunction, setActiveFunction] = useState("getChat");
  const [numberMessages, setNumberMessages] = useState(5);
  const [userID, setUserID] = useState();
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [chatSelected, setChatSelected] = useState(false);
  const [messageInfo, setMessageInfo] = useState();
  const [message, setMessage] = useState("");
  const chatgif = require("../assets/chat.gif");
  const [chatID, setChatID] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [name, setName] = useState();
  const [largeScreen, setLargeScreen] = useState(false);
  const [number, setNumber] = useState(10);
  const [messagesReceived, setMessagesReceived] = useState([]);
  const navigate = useNavigate();
  const [userCookies] = useCookies(["user"]);

  const section1 = useRef(null);
  const section2 = useRef(null);

  const scrollToDiv = (divTarget) => {
    if (divTarget.current) {
      divTarget.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getMessages = async () => {
    setLoading(true);
  const value1 = userCookies.user?.UserID; // Using optional chaining to handle undefined
  if (value1 !== undefined && value1 !== "undefined") {
    setLoggedIn(true);
    console.log(value1);
    setUserID(value1); // used in retrieving ad data associated with the user
  } else {
    setLoggedIn(false);
    return;
  }

  let arrOfIDs = ["ThisIsntRealData"];
  const ID = userCookies.user?.UserID; // Using optional chaining
  setUserID(ID);
  
    try {
      const response = await axios.get(
        `http://localhost:3000/getPersonalAdData/${ID}`
      );
      if (response.data.length != 0) {
        arrOfIDs = response.data.map((item) => item._id);
        setAdIDs(arrOfIDs);
      }
    } catch (error) {
      console.error("Error retrieving getting PersonalAdData:", error);
      throw error;
    }
    try {
      // Fetch messages
      const responseMessages = await axios.get(
        `http://localhost:3000/getMessages/${ID}/${arrOfIDs}/${numberMessages}`
      );
      const data = responseMessages.data;

      if (data.length !== 0) {
        const dataWithUserInfo = [];
        for (const item of data) {
          if (item[0].InquirerID !== ID) {
            try {
              const results = await axios.get(
                `http://localhost:3000/getUser/${item[0].InquirerID}`
              );
              const resultsData = results.data;
              const itemWithUserInfo = { ...item, resultsData };
              dataWithUserInfo.push(itemWithUserInfo);
            } catch (error) {
              console.error("Error retrieving user information:", error);
              throw error;
            }
          } else {
            for (const index of item) {
              try {
                const results = await axios.get(
                  `http://localhost:3000/getAdData/${index.InquireeID}`
                );
                const resultsData = results.data;
                const itemWithUserInfo = { ...index, resultsData };
                dataWithUserInfo.push(itemWithUserInfo);
              } catch (error) {
                console.error("Error retrieving ad information:", error);
                throw error;
              }
            }
          }
        }
        setMessagesResults((prevData) => [...prevData, ...dataWithUserInfo]);
      }
    } catch (error) {
      console.error("Error retrieving messages", error);
      throw error;
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  };

  const handleRefreshMessageResults = async () => {
    const number = numberMessages + 5;
    setNumberMessages(number);
    try {
      // Fetch messages
      const responseMessages = await axios.get(
        `http://localhost:3000/getMessages/${userID}/${adIDs}/${number}`
      );
      const data = responseMessages.data;
      if (data.length !== 0) {
        const dataWithUserInfo = [];
        for (const item of data) {
          if (item[0].InquirerID !== userID) {
            try {
              const results = await axios.get(
                `http://localhost:3000/getUser/${item[0].InquirerID}`
              );
              const resultsData = results.data;
              const itemWithUserInfo = { ...item, resultsData };
              dataWithUserInfo.push(itemWithUserInfo);
            } catch (error) {
              console.error("Error retrieving user information:", error);
              throw error;
            }
          } else {
            for (const index of item) {
              try {
                const results = await axios.get(
                  `http://localhost:3000/getAdData/${index.InquireeID}`
                );
                const resultsData = results.data;
                const itemWithUserInfo = { ...index, resultsData };
                dataWithUserInfo.push(itemWithUserInfo);
              } catch (error) {
                console.error("Error retrieving ad information:", error);
                throw error;
              }
            }
          }
        }
        setMessagesResults(dataWithUserInfo);
      }
    } catch (error) {
      console.error("Error retrieving messages", error);
      throw error;
    }
  };

  const searchDb = async () => {
    setLoading(true);
    const isBlank = /^\s*$|^\s{2,}/;
    const numbers = numberSearchResults + 10;
    setNumberSearchResults(numbers);
    if (!isBlank.test(searchValue)) {
      try {
        // Show loading state here
        const response = await axios.get(
          `http://localhost:3000/search/${searchValue}/${numberSearchResults}`
        );
        if (response.data.length !== 0) {
          const filteredData = response.data.map((item) => {
            if (!adIDs.includes(item._id)) {
              return item;
            }
          });
          const filteredResults = filteredData.filter(
            (item) => item !== undefined
          );
          if (filteredResults.length === 0) {
            setNoResults(true);
          }
          if (searchValue !== "") {
            setSearchResults(filteredResults);
          }
        } else {
          setNoResults(true);
          setSearchResults([]);
        }
      } catch (error) {
        // Handle error gracefully (e.g., display error message)
        console.error("Error searching items:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }
    } else {
      setNoResults(false);
    }
  };

  const seeMore = () => {
    if (!searchValue) {
      handleRefreshMessageResults();
    } else {
      searchDb();
    }
  };

  const getChat = async (item) => {
    setChatSelected(true);
    setActiveFunction("getChat");
    try {
      let chatResponse;
      let adDataResponse;
      let userResponse;
      if (item.resultsData.KeyWords) {
        chatResponse = await axios.get(
          `http://localhost:3000/getChat/${item.resultsData._id}/${userID}/10}`
        );
        adDataResponse = item.resultsData;
      } else {
        userResponse = await axios.get(
          `http://localhost:3000/getUser/${item[0].InquirerID}`
        );
        chatResponse = await axios.get(
          `http://localhost:3000/getChat/${item[0].InquireeID}/${item[0].InquirerID}/10}`
        );
      }

      if (userResponse && userResponse.data) {
        setName(userResponse.data.UserName);
        setImageUrl(userResponse.data.UserImageUrl);
      }
      if (adDataResponse) {
        setName(adDataResponse.Name);
        setImageUrl(adDataResponse.ImageUrl[0]);
      }
      if (chatResponse.data) {
        setChatID(chatResponse.data._id);
        setMessagesReceived(chatResponse.data.Messages);
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  };

  useEffect(() => {
    if (activeFunction === "getChat") {
      scrollToDiv(section1);
    }
  }, [activeFunction, section1]);

  const refreshChat = async (item) => {
    setChatSelected(true);
    setActiveFunction("refreshChat");
    try {
      let chatResponse;
      let adDataResponse;
      let userResponse;
      if (item.resultsData.KeyWords) {
        chatResponse = await axios.get(
          `http://localhost:3000/getChat/${
            item.resultsData._id
          }/${userID}/${number + 10}`
        );
        adDataResponse = item.resultsData;
      } else {
        userResponse = await axios.get(
          `http://localhost:3000/getUser/${item[0].InquirerID}`
        );
        chatResponse = await axios.get(
          `http://localhost:3000/getChat/${item[0].InquireeID}/${
            item[0].InquirerID
          }/${number + 10}`
        );
      }

      if (userResponse && userResponse.data) {
        setName(userResponse.data.UserName);
        setImageUrl(userResponse.data.UserImageUrl);
      }
      if (adDataResponse) {
        setName(adDataResponse.Name);
        setImageUrl(adDataResponse.ImageUrl[0]);
      }
      if (chatResponse.data) {
        setChatID(chatResponse.data._id);
        setMessagesReceived(chatResponse.data.Messages);
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
    setNumber(number + 10);
  };

  useEffect(() => {
    if (activeFunction === "refreshChat") {
      scrollToDiv(section2);
    }
  }, [activeFunction, section2]);




  useEffect(() => {
    getMessages();
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
    <div className="flex w-full ">
      {largeScreen ? (
        <div className="z-20">
          <VerticalHeader page="Messages" />
        </div>
      ) : (
        <></>
      )}
      {!loggedIn ? (
        <div className="h-screen flex items-center w-full lg:ml-44">
          <div className="h-[50%] ml-[10%]">
            <div>
              <div className="text-4xl font-semibold">NOT LOGGED IN</div>
            </div>
            <div className="h-1/3 flex flex-col-reverse mb-5 text-gray-500">
              <div>You are not yet logged in to message advertisers</div>
            </div>
            <div className="items-center flex">
              <button
                onClick={() => {
                  navigate("/SignUp");
                }}
                className="bg-fuchsia-800 rounded py-[6px] px-8 hover:scale-x-105 transition-transform duration-400"
              >
                <div className="text-white">GET STARTED</div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex lg:ml-[200px] w-full">
          {largeScreen || !chatSelected ? (
            messagesResults || searchResults ? (
              <div
                className="lg:w-5/6 w-full 4xs:mb-24 lg:mb-0 relative overflow-y-scroll overflow-x-hidden h-full"
                style={{ maxHeight: "100vh" }}
              >
                <div className="w-full flex justify-center items-center my-2">
                  <label className="border text-xs  rounded-3xl pb-2 px-4 w-11/12 sm:w-4/5 md:w-3/4 lg:1/2  justify-between pt-2 flex flex-row">
                    <input
                      type="text"
                      className=" placeholder:text-xs pl-5 focus:outline-none"
                      placeholder="Search for Advert"
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                        setNoResults(false);
                      }}
                    />
                    <BsSearch className="cursor-pointer" onClick={searchDb} />
                  </label>
                </div>
                {loading ? ( // Render shimmering effect when loading is true
                  Array.from({ length: 12 }).map((_, index) => (
                    <div
                      className={`my-4 pb-2 border-b bg-white transform w-full cursor-pointer`}
                      key={index}
                    >
                      <div className="flex flex-row ">
                        <div
                          key={index}
                          className="shimmer-effect ml-2"
                          style={{
                            height: "30px",
                            width: "30px",
                            borderRadius: "15px",
                          }}
                        ></div>
                        <div
                          className="shimmer-effect m-2 rounded"
                          style={{ height: "16px", width: "100px" }}
                        ></div>
                      </div>

                      <div
                        className="shimmer-effect m-2 rounded"
                        style={{
                          height: "16px",
                          width: "200px",
                          marginBottom: "2px",
                        }}
                      ></div>
                    </div>
                  ))
                ) : (
                  <></>
                )}
                {noResults ? (
                  <div className="w-full flex justify-center items-center">
                    <div className="text-gray-400 text-sm text-light">
                      No search Results
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {searchResults ? (
                  <div className="grid grid-cols-1">
                    {searchResults.map((item) => (
                      <div
                        onClick={() => {
                          setMessagesReceived([]);
                          setMessage("");
                          setNumber(10);
                          setMessageInfo({ resultsData: item });
                          getChat({ resultsData: item });
                        }}
                        key={item._id}
                        className="py-3 slide-in-y pl-3 border-b rounded bg-white cursor-pointer flex"
                      >
                        <img
                          alt=""
                          src={item.ImageUrl[0]}
                          className="h-[40px] object-cover font-semibold w-[40px] rounded-[20px]"
                        />
                        <div className="m-[5px]">
                          <div className="text-xs text-fuchsia-800 ">
                            {item.Name}
                          </div>
                          <div className="text-xs">{item.Location}</div>
                          <div className="font-semilight text-gray-500 text-xs">
                            @{item.UserName}
                          </div>
                          <div className="flex flex-row">
                            <div></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <></>
                )}
                {messagesResults ? (
                  <div className="grid grid-cols-1">
                    {messagesResults.map((item) => (
                      <div
                        onClick={() => {
                          setMessagesReceived([]);
                          setMessage("");
                          setMessageInfo(item);
                          getChat(item);
                        }}
                        key={item.resultsData._id}
                        className="bg-white slide-in-y py-3 pl-3 border-b cursor-pointer flex"
                      >
                        <img
                          alt=""
                          src={
                            item.resultsData.ImageUrl
                              ? item.resultsData.ImageUrl[0]
                              : item.resultsData.UserImageUrl
                          }
                          className="object-cover h-[40px] w-[40px] rounded-[20px]"
                        />

                        <div className="m-[5px]">
                          <div className="text-xs text-fuchsia-800 ">
                            {item.resultsData.Name}
                          </div>
                          <div className="text-xs">
                            {item.resultsData.Location}
                          </div>
                          <div className="font-semilight text-gray-500 text-xs">
                            @{item.resultsData.UserName}
                          </div>
                          <div className="flex flex-row">
                            <div></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <></>
                )}
                <button
                  className="z-20 slide-in-y shadow-2xl shadow-black bg-white border-2 fixed lg:bottom-4 bottom-20  left-[85%] lg:left-[48%] shadow-3xl h-[48px] flex justify-center items-center w-[48px] rounded-[24px] "
                  onClick={seeMore}
                >
                  <FaChevronCircleDown size={40} />
                </button>
              </div>
            ) : (
              <>
                <div className="w-full h-screen flex flex-col items-center justify-center ">
                  <div>
                    <img alt="" src={chatgif} className="w-40 h-40" />
                  </div>
                  <div className="mt-4">
                    <div>Your messages</div>
                  </div>
                  <div className="mt-2 text-gray-700 text-sm">
                    <div>Send messages to business or clients here</div>
                  </div>
                </div>
              </>
            )
          ) : (
            <></>
          )}

          
        </div>
      )}
      {largeScreen ? (
        <></>
      ) : (
        <div className=" z-20 absolute">
          <Header page="Messages" />
        </div>
      )}
    </div>
  );
}

export default Messages;
