import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import { useCookies } from "react-cookie";
import Header from "../Components/Header";
import "../pagescss/slideanimation.css";

import {
  useJsApiLoader,
  GoogleMap,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { AiFillStar } from "react-icons/ai";
import { TiStarOutline } from "react-icons/ti";

import {
  IoChevronBackCircleSharp,
  IoChevronForwardCircleSharp,
  IoClose,
} from "react-icons/io5";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsExclamationCircle } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
import moment from "moment";
import VerticalHeader from "../Components/VerticalHeader";
const libraries = ["places"];

function AdScreen() {
  const [dataReceived, setDataReceived] = useState([]);
  const [imagesRecieved, setImagesRecieved] = useState([]);
  const [sliderValue, setSliderValue] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [currentDate, setCurrentDate] = useState();
  const [adID, setAdID] = useState();
  const [reviewerID, setReviewerID] = useState();
  const [adOwnerID, setAdOwnerID] = useState();
  const [expandImage, setExpandImage] = useState([false, null]);
  const [adOwnerName, setAdOwnerName] = useState();
  const [reviewerName, setReviewerName] = useState();
  const [uploading, setUploading] = useState(false);
  const [reportMenu, setReportMenu] = useState(false);
  const [userlocation, setUserLocation] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
 
  const isBlank = /^\s*$|^\s{2,}/;
  const { id } = useParams();
  const [cookies] = useCookies(["user"]);
  const crownImage = require("../assets/crown.png");
  const deleteImage = require("../assets/delete.png");
  const screenshotGeoLocationImage = require("../assets/screenshotGeoLocation.png");
  const section1 = useRef(null);

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyArko_oZi4l_KKDTNTybR3-tj24kH3taec",
    libraries,
  });

  const getRoute = async () => {
    // eslint-disable-next-line no-undef
    if (!userlocation || !google) return; // Ensure userlocation is available

    try {
      // Import the DirectionsService from the library

      // eslint-disable-next-line no-undef
      const { DirectionsService } = await google.maps.importLibrary("routes");

      // Create a new instance of DirectionsService
      const directionsService = new DirectionsService();

      // Define the route request
      const request = {
        origin: { lat: userlocation.latitude, lng: userlocation.longitude },
        destination: { lat: -1.3074432, lng: 36.896768 },
        travelMode: "DRIVING",
      };

      const results = await directionsService.route(request);

      // Handle the results
      setDirectionsResponse(results);
    } catch (error) {
      console.error("Error calculating route:", error);
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

  //handle sending review
  const handleSendReview = () => {
    if (!isBlank.test(reviewText)) {
      setUploading(true);
      setReviewText(""); //clear out the text input
      let rating;
      let numRated;
      let value = sliderValue;
      //set the slider  value to 5 in the event someone doesnt notice the slider
      if (sliderValue === 0) {
        value = 5;
      }
      let avgRating = value; //This is intialized to this if it is the first time being rated

      //update the database collection review
      axios
        .post(`http://localhost:3000/Review`, {
          AdID: adID,
          ReviewerID: reviewerID,
          ReviewerName: reviewerName,
          AdOwnerID: adOwnerID,
          AdOwnerName: adOwnerName,
          Review: reviewText,
          Rating: value,
          DateSent: currentDate,
        })
        .then(async () => {
          try {
            //we need to get the advert information first in the event two successive reviews were made
            const response = await axios.get(
              `http://localhost:3000/getAdData/${adID}`
            );
            rating = response.data.Rating + value;
            numRated = response.data.NumRated + 1;
            if (numRated !== 0) {
              avgRating = Math.round(rating / numRated); //get the new average rating
            }
          } catch (error) {
            console.error(error);
          }

          try {
            await axios.put(`http://localhost:3000/uploadAdData`, {
              Rating: rating,
              NumRated: numRated,
              AverageRating: avgRating,
              AdID: adID,
            });
          } catch (error) {
            console.error(error);
          }
          //refresh the UI with the new information
          start();
        })
        .catch((error) => {
          console.error(error);
        });
      setTimeout(() => {
        setUploading(false);
      }, 3000);
    }
  };

  const start = async () => {
    const adInfo = await axios.get(
      `http://localhost:3000/getAdData/${id}`
    );
    const data = adInfo.data;
    const currentTime = new Date();

    const dateCreated = new Date(data.DateCreated);
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
    setImagesRecieved(data.ImageUrl);
    setDataReceived({ ...data, Ago: ago });
    setCurrentDate(new Date()); //used in for indicating dates that a report or review is written
    setAdOwnerID(adInfo.data.UserID); //used in reports and reviews
    setAdOwnerName(adInfo.data.UserName); //used in reports and reviews
    setCoordinates(adInfo.data.Coordinates);

    setAdID(adInfo.data._id); //used in reports and reviews
    const loggedIn = await cookies.user;
    if (loggedIn) {
      const value = await cookies.user.UserID;
      setReviewerID(value); //used in reports and reviews
      const value2 = await cookies.user.UserName;
      setReviewerName(value2); //used in reports and reviews
      //get the reviews
    }

    axios
      .get(`http://localhost:3000/Review/${adInfo.data._id}`)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const scrollToDiv = (divTarget) => {
    if (divTarget.current) {
      divTarget.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const photoGallery = (direction, imgURl) => {
    for (var x = 0; x < imagesRecieved.length; x++) {
      if (imagesRecieved[x] === imgURl) {
        if (direction === "left" && x !== 0) {
          setExpandImage([true, imagesRecieved[x - 1]]);
        }
        if (direction === "right" && x !== imagesRecieved.length - 1) {
          setExpandImage([true, imagesRecieved[x + 1]]);
        }
      }
    }
  };
  const handleSendReport = () => {
    if (!isBlank.test(reportText)) {
      setUploading(true);
      setReportText(""); //clear text input data
      axios
        .post(`http://localhost:3000/Report`, {
          AdID: adID,
          ReporterID: reviewerID,
          ReporterName: reviewerName,
          AdOwnerID: adOwnerID,
          AdOwnerName: adOwnerName,
          Report: reportText,
          DateSent: currentDate,
        })
        .then(() => {
          setReportMenu(false);
        })
        .catch((error) => {
          console.error(error);
        });
      setTimeout(() => {
        setUploading(false);
      }, 3000);
    }
    setTimeout(() => {
      setUploading(false);
      document.body.style.overflow = "visible";
    }, 3000);
  };

  //delete review
  const handleDeleteReview = async (ID, ratings) => {
    setUploading(true); //activate activityIndicator
    //get the ad data again
    const adData = await axios.get(
      `http://localhost:3000/getAdData/${dataReceived._id}`
    );
    let dataReceive = adData.data;
    try {
      await axios.delete(`http://localhost:3000/deleteReview?id=${ID}`);
      //calculate the avg rating
      let avgRating = 0;
      let rating = dataReceive.Rating - ratings;
      if (dataReceive.NumRated > 1) {
        avgRating = Math.round(rating / (dataReceive.NumRated - 1));
      }

      try {
        await axios.put(`http://localhost:3000/uploadAdData`, {
          Rating: rating,
          NumRated: dataReceive.NumRated - 1,
          AverageRating: avgRating,
          AdID: adID,
        });
        start();
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => {
      setUploading(false);
    }, 3000); //remove loading
  };

  useEffect(() => {
    start();
    getUserLocation();
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

  useEffect(() => {
    if (userlocation !== undefined) {
      getRoute();
    }
  }, [userlocation]);

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "purple",
  };

  return (
    <div>

      <div className={largeScreen ? "flex relative" : "relative"}>
        {largeScreen ? (
          <div className="z-20">
            <VerticalHeader page="HomePage" />
          </div>
        ) : (
          <></>
        )}
        <div className="w-full">
          <div ref={section1}></div>
          {adID ? (
            <div className="mx-1 lg:ml-[200px]">
              <div>
                <div className="flex sm:w-5/6 my-3 justify-between">
                  <div className="flex">
                    <div className="ml-2 mr-5">
                      {dataReceived.ImageUrl ? (
                        <>
                          <div>
                            <img alt=""
                              src={dataReceived.ImageUrl[0]}
                              className="h-[50px] object-cover w-[50px] rounded-[25px] border"
                            />
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <div className="text-xs text-custom-purple  pr-1 font-semibold">
                          {dataReceived.Name}
                        </div>
                        <div>
                          <img
                            src={crownImage}
                            className="w-[15px] h-[15px]"
                            alt="crown"
                          />
                        </div>
                      </div>
                      <div className=" text-gray-500 text-xs">
                        {dataReceived.Location}
                      </div>
                      <div className="text-xs">@{dataReceived.UserName}</div>
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-row ">
                          <div className="text-xs">{dataReceived.Ago}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div
                      className="cursor-pointer"
                      onPointerOver={() => {
                        setReportBanner(true);
                      }}
                      onClick={() => {
                        scrollToDiv(section1);
                        reviewerID === "undefined"
                          ? setGetStartedMenu(true)
                          : setReportBanner(true);
                      }}
                    >
                      <BiDotsVerticalRounded size={20} />
                    </div>
                    {reportBanner ? (
                      <div
                        onPointerLeave={() => {
                          setReportBanner(false);
                        }}
                        onClick={() => {
                          setReportMenu(true);
                          scrollToDiv(section1);
                          document.body.style.overflow = "hidden";
                        }}
                        className="cursor-pointer right-2 top-2 absolute bg-white drop-shadow-xl shadow-xl w-28 py-1 px-1 border flex items-center justify-between"
                      >
                        <div className="text-xs text-gray-600">Report</div>
                        <BsExclamationCircle size={12} color="gray" />
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div className="text-gray-700 text-xs ml-[10px] lg:w-[60%]">
                  {dataReceived.Details}
                </div>

                {dataReceived.Link ? (
                  <div className="m-[10px]">
                    <div className="text-blue-700 underline text-xs">
                      <a href={dataReceived.Link}>Visit Website</a>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {dataReceived.Contact ? (
                  <div className="flex m-[10px]">
                    <div className="mr-2 text-xs text-gray-700">Contact:</div>
                    <div className="text-xs font-semibold text-gray-500">
                      {dataReceived.Contact}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {dataReceived.Pricing ? (
                  <div className="flex">
                    <div className="text-xs ml-3 text-green-600">
                      {dataReceived.Pricing} /-
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                {dataReceived.ImageUrl ? (
                  <div className="flex flex-row overflow-x-auto">
                    {dataReceived.ImageUrl.map((item, index) => {
                      return (
                        <img alt=""
                          key={index}
                          src={item}
                          onClick={() => {
                            setExpandImage([true, item]);
                            document.body.style.overflow = "hidden";
                            scrollToDiv(section1);
                          }}
                          className="m-3 object-cover  mb-10 slide-in-x  border shadow-md bg-white transform hover:scale-105 transition-transform duration-200 cursor-pointer h-[250px] w-[200px] rounded"
                        />
                      );
                    })}
                  </div>
                ) : (
                  <></>
                )}

                
                <div className="">
                  <div className=" flex flex-col items-center my-3 ">
                    <div className="mb-5 ">
                      <div className="font-semibold text-xl">Reviews</div>
                    </div>
                    <div>
                      <div className="font-bold text-4xl">
                        {dataReceived.AverageRating}
                      </div>
                    </div>
                    <div className="flex mt-2">
                      {Array.from({ length: dataReceived.AverageRating }).map(
                        (_, index) => (
                          <AiFillStar key={index} color="gold" size={23} />
                        )
                      )}
                      {Array.from({
                        length: 5 - dataReceived.AverageRating,
                      }).map((_, index) => (
                        <AiFillStar key={index} color="grey" size={23} />
                      ))}
                    </div>
                  </div>
                  <hr className="w-full h-[2px]" />

                  <div className="flex items-center justify-center flex-col">
                    <div className="relative w-1/2 sm:w-3/4 2xs:w-5/6 4xs:w-[95%] flex justify-center">
                      <textarea
                        style={{ backgroundColor: "#eeeeee" }}
                        placeholder="Add a Review"
                        onChange={(e) => {
                          setReviewText(e.target.value);
                        }}
                        value={reviewText}
                        className="sm:w-5/6 w-11/12 rounded my-2 p-5 focus:outline-none placeholder:text-xs text-xs pr-16"
                      />
                      <div
                        className=" inline-block absolute top-1/3 right-1/4"
                        onClick={() => {
                          scrollToDiv(section1);
                          reviewerID === "undefined"
                            ? setGetStartedMenu(true)
                            : handleSendReview();
                        }}
                      >
                        <div className="absolute font-medium text-slate-500 cursor-pointer">
                          SEND
                        </div>
                      </div>
                    </div>
                    <div className="w-2/5  4xs:w-[80%] flex flex-col mb-4 items-center ">
                      <div className="flex  mr-3 items-center">
                        <div className="mx-2">{sliderValue}</div>
                        {Array.from({ length: sliderValue }).map((_, index) => (
                          <AiFillStar
                            key={index}
                            color="gold"
                            size={28}
                            onClick={() => {
                              setSliderValue(index + 1);
                            }}
                          />
                        ))}
                        {Array.from({ length: 5 - sliderValue }).map(
                          (_, index) => (
                            <TiStarOutline
                              key={index}
                              color="grey"
                              size={28}
                              onClick={() => {
                                setSliderValue(sliderValue + index + 1);
                              }}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {reviews.length === 0 ? (
                    <div className="flex justify-center items-center h-32 4xs:h-20 2xs:h-24">
                      <div className="text-gray-700 font-semibold text-xl">
                        No Reviews yet
                      </div>
                    </div>
                  ) : (
                    <div className="flex ml-[5%] items-center h-20 ">
                      <div className="text-gray-700 text-sm">
                        Reviews and useful critics
                      </div>
                    </div>
                  )}

                  {reviews.map((item, index) => {
                    return (
                      <div key={index} className="ml-[5%]  mb-5">
                        <div className="flex  sm:w-3/5 4xs:w-11/12 justify-between">
                          <div className="flex">
                            <div className="text-gray-700 text-xs">
                              {item.Rating}
                            </div>
                            <div className="flex mr-3  items-center">
                              {Array.from({ length: item.Rating }).map(
                                (_, index) => (
                                  <AiFillStar
                                    key={index}
                                    color="gold"
                                    size={12}
                                  />
                                )
                              )}
                              {Array.from({ length: 5 - item.Rating }).map(
                                (_, index) => (
                                  <AiFillStar
                                    key={index}
                                    color="grey"
                                    size={12}
                                  />
                                )
                              )}
                            </div>
                            <div className="mr-20">
                              <div className="text-xs text-gray-600">
                                {item.ReviewerName}
                              </div>
                            </div>
                          </div>
                          <div className="flex  items-center ">
                            <div className="text-xs  text-gray-500 mr-2">
                              {moment(item.DateSent).format("DD/MM/YYYY")}
                            </div>
                          </div>
                        </div>
                        <div className="sm:w-2/3 4xs:w-11/12 flex break-all justify-between items-center">
                          <div className="text-xs text-gray-600  my-2">
                            {item.Review}
                          </div>
                          {item.ReviewerID === reviewerID ? (
                            <div>
                              <div
                                onClick={() => {
                                  handleDeleteReview(item._id, item.Rating);
                                  scrollToDiv(section1);
                                }}
                                className="w-[28px] h-[28px] bg-blue-100 flex cursor-pointer rounded-[14px] justify-center items-center "
                              >
                                <img alt=""
                                  src={deleteImage}
                                  className="w-[17px] h-[17px]"
                                />
                              </div>
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="mb-2 mt-4 text-xs  text-gray-400">
                          Hope this was helpful
                        </div>
                        <hr className="sm:w-2/3 w-10/12" />
                      </div>
                    );
                  })}
                </div>
              </div>
              {coordinates.Set ? (
                isLoaded && userlocation ? (
                  <div className="flex">
                    <div className="absolute  z-10 flex justify-center items-center w-full lg:left-16">
                      <div className="rounded bg-black drop-shadow-2xl py-1 px-14">
                        <div className="text-white font-medium flex text-center">
                          Route to Destination
                        </div>
                      </div>
                    </div>
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={{ lat: -1.3074432, lng: 36.896768 }}
                      zoom={10}
                      options={{
                        zoomControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                      }}
                    >
                      {directionsResponse && (
                        <DirectionsRenderer directions={directionsResponse} />
                      )}
                    </GoogleMap>
                  </div>
                ) : (
                  <div className="h-24 mb-16 lg:mb-0 flex justify-center items-center w-full bg-stone-100">
                    <div className="text-gray-600">
                      Turn on GeoLocation to see navigation to destination
                    </div>
                  </div>
                )
              ) : (
                <></>
              )}
            </div>
          ) : (
            <div className="ml-5 w-full lg:ml-48">
              <div
                className="shimmer-effect m-2 rounded"
                style={{ height: "16px", width: "100px" }}
              ></div>
              <div
                className="shimmer-effect m-2 rounded"
                style={{ height: "30px", width: "400px" }}
              ></div>
              <div
                className="shimmer-effect m-2 rounded"
                style={{ height: "30px", width: "400px" }}
              ></div>
              <div className="flex">
                <div
                  className="shimmer-effect mb-4 rounded"
                  style={{ height: "200px", width: "400px" }}
                ></div>
                <div
                  className="mx-5 shimmer-effect mb-4 rounded"
                  style={{ height: "200px", width: "400px" }}
                ></div>
                <div
                  className="mx-5 shimmer-effect mb-4 rounded"
                  style={{ height: "200px", width: "400px" }}
                ></div>
                <div
                  className="shimmer-effect mb-4 rounded"
                  style={{ height: "200px", width: "400px" }}
                ></div>
              </div>
            </div>
          )}
        </div>
        {largeScreen ? (
          <></>
        ) : (
          <div className="z-20 absolute">
            <Header page="HomePage" />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdScreen;
