import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import VerticalHeader from "../Components/VerticalHeader";
import { BsSearch } from "react-icons/bs";
import axios from "axios";
import { AiFillStar } from "react-icons/ai";
import "../pagescss/slideanimation.css";
import { useCookies } from "react-cookie";
import Header from "../Components/Header";

function SearchPage() {
  const section1 = useRef(null);
  const [searchValue, setSearchValue] = useState();
  const [responseData, setResponseData] = useState([]);
  const [geoPermissionRejected, setGeoPermissionRejected] = useState(false);

  const [userCookies] = useCookies(["user"]);
  const [userlocation, setUserLocation] = useState(null);
  const number = 10;
  const [loading, setLoading] = useState(false); // Added loading state
  const [resultsStatus, setResultsStatus] = useState(0);
  const [largeScreen, setLargeScreen] = useState(false);
  const [page, setPage] = useState(1);
  const crownImage = require("../assets/crown.png");
  const searchPng = require("../assets/search.png");

  const navigate = useNavigate();

  const scrollToDiv = (divTarget) => {
    if (divTarget.current) {
      divTarget.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getUserLocation = () => {
    // if geolocation is supported by the users browser
    if (navigator.geolocation) {
      // get the current users location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // save the geolocation coordinates in two variables
          const { latitude, longitude } = position.coords;
          // update the value of userlocation variable
          setUserLocation({ latitude, longitude });
        },
        // if there was an error getting the users location
        (error) => {
          const randomValue = Math.round(Math.random() * 8);
          if (randomValue === 0) {
            console.error("Error getting user location:", error.code);
            scrollToDiv(section1);
            document.body.style.overflow = "hidden";
            setGeoPermissionRejected(true);
          }
        }
      );
    }
    // if geolocation is not supported by the users browser
    else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const searchDb = async () => {
    setLoading(true);
    const userID = userCookies.user?.UserID; // Using optional chaining to handle undefined
    const userName = userCookies.user?.UserName; // Using optional chaining to handle undefined

    const page = 1;
    setPage(page);

    const date = new Date();
    let params;

    if (userlocation !== null) {
      params = {
        SearchValue: searchValue,
        number: number,
        UserID: userID,
        UserName: userName,
        DateTime: date,
        Coordinates: userlocation,
      };
    } else {
      params = {
        SearchValue: searchValue,
        number: number,
        UserID: userID,
        UserName: userName,
        DateTime: date,
      };
    }

    await axios
      .post(`http://localhost:3000/searchv2`, params)
      .then((response) => {
        const data = response.data;
        if (data.length === 0) {
          setResultsStatus(2);
          return;
        } else {
          setResultsStatus(3);
        }
        const currentTime = new Date();
        const newData = data.map((item) => {
          const dateCreated = new Date(item.DateCreated);
          const timeDiff = currentTime.getTime() - dateCreated.getTime();
          const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60)); // Calculate the difference in hours

          let ago;
          if (hoursDiff === 0) {
            ago = "just now";
          } else if (hoursDiff === 24) {
            ago = "1 day ago";
          } else if (hoursDiff < 24) {
            ago = `${hoursDiff} hours ago`;
          } else {
            ago = dateCreated.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }

          return { ...item, Ago: ago };
        });
        setResultsStatus(1);
        setResponseData(newData);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const searchDbTabs = async (value) => {
    setLoading(true);
    const userID = userCookies.user?.UserID; // Using optional chaining to handle undefined
    const userName = userCookies.user?.UserName; // Using optional chaining to handle undefined

    const page = 1;
    setPage(page);

    const date = new Date();
    let params;

    if (userlocation !== null) {
      params = {
        SearchValue: value,
        number: number,
        UserID: userID,
        UserName: userName,
        DateTime: date,
        Coordinates: userlocation,
      };
    } else {
      params = {
        SearchValue: value,
        number: number,
        UserID: userID,
        UserName: userName,
        DateTime: date,
      };
    }
    await axios
      .post(`http://localhost:3000/searchv2`, params)
      .then((response) => {
        const data = response.data;
        setResultsStatus(0);
        const currentTime = new Date();
        const newData = data.map((item) => {
          const dateCreated = new Date(item.DateCreated);
          const timeDiff = currentTime.getTime() - dateCreated.getTime();
          const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60)); // Calculate the difference in hours

          let ago;
          if (hoursDiff === 0) {
            ago = "just now";
          } else if (hoursDiff === 24) {
            ago = "1 day ago";
          } else if (hoursDiff < 24) {
            ago = `${hoursDiff} hours ago`;
          } else {
            ago = dateCreated.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }

          return { ...item, Ago: ago };
        });

        setResponseData(newData);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleNextPage = async () => {
    setLoading(true);
    const userID = userCookies.user?.UserID; // Using optional chaining to handle undefined
    const userName = userCookies.user?.UserName; // Using optional chaining to handle undefined

    let pages = page + 1;

    const date = new Date();
    let params;

    if (userlocation !== null) {
      params = {
        SearchValue: searchValue,
        number: number,
        UserID: userID,
        UserName: userName,
        Page: page,
        DateTime: date,
        Coordinates: userlocation,
      };
    } else {
      params = {
        SearchValue: searchValue,
        number: number,
        UserID: userID,
        UserName: userName,
        Page: page,
        DateTime: date,
      };
    }
    await axios
      .post(`http://localhost:3000/searchPage`, params)
      .then((response) => {
        const data = response.data;
        if (data.length === 0) {
          setResultsStatus(3);
          return;
        } else {
          setResultsStatus(0);
        }
        const currentTime = new Date();
        const newData = data.map((item) => {
          const dateCreated = new Date(item.DateCreated);
          const timeDiff = currentTime.getTime() - dateCreated.getTime();
          const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60)); // Calculate the difference in hours

          let ago;
          if (hoursDiff === 0) {
            ago = "just now";
          } else if (hoursDiff === 24) {
            ago = "1 day ago";
          } else if (hoursDiff < 24) {
            ago = `${hoursDiff} hours ago`;
          } else {
            ago = dateCreated.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }

          return { ...item, Ago: ago };
        });

        setResponseData(newData);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
    setPage(pages);
  };

  const handlePrevPage = async () => {
    const userID = userCookies.user?.UserID; // Using optional chaining to handle undefined
    const userName = userCookies.user?.UserName; // Using optional chaining to handle undefined
    const pages = page - 1;
    if (pages === 0) {
      return;
    } else {
      setResultsStatus(0);
    }
    setLoading(true);
    const date = new Date();
    let params;

    if (userlocation !== null) {
      params = {
        SearchValue: searchValue,
        number: number,
        UserID: userID,
        UserName: userName,
        Page: page - 2,
        DateTime: date,
        Coordinates: userlocation,
      };
    } else {
      params = {
        SearchValue: searchValue,
        number: number,
        UserID: userID,
        UserName: userName,
        Page: page - 2,
        DateTime: date,
      };
    }
    setPage(pages);
    await axios
      .post(`http://localhost:3000/searchPage`, params)
      .then((response) => {
        const data = response.data;

        const currentTime = new Date();
        const newData = data.map((item) => {
          const dateCreated = new Date(item.DateCreated);
          const timeDiff = currentTime.getTime() - dateCreated.getTime();
          const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60)); // Calculate the difference in hours

          let ago;
          if (hoursDiff === 0) {
            ago = "just now";
          } else if (hoursDiff === 24) {
            ago = "1 day ago";
          } else if (hoursDiff < 24) {
            ago = `${hoursDiff} hours ago`;
          } else {
            ago = dateCreated.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }

          return { ...item, Ago: ago };
        });

        setResponseData(newData);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
    setPage(pages);
  };

  useEffect(() => {
    const handleResize = () => {
      setLargeScreen(window.innerWidth >= 1000);
    };
    getUserLocation();
    scrollToDiv(section1);
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
          <VerticalHeader page="SearchPage" />
        </div>
      ) : (
        <></>
      )}
      <div className="lg:ml-[200px] w-full flex flex-col ">
        <div ref={section1}></div>

        <div className="w-full flex justify-center mt-2 ">
          <label className="border-[1.4px] border-slate-800 text-xs cursor-pointer  rounded-3xl py-3 px-4 w-11/12 sm:w-4/5 md:w-1/2 lg:1/2  justify-between flex flex-row">
            <input
              type="text"
              value={searchValue}
              className=" placeholder:text-xs font-semibold pl-5 focus:outline-none"
              placeholder="Search for Advert"
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchDb();
                }
              }}
            />
            <BsSearch
              onClick={searchDb}
              className="hover:scale-110 "
              size={17}
            />
          </label>
        </div>
        <div className="flex justify-center w-full items-center my-4 lg:my-8">
          <div className=" lg:text-2xl font-thin text-violet-900 text-center">
            Search for any business by category or name
          </div>
        </div>
        <div>
          <div className="grid lg:grid-cols-6 grid-rows-2 md:grid-cols-4 sm:grid-cols-3 xs:grid-cols-3 2xs:grid-cols-3 4xs:grid-cols-3 gap-2 sm:mx-[10%] mx-[2%] my-[2%] slide-in-y">
            <div
              onClick={() => {
                setSearchValue("Hotel");
                searchDbTabs("Hotel");
              }}
              className="rounded-full cursor-pointer px-2 lg:lg:py-2 py-2 transform hover:scale-105 transition-transform duration-200  bg-yellow-300 flex justify-center items-center"
            >
              <div className="text-xs line-clamp-1  text-white">Hotels</div>
            </div>
            <div
              onClick={() => {
                setSearchValue("Restaurants");
                searchDbTabs("Restaurants");
              }}
              className="rounded-full lg:py-2 cursor-pointer px-2 transform hover:scale-105 transition-transform duration-200 bg-red-500 flex justify-center items-center"
            >
              <div className="text-xs line-clamp-1 text-white">Restaurants</div>
            </div>
            <div
              onClick={() => {
                setSearchValue("School");
                searchDbTabs("School");
              }}
              className="rounded-full lg:py-2 cursor-pointer  px-2  transform hover:scale-105 transition-transform duration-200 bg-blue-500 flex justify-center items-center"
            >
              <div className="text-xs line-clamp-1 text-white">Schools</div>
            </div>
            <div
              onClick={() => {
                setSearchValue("Banks");
                searchDbTabs("Banks");
              }}
              className="rounded-full cursor-pointer  px-2 lg:py-2transform hover:scale-105 transition-transform duration-200 bg-fuchsia-700 flex justify-center items-center"
            >
              <div className="text-xs line-clamp-1 text-white">Banks</div>
            </div>
            <div
              onClick={() => {
                setSearchValue("Spa and Wellness");
                searchDbTabs("Spa and Wellness");
              }}
              className="rounded-full cursor-pointer  px-2 bg-teal-400 lg:py-2 transform hover:scale-105 transition-transform duration-200 flex justify-center items-center"
            >
              <div className="text-xs line-clamp-1 text-white">
                Spa and Wellness
              </div>
            </div>
            <div
              onClick={() => {
                setSearchValue("Car wash");
                searchDbTabs("Car wash");
              }}
              className="rounded-full cursor-pointer  px-2 lg:py-2 transform hover:scale-105 transition-transform duration-200 bg-green-400 flex justify-center items-center"
            >
              <div className="text-xs line-clamp-1 text-white">
                Car wash and services
              </div>
            </div>
            {largeScreen ? (
              <>
                <div
                  onClick={() => {
                    setSearchValue("Travel");
                    searchDbTabs("Travel");
                  }}
                  className="rounded-full cursor-pointer  px-2 lg:py-2 transform hover:scale-105 transition-transform duration-200 bg-gray-400 flex justify-center items-center"
                >
                  <div className="text-xs line-clamp-1 text-white">Travel</div>
                </div>
                <div
                  onClick={() => {
                    setSearchValue("Fitness centers");
                    searchDbTabs("Fitness centers");
                  }}
                  className="rounded-full cursor-pointer  px-2 lg:py-2 transform hover:scale-105 transition-transform duration-200 bg-cyan-400 flex justify-center items-center"
                >
                  <div className="text-xs line-clamp-1 text-white">
                    Fitness centers
                  </div>
                </div>
                <div
                  onClick={() => {
                    setSearchValue("Plumbing");
                    searchDbTabs("Plumbing");
                  }}
                  className="rounded-full cursor-pointer  px-2 lg:py-2 transform hover:scale-105 transition-transform duration-200 bg-pink-400 flex justify-center items-center"
                >
                  <div className="text-xs line-clamp-1 text-white">
                    Plumbing
                  </div>
                </div>
                <div
                  onClick={() => {
                    setSearchValue("Electrical services");
                    searchDbTabs("Electrical services");
                  }}
                  className="rounded-full cursor-pointer  px-2 bg-amber-400 lg:py-2 transform hover:scale-105 transition-transform duration-200 flex justify-center items-center"
                >
                  <div className="text-xs line-clamp-1 text-white">
                    Electrical services
                  </div>
                </div>
                <div
                  onClick={() => {
                    setSearchValue("Car rental");
                    searchDbTabs("Car rental");
                  }}
                  className="rounded-full cursor-pointer  px-2 lg:py-2 transform hover:scale-105 transition-transform duration-200 flex bg-indigo-400 justify-center items-center"
                >
                  <div className="text-xs line-clamp-1 text-white">
                    Car rental
                  </div>
                </div>
                <div
                  onClick={() => {
                    setSearchValue("Laundry");
                    searchDbTabs("Laundry");
                  }}
                  className="rounded-full cursor-pointer  px-2 bg-fuchsia-400 lg:py-2 py-2 transform hover:scale-105 transition-transform duration-200 flex justify-center items-center"
                >
                  <div className="text-xs line-clamp-1 text-white">Laundry</div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        {loading ? ( // Render shimmering effect when loading is true
          Array.from({ length: 10 }).map((_, index) => (
            <div
              className={`m-4 border-[1.2px] shadow-md rounded bg-white transform hover:scale-105 w-[240px] transition-transform duration-100 cursor-pointer slide-in-y`}
            >
              <div
                key={index}
                className="shimmer-effect mb-4"
                style={{ height: "180px" }}
              ></div>
              <div
                className="shimmer-effect m-2 rounded"
                style={{ height: "16px" }}
              ></div>
              <div
                className="shimmer-effect m-2 rounded"
                style={{ height: "16px", width: "100px" }}
              ></div>
            </div>
          ))
        ) : resultsStatus === 2 ? (
          <div className="w-full my-4 flex flex-col items-center justify-center">
            <div className="my-1">
              <img alt="" src={searchPng} className="w-36 h-36" />
            </div>
            <div className="mb-1 mt-8 text-sm text-gray-700">No results</div>
            <div className="my-1 text-xs text-gray-500">
              Try another similar phrase
            </div>
          </div>
        ) : resultsStatus === 3 ? (
          <div className="w-full my-4 flex flex-col items-center justify-center">
            <div className="my-1">
              <img alt="" src={searchPng} className="w-36 h-36" />
            </div>
            <div className="mb-1 mt-8 text-sm text-gray-700">
              No more results
            </div>
            <div className="my-1 text-xs text-gray-500">
              This is all that we have, try another similar phrase
            </div>
          </div>
        ) : (
          <div className="grid 4xs:grid-cols-1 2xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {responseData.map((item, index) => (
              <div
                key={item._id}
                onClick={() => navigate(`/AdScreen/${item._id}`)}
                className={`m-4 border-[1.2px] shadow-md rounded bg-white transform hover:scale-105 transition-transform duration-200 cursor-pointer slide-in-y`}
              >
                <img
                  alt=""
                  src={item.ImageUrl[0]}
                  className="h-[185px] object-cover w-full rounded-t"
                />
                <div className="m-[5px]">
                  <div className="flex items-center">
                    <div className="font-bold text-xs line-clamp-1 text-fuchsia-800 pr-1">
                      {item.Name}
                    </div>
                    <div>
                      <img
                        src={crownImage}
                        className="w-[15px] h-[15px]"
                        alt="crown"
                      />
                    </div>
                  </div>
                  <div className="font-semibold line-clamp-1 text-gray-500 text-xs">
                    {item.Location}
                  </div>
                  <div className="font-semibold line-clamp-1 text-xs">
                    @{item.UserName}
                  </div>
                  <hr className="my-1" />
                  <div className=" line-clamp-2 mt-2 mb-3">
                    <div className="text-xs text-gray-700  break-before-all">
                      {item.Details}
                    </div>
                  </div>
                  <div className="flex flex-row w-full justify-between">
                    <div className="flex flex-row ">
                      <div className="flex flex-row">
                        {Array.from({ length: item.AverageRating }).map(
                          (_, index) => (
                            <AiFillStar key={index} color="gold" size={17} />
                          )
                        )}
                        {Array.from({ length: 5 - item.AverageRating }).map(
                          (_, index) => (
                            <AiFillStar key={index} color="grey" size={17} />
                          )
                        )}{" "}
                      </div>
                      <div className="font-semibold text-xs pl-1">
                        {item.AverageRating != 0
                          ? item.AverageRating
                          : "Not Rated"}
                      </div>
                    </div>
                    <div className="bg-fuchsia-200 px-1 rounded mb-1">
                      <div className="text-xs text-purple-600">{item.Ago}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="w-full flex items-center justify-center">
          <div className="flex md:w-1/3 w-10/12 mb-24 my-5  justify-between">
            {responseData.length ? (
              <div
                onClick={() => {
                  scrollToDiv(section1);
                  handlePrevPage();
                }}
                className="border-2 cursor-pointer py-1 rounded w-32 flex justify-center items-center"
              >
                <div className="text-gray-500 text-sm">Previous</div>
              </div>
            ) : (
              <></>
            )}

            <div>
              {responseData.length > 9 ? (
                <div
                  onClick={() => {
                    scrollToDiv(section1);
                    handleNextPage();
                  }}
                  className="bg-fuchsia-800 cursor-pointer w-32 py-1 rounded  flex items-center justify-center"
                >
                  <div className="text-white text-sm">Next</div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
      {largeScreen ? (
        <></>
      ) : (
        <div className="absolute z-40">
          <Header page="SearchPage" />
        </div>
      )}
    </div>
  );
}

export default SearchPage;
