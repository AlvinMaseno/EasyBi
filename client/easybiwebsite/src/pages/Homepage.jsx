import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiFillStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import "../pagescss/slideanimation.css";
import VerticalHeader from "../Components/VerticalHeader";
import Header from "../Components/Header";

function Homepage() {
  const [data, setData] = useState([]);
  const numbers = 20; //stores the number of records to be retrieved
  const navigate = useNavigate();
  const crownImage = require("../assets/crown.png");
  const [largeScreen, setLargeScreen] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state

  const fetchData = async () => {
    setLoading(true); // Set loading state to true when fetching data

    axios
      .get(`http://localhost:3000/HomeScreen/${numbers}`)
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

        setData(newData);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
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
    <div className={largeScreen ? "flex relative" : "relative"}>
      {largeScreen ? (
        <div className="z-20">
          <VerticalHeader page="HomePage" />
        </div>
      ) : (
        <></>
      )}
      <div className="w-full grid mb-20 mt-2 2xs:grid-cols-2 xs:grid-cols-2 lg:ml-48 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0.5">
        {loading // Render shimmering effect when loading is true
          ? Array.from({ length: 10 }).map((_, index) => (
              <div
              className={`mx-4 my-2 shadow-md border-[1.2px] rounded bg-white transform hover:scale-105 transition-transform duration-100 cursor-pointer slide-in-y`}
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
          : data.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/AdScreen/${item._id}`)}
                className={`mx-4 my-2 shadow-md rounded bg-white transform hover:scale-105 transition-transform duration-100 cursor-pointer slide-in-y`}
              >
                <img
                  src={item.ImageUrl[0]}
                  alt={item.Name}
                  className="h-[185px] object-cover w-full rounded-t"
                />
                <div className="m-[5px]">
                  <div className="flex items-center">
                    <div className="text-xs line-clamp-1 font-semibold text-fuchsia-800 pr-1">
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
                  <div className=" line-clamp-1 text-gray-500 text-xs">
                    {item.Location}
                  </div>
                  <div className=" line-clamp-1 text-xs">@{item.UserName}</div>
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
                      <div className="text-xs pl-1">
                        {item.AverageRating != 0
                          ? item.AverageRating
                          : "Not Rated"}
                      </div>
                    </div>
                    <div className="bg-fuchsia-200 px-1 rounded mb-1">
                      <div className="text-xs font text-purple-600">
                        {item.Ago}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
      </div>
      {largeScreen ? (
        <></>
      ) : (
        <div className="z-20 absolute">
          <Header page="HomePage" />
        </div>
      )}
    </div>
  );
}

export default Homepage;
