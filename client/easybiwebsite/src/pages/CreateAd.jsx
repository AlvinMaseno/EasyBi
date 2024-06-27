import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { AiFillDelete } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import ClipLoader from "react-spinners/ClipLoader";
import "../pagescss/slideanimation.css";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import VerticalHeader from "../Components/VerticalHeader";
import Header from "../Components/Header";

const CreateAd = () => {
  const [userCookies] = useCookies(["user"]);
  const [personalAdInfoCookies, setPersonalAdInfoCookies] = useCookies([
    "personalAdInfo",
  ]);
  const [pinCoords, setPinCoords] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [originalName, setOriginalName] = useState();
  const [keyWords, setKeyWords] = useState("");
  const [location, setLocation] = useState("");
  const [pricing, setPricing] = useState(0);
  const [contacts, setContacts] = useState("");
  const [details, setDetails] = useState("");
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState([]);
  const [images, setImages] = useState([]);
  const [imageReceived, setImageReceived] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [nameInUse, setNameInUse] = useState(false);
  const coordinateR = {
    coordinates: { longitude: "not set", latitude: "not set" },
    Set: false,
    Moved: false,
  };
  const [coordinateData, setCoordinateData] = useState();
  const [largeScreen, setLargeScreen] = useState(false);
  const [paid, setPaid] = useState(true);
  const [userName, setUserName] = useState("");
  const [userID, setUserID] = useState("");
  const [dataReceived, setDataReceived] = useState([]);
  const [rating, setRating] = useState(0);
  const [numRated, setNumRated] = useState(0);
  const [adID, setAdID] = useState();
  const [plan, setPlan] = useState();
  const [clearData, setClearData] = useState(false);
  const [expiryDate, setExpiryDate] = useState();
  const [boostMenu, setBoostMenu] = useState(false);
  const [boostLoading, setBoostLoading] = useState(false);
  const [boostData, setBoostData] = useState();
  const [imagesDeleted, setImagesDeleted] = useState([]);
  const [averageRating, setAverageRating] = useState();
  const [dateCreated, setDateCreated] = useState();
  const [pricingPlacer, setPricingPlacer] = useState("");
  const [invalidPricing, setInvalidPricing] = useState(false);
  const [deleteBanner, setDeleteBanner] = useState(false);
  const [deleteAdMenu, setDeleteAdMenu] = useState(false);
  const [userlocation, setUserLocation] = useState();
  const [mapScreen, setMapScreen] = useState(false);
  const [geoPermissionRejected, setGeoPermissionRejected] = useState(false);
  const [tab, setTab] = useState("Create Advert");
  const [adInExistanceUrl, setAdInExistanceUrl] = useState("");
  const graph = require("../assets/graph.png");
  const startup = require("../assets/startup.png");
  const tickImage = require("../assets/tick.png");
  const screenshotGeoLocationImage = require("../assets/screenshotGeoLocation.png");

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "purple",
  };

  const containerStyle = {
    width: "80%",
    height: "350px",
  };

  const navigate = useNavigate();

  const section1 = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyArko_oZi4l_KKDTNTybR3-tj24kH3taec",
    libraries: ["places"],
  });

  const scrollToDiv = (divTarget) => {
    if (divTarget.current) {
      divTarget.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getAdData = async () => {
    //set useContext coordinate to coordinateR as default
    setCoordinateData(coordinateR);

    try {
      const value = await userCookies.user.UserID;
      setUserID(value); //used in retrieving ad data associated with the user
      if (value) {
        setLoggedIn(true);
      }
      const value2 = await userCookies.user.UserName;
      setUserName(value2);
      const response = await axios.get(
        `http://localhost:3000/getPersonalAdData/${value}`
      ); //retrieve all the users ads
      setDataReceived(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateData = (item) => {
    console.log(item);
    setName(item.Name);
    setTab(item.Name);
    setOriginalName(item.Name);
    setKeyWords(item.KeyWords);
    setLocation(item.Location);
    setPricing(item.Pricing);
    setPricingPlacer(item.Pricing.toString());
    setPaid(item.Paid);
    setContacts(item.Contact);
    setLink(item.Link);
    setDetails(item.Details);
    const newCoordinate = { ...item.Coordinates, Moved: false };
    setCoordinateData(newCoordinate);
    setImageUrl(item.ImageUrl);
    setExpiryDate(item.ExpiryDate);
    setRating(item.Rating);
    setNumRated(item.NumRated);
    setPlan(item.Plan);
    setAdID(item._id.toString());
    setImageReceived(item.ImageUrl);
    setImageUrl([]);
    setImages([]);
    setImagesDeleted([]);
    setInvalidPricing(false);
    setDateCreated(item.DateCreated);
    setAverageRating(item.AverageRating);
    setDeleteBanner(false);
    setPinCoords();
  };

  useEffect(() => {
    setPlan("None");
    setName("");
    setTab("Create Advert");
    setOriginalName("");
    setKeyWords("");
    setLocation();
    setPricing(0);
    setPricingPlacer(0);
    setPaid(true);
    setContacts("");
    setLink("");
    setDetails("");
    setInvalidPricing(false);
    setImageUrl([]);
    setImages([]);
    setExpiryDate("");
    setRating(0);
    setNumRated(0);
    setAdID(undefined);
    setImageReceived([]);
    setDateCreated("");
    setAverageRating(0);
    setDeleteBanner(false);
    setCoordinateData(coordinateR);
    setPinCoords();
  }, [clearData]);

  useEffect(() => {
    getAdData();
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

  const removeTrailingWhitespace = (str) => {
    let i = str.length - 1;

    while (i >= 0 && str.charAt(i) === " ") {
      i--;
    }

    return str.slice(0, i + 1);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    // Check if the file exists and is an image
    if (file && file.type.startsWith("image/")) {
      setImages([...images, file]); // Push the file object
      const reader = new FileReader();

      reader.onloadend = () => {
        setImageUrl([...imageUrl, reader.result]);
      };

      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file");
    }
  };

  //delete a selected ad
  const handleDeleteAd = async () => {
    setUploading(true); //activate activityIndicator

    //check if images exist and delete
    if (imageReceived.length !== 0) {
      try {
        await axios.delete(`http://localhost:3000/deleteAdImages`, {
          data: { urls: imageReceived },
        });
      } catch (error) {
        console.error(error);
      }
    }
    //delete reviews under advert
    try {
      await axios.delete(
        `http://localhost:3000/deleteAdReviews?id=${adID}`
      );
    } catch (error) {
      console.error(error);
    }

    //delete report under advert
    try {
      await axios.delete(
        `http://localhost:3000/deleteAdReports?id=${adID}`
      );
    } catch (error) {
      console.error(error);
    }
    //delete all chats under adID
    try {
      await axios.delete(`http://localhost:3000/deleteChats?id=${adID}`);
    } catch (error) {
      console.error(error);
    }
    //delete advert finally
    try {
      await axios.delete(`http://localhost:3000/deleteAd?id=${adID}`);
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => {
      setUploading(false);
      document.body.style.overflow = "visible";
      navigate('/HomePage')
    }, 3000);
  };

  const checkExisting = async () => {
    //checks if the Name changed for the advert is not similar to the name initially provided
    if (originalName !== name) {
      try {
        const response = await axios.get(
          `http://localhost:3000/checkExisting/${name}`
        );
        if (response.data.proceed === false) {
          setNameInUse(true);
          setAdInExistanceUrl(`AdScreen/${response.data.result._id}`);
          return { proceed: false };
        }
        return { proceed: true };
      } catch (error) {
        console.error(error);
        throw error; // Rethrow the error to handle it further up the call stack
      }
    }
  };

  //used to keep track of all the images that were deleted from already existant images
  const deleteImagesReceived = (imageUri) => {
    setImagesDeleted([...imagesDeleted, imageUri]);
    setImageReceived((prevImages) =>
      prevImages.filter((url) => url !== imageUri)
    );
  };

  const deleteImageChoose = (imageUri) => {
    // Find the index of the image URL in the imageUrl array
    const index = imageUrl.findIndex((url) => url === imageUri);
  
    if (index !== -1) {
      // Remove the corresponding image URL and file based on the index
      setImageUrl((prevImages) => {
        const newImageUrl = [...prevImages];
        newImageUrl.splice(index, 1);
        return newImageUrl;
      });
  
      setImages((prevImages) => {
        const newImages = [...prevImages];
        newImages.splice(index, 1);
        return newImages;
      });
    }
  };
  

  //delete images from cloud storage
  const deleteImages = async () => {
    if (imagesDeleted.length > 0) {
      try {
        await axios.delete(`http://localhost:3000/deleteAdImages`, {
          data: { urls: imagesDeleted }, // pass data in the request body
        });
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    } else {
      return true;
    }
  };
  //upload images
  const uploadImages = async () => {
    if (images.length > 0) {
      try {
        const formData = new FormData();
        images.forEach((file, index) => {
          formData.append("images", file, `image-${index}.jpg`);
        });

        const response = await fetch(
          `http://localhost:3000/uploadAdImages`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    } else {
      return null;
    }
  };

  //upload a new advert or advert changes
  const handleUpload = async () => {
    const isBlank = /^\s*$|^\s{2,}/; //regex for blank or white spaces
    if (
      !isBlank.test(name) &&
      !isBlank.test(contacts) &&
      !isBlank.test(keyWords) &&
      !isBlank.test(location) &&
      !isBlank.test(details)
    ) {
      // this block doesn't work too properly 0xx is accepted while xx0 isn't isNan fails
      if (isNaN(pricing)) {
        setInvalidPricing(true); //pricing field turns red if nan
        setTimeout(() => {
          setUploading(false);
        }, 3000);
        return;
      }
      setUploading(true);

      try {
        const checkResult = await checkExisting();
        if (!checkResult.proceed) {
          return;
        }
      } catch (error) {
        // Handle the error appropriately
        console.error(error);
      }

      const confirmDelete = await deleteImages();
      const uploadedImages = await uploadImages();
      const today = new Date();
      const nextWeekTime = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); //used in expiry date
      const currentTime = new Date(today.getTime());

      if (imageUrl.length !== 0 && confirmDelete) {
        //check if image was added
        if (adID && uploadedImages) {
          //check if it was for an already existing advert and upload

          //update to the imageUrls to the changes made
          const imagesChange = () => {
            const arr = uploadedImages.concat(imageReceived);
            return arr.filter((url) => url !== imagesDeleted);
          };

          axios
            .put(`http://localhost:3000/uploadAdData`, {
              //remove whitespace
              Name: removeTrailingWhitespace(name),
              KeyWords: removeTrailingWhitespace(keyWords),
              Location: removeTrailingWhitespace(location),
              Pricing: pricing,
              Paid: paid,
              Contact: removeTrailingWhitespace(contacts),
              Link: removeTrailingWhitespace(link),
              Details: removeTrailingWhitespace(details),
              Coordinates: {
                coordinates: {
                  longitude: coordinateData.coordinates.longitude,
                  latitude: coordinateData.coordinates.latitude,
                },
                Set: coordinateData.Set,
              },
              UserID: userID,
              UserName: userName,
              ImageUrl: imagesChange(),
              ExpiryDate: expiryDate,
              Rating: rating,
              NumRated: numRated,
              AdID: adID,
              Plan: plan,
              AverageRating: averageRating,
              DateCreated: dateCreated,
            })
            .then(() => {
              navigate("/HomePage");
            })
            .catch((error) => {
              console.error(error.message);
            });
        } else if (uploadedImages) {
          //if images are for a newly created advert
          axios
            .post(`http://localhost:3000/uploadAdData`, {
              Name: removeTrailingWhitespace(name),
              KeyWords: removeTrailingWhitespace(keyWords),
              Location: removeTrailingWhitespace(location),
              Pricing: pricing,
              Paid: false,
              Plan: "None",
              Contact: removeTrailingWhitespace(contacts),
              Link: removeTrailingWhitespace(link),
              Details: removeTrailingWhitespace(details),
              Coordinates: {
                coordinates: {
                  longitude: coordinateData.coordinates.longitude,
                  latitude: coordinateData.coordinates.latitude,
                },
                Set: coordinateData.Set,
              },
              UserID: userID,
              UserName: userName,
              ImageUrl: uploadedImages,
              ExpiryDate: nextWeekTime,
              Rating: 0,
              NumRated: 0,
              AverageRating: 0,
              DateCreated: currentTime,
              Enabled: true,
            })
            .then((response) => {
              const result = response.data;
              result.boostScreen = true;
              setBoostData(result);
              setBoostMenu(true);
              setTimeout(() => {
                setBoostLoading(false);
              }, 2000);
            })
            .catch((error) => {
              console.error(error.message);
            });
        }
      } //adverts that have some images deleted but no new photos
      else if (adID && confirmDelete) {
        const imagesChange = () => {
          return imageReceived.filter((url) => url !== imagesDeleted);
        };
        axios
          .put(`http://localhost:3000/uploadAdData`, {
            Name: removeTrailingWhitespace(name),
            KeyWords: removeTrailingWhitespace(keyWords),
            Location: removeTrailingWhitespace(location),
            Pricing: pricing,
            Paid: paid,
            Contact: removeTrailingWhitespace(contacts),
            Link: removeTrailingWhitespace(link),
            Details: removeTrailingWhitespace(details),
            Coordinates: {
              coordinates: {
                longitude: coordinateData.coordinates.longitude,
                latitude: coordinateData.coordinates.latitude,
              },
              Set: coordinateData.Set,
            },
            UserID: userID,
            ImageUrl: imagesChange(),
            UserName: userName,
            ExpiryDate: expiryDate,
            Rating: rating,
            NumRated: numRated,
            AdID: adID,
            Plan: plan,
            AverageRating: averageRating,
            DateCreated: dateCreated,
          })
          .then(() => {
            navigate("/HomePage");
          });
      } else if (adID === undefined) {
        //in the event of a new advert without photos so no need to await for imageUpload

        axios
          .post(`http://localhost:3000/uploadAdData`, {
            Name: removeTrailingWhitespace(name),
            KeyWords: removeTrailingWhitespace(keyWords),
            Location: removeTrailingWhitespace(location),
            Pricing: pricing,
            Paid: false,
            Contact: removeTrailingWhitespace(contacts),
            Link: removeTrailingWhitespace(link),
            Details: removeTrailingWhitespace(details),
            Coordinates: {
              coordinates: {
                longitude: coordinateData.coordinates.longitude,
                latitude: coordinateData.coordinates.latitude,
              },
              Set: coordinateData.Set,
            },
            UserID: userID,
            UserName: userName,
            ImageUrl: [],
            ExpiryDate: expiryDate,
            Rating: 0,
            NumRated: 0,
            AverageRating: 0,
            Plan: "",
            DateCreated: currentTime,
            Enabled: true,
          })
          .then((response) => {
            const result = response.data;
            //receive data so that we can update the personalAdContext with adID etc for use in Boost component
            result.boostScreen = true; //add a new variable 'boostscreen' used in the boost screen to prevent navigation.goBack()ing  to this screen,
            // once back button is pressed we need it to go to HomePage instead this prevents any possible errors
            setBoostData(result); //it is set inorder for boostData.Name to be used in the boosting menu
            setBoostMenu(true); //set boost menu to true
            setTimeout(() => {
              setBoostLoading(false);
            }, 3000);
          })
          .catch((error) => {
            console.error(error.message);
          });
      }
    }
    setTimeout(() => {
      setUploading(false);
    }, 3000);
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
          setUserLocation({ lat: latitude, lng: longitude });
        },
        // if there was an error getting the users location
        (error) => {
          setGeoPermissionRejected(true);
          console.error("Error getting user location:", error);
        }
      );
    }
    // if geolocation is not supported by the users browser
    else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const openMaps = () => {
    getUserLocation();
    setMapScreen(true);
  };

  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);

  const handlePlaceChanged = () => {
    try {
      const lng = autocompleteRef.current.getPlace().geometry.location.lng();
      const lat = autocompleteRef.current.getPlace().geometry.location.lat();
      const map = mapRef.current;

      if (map) {
        map.panTo({ lat, lng });
        map.setZoom(12); // You can adjust the zoom level as needed
      }
    } catch (error) {}
  };

  return (
    <div>
      <div ref={section1}></div>
      {uploading === true ? (
        <div className="z-30 h-screen w-full absolute">
          <div className="fixed  flex bg-black z-10 w-[200%] h-[500%] opacity-10 items-center justify-center "></div>
          <div className="flex justify-center items-center absolute z-20 w-full h-screen">
            <ClipLoader
              color="white"
              cssOverride={override}
              size={60}
              data-testid="loader"
            />
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {deleteAdMenu === true ? (
        <div className="z-30 h-screen w-full absolute">
          <div
            onClick={() => {
              setDeleteAdMenu(false);
              document.body.style.overflow = "visible";
            }}
            className="absoulte z-40 bg-black flex flex-row-reverse sm:pr-10"
          >
            <IoClose size={40} className="opacity-70" color="white" />
          </div>
          <div className="absolute flex bg-black z-10 w-full h-screen opacity-80 items-center justify-center "></div>
          <div className="flex justify-center items-center absolute z-20 w-full h-screen">
            <div className="bg-white w-[90%] md:w-[50%] rounded lg:p-5 px-3 pt-2">
              <div
                className="flex flex-row-reverse cursor-pointer"
                onClick={() => {
                  setDeleteAdMenu(false);
                  document.body.style.overflow = "visible";
                }}
              >
                <IoClose size={20} className="opacity-70" color="gray" />
              </div>
              <div className="flex justify-center">
                <div className="text-xl">Delete Advert</div>
              </div>
              <div className="flex justify-center lg:my-5 my-2">
                <div className="text-xs">
                  Are you sure you want to delete this advert? The contents
                  cannot be recovered.
                </div>
              </div>
              <div className="w-full flex items-center justify-center">
                <div className="flex justify-between lg:w-2/3 w-5/6 my-5">
                  <div
                    onClick={() => {
                      setDeleteAdMenu(false);
                      document.body.style.overflow = "visible";
                    }}
                    className="border-[1px] cursor-pointer  hover:scale-105 transition-transform duration-400 px-8 lg:py-2 py-[7px] rounded-3xl border-black"
                  >
                    <div className="text-sm font-bold">Cancel</div>
                  </div>
                  <div
                    onClick={() => {
                      setDeleteAdMenu(false)
                      handleDeleteAd()
                    }}
                    className="bg-red-600 cursor-pointer hover:bg-red-700 hover:scale-105 transition-transform duration-400 px-8 lg:py-2 py-[7px] flex items-center justify-center rounded-3xl border-black"
                  >
                    <div className="text-white text-sm">Delete</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {mapScreen === true && geoPermissionRejected === false ? (
        <div className="z-30 h-screen w-full absolute">
          <div
            onClick={() => {
              setMapScreen(false);
              document.body.style.overflow = "visible";
            }}
            className="absoulte z-50 bg-black flex flex-row-reverse sm:pr-10"
          >
            <IoClose size={40} className="opacity-70" color="white" />
          </div>
          <div className="absolute flex bg-black z-10 w-full h-screen opacity-80 items-center justify-center "></div>
          <div className="flex justify-center items-center absolute z-20 w-full h-screen">
            {isLoaded && userlocation ? (
              <div className="w-full  flex flex-col justify-center items-center">
                <Autocomplete
                  onLoad={(autocomplete) =>
                    (autocompleteRef.current = autocomplete)
                  }
                  onPlaceChanged={handlePlaceChanged}
                  className="w-[80%]"
                >
                  <div className="flex justify-center w-full">
                    <label className="border-b-2 border-b-black text-sm bg-white  pb-4 px-2 w-full  justify-between pt-2 flex flex-row">
                      <input
                        type="text"
                        className=" placeholder:text-sm  pl-5 focus:outline-none w-full"
                        placeholder="Search for Location"
                      />
                      <BsSearch size={20} />
                    </label>
                  </div>
                </Autocomplete>
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={
                    coordinateData.Set
                      ? {
                          lat: parseFloat(coordinateData.coordinates.latitude),
                          lng: parseFloat(coordinateData.coordinates.longitude),
                        }
                      : userlocation
                  }
                  zoom={12}
                  options={{
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                  }}
                  onLoad={(map) => (mapRef.current = map)}
                  onDblClick={(e) => {
                    setPinCoords({
                      latitude: e.latLng.lat(),
                      longitude: e.latLng.lng(),
                    });
                  }}
                >
                  <Marker
                    position={
                      coordinateData.Set && !pinCoords
                        ? {
                            lat: parseFloat(
                              coordinateData.coordinates.latitude
                            ),
                            lng: parseFloat(
                              coordinateData.coordinates.longitude
                            ),
                          }
                        : pinCoords
                        ? {
                            lat: pinCoords.latitude,
                            lng: pinCoords.longitude,
                          }
                        : userlocation
                    }
                    onDragEnd={(e) => {
                      setPinCoords({
                        latitude: e.latLng.lat(),
                        longitude: e.latLng.lng(),
                      });
                    }}
                    onMouseDown
                    draggable
                  />
                </GoogleMap>
                <div className="w-[80%] flex 4xs:flex-col justify-between lg:items-center bg-white py-2">
                  <div className="lg:md:xs:w-[35%] 4xs:w-[80%] 2xs:w-[80%]    flex flex-row justify-between lg:md:xs:ml-5 mx-2">
                    <div
                      className=" py-1 px-6 bg-fuchsia-800 rounded-lg hover:bg-fuchsia-800 hover:scale-105 transition-transform duration-100 cursor-pointer "
                      onClick={
                        pinCoords
                          ? () => {
                              setCoordinateData({
                                coordinates: pinCoords,
                                Set: true,
                                Moved: true,
                              });
                              document.body.style.overflow = "visible";
                              setMapScreen(false);
                            }
                          : () => {
                              setCoordinateData({
                                coordinates: {
                                  latitude: "not set",
                                  longitude: "not set",
                                },
                                Set: false,
                                Moved: false,
                              });
                            }
                      }
                    >
                      <div className="text-white text-sm">Save</div>
                    </div>
                    <div
                      className=" py-1 mx-2 px-6 bg-red-600 rounded-lg  hover:scale-105 transition-transform duration-100 cursor-pointer "
                      onClick={() => {
                        setCoordinateData({
                          coordinates: {
                            latitude: "not set",
                            longitude: "not set",
                          },
                          Set: false,
                          Moved: true,
                        });
                        document.body.style.overflow = "visible";
                        setMapScreen(false);
                      }}
                    >
                      <div
                        className="text-white text-sm"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Remove Location
                      </div>
                    </div>
                  </div>
                  <div className="m-2">
                    <div className="text-sm text-gray-700">
                      Drag or double click to add location
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {boostMenu === true ? (
        <div className="z-30 h-screen w-full absolute">
          <div
            onClick={() => {
              setBoostMenu(false);
              document.body.style.overflow = "visible";
            }}
            className="absoulte z-40 bg-black flex flex-row-reverse sm:pr-10"
          >
            <IoClose size={40} className="opacity-70" color="white" />
          </div>
          <div className="absolute flex bg-black z-10 w-full h-screen opacity-80 items-center justify-center "></div>
          <div className="flex justify-center items-center absolute z-20 w-full h-screen">
            <div className="bg-white w-[90%] md:w-[50%] rounded lg:p-5 px-3 pt-2">
              <div
                className="flex flex-row-reverse cursor-pointer"
                onClick={() => {
                  setBoostMenu(false);
                  document.body.style.overflow = "visible";
                }}
              >
                <IoClose size={20} className="opacity-70" color="gray" />
              </div>
              <div className="flex justify-center">
                <div className="text-xl">Boost Advert</div>
              </div>
              <div className="flex justify-center lg:my-5 my-2">
                <div className="text-xs text-center">
                  Boosting adverts lets the adverts appear on the home screen
                  promoting reachability. Without they are only found by
                  searching.
                </div>
              </div>
              <div className="w-full flex items-center justify-center">
                {boostLoading ? (
                  <div className="my-4">loading...</div>
                ) : (
                  <div className="flex justify-between lg:w-2/3 w-3/4 my-5">
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setBoostMenu(false);
                        document.body.style.overflow = "visible";
                      }}
                    >
                      <div className="text-sm font-bold text-red-500">
                        No Thanks
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        const expirationDate = new Date();
                        expirationDate.setDate(
                          expirationDate.getMinutes() + 40
                        );
                        setPersonalAdInfoCookies("personalAdInfo", boostData, {
                          expires: expirationDate,
                        });

                        setBoostMenu(false);
                        navigate("/Boost");
                      }}
                      className="bg-fuchsia-800 cursor-pointer hover:bg-fuchsia-700 hover:scale-105 transition-transform duration-400 px-7 lg:py-2 py-[7px] flex items-center justify-center rounded-3xl border-black"
                    >
                      <div className="text-white text-sm">Continue</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      {geoPermissionRejected === true && mapScreen === true ? (
        <div className="z-30 h-screen w-full absolute">
          <div
            onClick={() => {
              setGeoPermissionRejected(false);
              setMapScreen(false);

              document.body.style.overflow = "visible";
            }}
            className="absoulte z-40 bg-black flex flex-row-reverse sm:pr-10"
          >
            <IoClose size={40} className="opacity-70" color="white" />
          </div>
          <div className="absolute flex bg-black z-10 w-full h-screen opacity-80 items-center justify-center "></div>
          <div className="flex justify-center items-center absolute z-20 w-full h-screen">
            <div className="bg-white md:w-[60%] 2xs:h-[60%] 3xs:h-[45%] 4xs:h-[58%] w-[95%] rounded p-5 2xs:p-2 xs:p-3 4xs:p-2">
              <div
                className="flex flex-row-reverse cursor-pointer"
                onClick={() => {
                  setGeoPermissionRejected(false);
                  setMapScreen(false);

                  document.body.style.overflow = "visible";
                }}
              >
                <IoClose size={20} className="opacity-70" color="gray" />
              </div>
              <div className="flex justify-center">
                <div className="text-xl 2xs:text-sm 4xs:text-sm">
                  GeoLocation permission was rejected
                </div>
              </div>
              <div className="flex justify-center my-5 4xs:my-3 2xs:my-3">
                <div className="text-xs text-gray-600">
                  You need to allow permissions for geo location to see the
                  location of the advert
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  alt=""
                  src={screenshotGeoLocationImage}
                  className="w-[300px] h-[200px] bg-cover"
                />
              </div>
              <div className="w-full flex items-center justify-center mt-4">
                <div
                  onClick={() => {
                    setMapScreen(false);
                    setGeoPermissionRejected(false);
                    document.body.style.overflow = "visible";
                  }}
                  className="border-[1px] cursor-pointer  hover:scale-105 transition-transform duration-400 px-5 py-2 4xs:py-[7px] rounded-xl border-black"
                >
                  <div className="text-sm font-semibold">Okay</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      <div className="flex">
        {largeScreen ? (
          <div className="z-20">
            <VerticalHeader page="CreateAd" />
          </div>
        ) : (
          <></>
        )}
        <div className="w-full">
          {!loggedIn ? (
            <div className="h-screen flex items-center w-full lg:ml-44">
              <div className="h-[50%] ml-[10%]">
                <div>
                  <div className="text-4xl font-semibold">NOT LOGGED IN</div>
                </div>
                <div className="h-1/3 flex flex-col-reverse mb-5 text-gray-500">
                  <div>You are not yet logged in to create adverts</div>
                </div>
                <div className="items-center flex">
                  <button
                    onClick={() => {
                      navigate("/SignUp");
                    }}
                    className="bg-fuchsia-800 rounded py-[6px] px-8 hover:scale-y-105 transition-transform duration-400"
                  >
                    <div className="text-white">GET STARTED</div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:ml-[200px] flex flex-col flex-1 ">
              <div className="my-3 border-b-[1.5px]">
                <div className="mb-3 pl-3 flex justify-between">
                  <div className="text-lg text-slate-800 font-medium">
                    Advertisements
                  </div>
                  {adID ? (
                    <div className="relative">
                      <div
                        className="cursor-pointer"
                        onPointerOver={() => {
                          setDeleteBanner(true);
                        }}
                        onClick={() => {
                          setDeleteBanner(true);
                          scrollToDiv(section1);
                        }}
                      >
                        <BiDotsVerticalRounded size={20} />
                      </div>
                      {deleteBanner ? (
                        <div
                          onPointerLeave={() => {
                            setDeleteBanner(false);
                          }}
                          onClick={() => {
                            scrollToDiv(section1);
                            setDeleteAdMenu(true);
                            document.body.style.overflow = "hidden";
                          }}
                          className="cursor-pointer right-2 top-2 z-3 absolute bg-white drop-shadow-xl shadow-xl w-24 py-1 border flex items-center justify-center"
                        >
                          <div className="text-xs">Delete Advert</div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="flex ml-5 mt-4 overflow-x-auto">
                  <div
                    className={
                      tab === "Create Advert"
                        ? "border-b-2 pb-1 border-fuchsia-800 flex justify-center flex-col mr-5 cursor-pointer"
                        : "flex mr-5 pb-1 cursor-pointer flex-col justify-center"
                    }
                  >
                    <div
                      className={
                        tab === "Create Advert"
                          ? "text-fuchsia-800 text-sm"
                          : " text-slate-500 text-sm"
                      }
                      onClick={() => {
                        scrollToDiv(section1);
                        setClearData(!clearData);
                      }}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Create Advert
                    </div>
                  </div>
                  <div className="flex">
                    {dataReceived.map((item, index) => (
                      <div
                        className={
                          tab === item.Name
                            ? "px-4 border-b-2 pb-1 border-fuchsia-800 flex justify-center flex-col mr-5 cursor-pointer"
                            : "px-4 flex mr-5 pb-1 cursor-pointer flex-col justify-center"
                        }
                        key={index}
                        onClick={() => {
                          scrollToDiv(section1);
                          updateData(item);
                        }}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        <div
                          className={
                            tab === item.Name
                              ? "text-fuchsia-800 text-sm"
                              : " text-slate-500 text-sm"
                          }
                        >
                          {item.Name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-center">
                  <div className="lg:w-[70%] md:w-[75%] sm:w-[80%] w-[85%] gap-8 grid mt-5  mb-10 text-sm">
                    <div className="">
                      <input
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        type="text"
                        className="border w-full py-3 px-5 focus:outline-none  placeholder:text-sm "
                        placeholder="Business Name"
                        value={name}
                      />
                      {nameInUse ? (
                        <div className="w-full flex pl-2">
                          <div className="text-xs text-red-500 pr-1">
                            Business Name in use.
                          </div>
                          <div
                            onClick={() => {
                              navigate(adInExistanceUrl);
                            }}
                            className="text-xs underline text-red-500"
                          >
                            See More.
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="">
                      <input
                        type="text"
                        onChange={(e) => {
                          setKeyWords(e.target.value);
                        }}
                        className="border w-full py-3 px-5 focus:outline-none  placeholder:text-sm "
                        placeholder="Key Words"
                        value={keyWords}
                      />
                    </div>
                    <div className="">
                      <input
                        type="text"
                        onChange={(e) => {
                          setLocation(e.target.value);
                        }}
                        className="border w-full py-3 px-5 focus:outline-none  placeholder:text-sm "
                        placeholder="Location"
                        defaultValue={location}
                      />
                    </div>
                    <div className="">
                      <input
                        type="text"
                        onChange={(e) => {
                          setContacts(e.target.value);
                        }}
                        className="border w-full py-3 px-5 focus:outline-none  placeholder:text-sm "
                        placeholder="Telephone / Email"
                        value={contacts}
                      />
                    </div>
                    <div className="">
                      <input
                        type="text"
                        onChange={(e) => {
                          setLink(e.target.value);
                        }}
                        className="border w-full py-3 px-5 focus:outline-none  placeholder:text-sm "
                        placeholder="URL Link"
                        value={link}
                      />
                    </div>
                    <div className="">
                      <input
                        onChange={(e) => {
                          const text = e.target.value;
                          const isBlank = /^\s*$|^\s{2,}/;
                          if (isBlank.test(text)) {
                            setPricing(0);
                            setPricingPlacer("")
                          } else {
                            setPricing(parseInt(text));
                            setPricingPlacer(text)
                          }
                        }}
                        type="text"
                        className="border w-full py-3 px-5 focus:outline-none  placeholder:text-sm "
                        placeholder="Pricing"
                        value={pricingPlacer}
                      />
                      {invalidPricing ? (
                        <div className="w-full flex pl-2">
                          <div className="text-xs text-red-500 pr-1">
                            The pricing should be numerical
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="">
                      <textarea
                        onChange={(e) => {
                          setDetails(e.target.value);
                        }}
                        type="text"
                        className="border w-full overflow-hidden py-3 px-5 focus:outline-none  placeholder:text-sm "
                        placeholder="Details"
                        value={details}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center my-1">
                <div
                  onClick={() => {
                    openMaps();
                    scrollToDiv(section1);
                    document.body.style.overflow = "hidden";
                  }}
                  className="bg-fuchsia-800 cursor-pointer hover:bg-fuchsia-800 py-1 rounded-xl w-[80%] flex justify-center items-center"
                >
                  <div className="text-white font-semibold">Add Location</div>
                </div>
              </div>
              <div className="h-auto border relative overflow-x-scroll m-5 bg-gray-50 min-h-[300px]">
                <label
                  htmlFor="fileInput"
                  className="bg-fuchsia-800 text-white p-2 pr-20 pl-1 text-xs  cursor-pointer hover:bg-fuchsia-800"
                >
                  Add Photo
                </label>
                <input
                  id="fileInput"
                  type="file"
                  className="hidden" // Using 'hidden' to hide the original input
                  onChange={handleImageUpload}
                />
                <div className="flex flex-row ">
                  {imageReceived.map((item, index) => (
                    <div className="relative">
                      <img
                        alt=""
                        key={index}
                        src={item}
                        className="h-auto bg-gray-200 rounded max-w-[200px] resize w-auto m-2 shadow-xl object-contain"
                      />
                      <div
                        onClick={() => {
                          deleteImagesReceived(item);
                        }}
                        className="absolute top-2 shadow-xl right-2 bg-red-600 w-6 h-6 flex items-center justify-center rounded-full cursor-pointer"
                      >
                        <AiFillDelete color="white" size={15} />
                      </div>
                    </div>
                  ))}

                  {/* Separate div for the new images array */}
                  {imageUrl.map((item, index) => (
                    <div className="relative z-20">
                      <img
                        alt=""
                        key={`new-${index}`}
                        id={`image-${index}`}
                        src={item}
                        className="h-auto bg-gray-200 rounded max-w-[200px] resize w-auto m-2 shadow-xl object-contain"
                      />
                      <div
                        onClick={() => {
                          deleteImageChoose(item);
                        }}
                        className="absolute top-2 shadow-xl right-2 bg-red-800 w-6 h-6 flex items-center justify-center rounded-full cursor-pointer"
                      >
                        <AiFillDelete color="white" size={15} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex pb-14 justify-between">
                {adID ? (
                  <>
                    {paid === false ? (
                      <div
                        className="cursor-pointer m-5 h-[60px] w-[60px] flex justify-center items-center shadow-drop-xl drop-shadow-xl rounded-[30px] bg-white"
                        onClick={() => {
                          const expirationDate = new Date();
                          expirationDate.setDate(
                            expirationDate.getMinutes() + 40
                          );
                          scrollToDiv(section1);
                          setPersonalAdInfoCookies(
                            "personalAdInfo",
                            dataReceived[0],
                            {
                              expires: expirationDate,
                            }
                          );
                          navigate("/Boost");
                        }}
                      >
                        <img
                          alt=""
                          src={startup}
                          className="h-[50px] w-[50px]"
                        />
                      </div>
                    ) : (
                      <div
                        className="cursor-pointer m-5 h-[60px] w-[60px] flex justify-center items-center  rounded-[30px] bg-white drop-shadow-xl"
                        onClick={() => {
                          const expirationDate = new Date();
                          expirationDate.setDate(
                            expirationDate.getMinutes() + 40
                          );
                          scrollToDiv(section1);
                          setPersonalAdInfoCookies(
                            "personalAdInfo",
                            dataReceived[0],
                            { expires: expirationDate }
                          );
                          navigate("/Analytics");
                        }}
                      >
                        <img alt="" src={graph} className="h-[50px] w-[50px]" />
                      </div>
                    )}
                  </>
                ) : (
                  <></>
                )}
                <div
                  onClick={() => {
                    setUploading(true);
                    handleUpload();
                    scrollToDiv(section1);
                  }}
                  className="cursor-pointer drop-shadow-xl m-5 h-[60px] w-[60px] flex justify-center items-center  rounded-[30px] bg-white"
                >
                  <img alt="" src={tickImage} className="h-[50px] w-[50px]" />
                </div>
              </div>
            </div>
          )}
          {largeScreen ? (
            <></>
          ) : (
            <div className="z-20 absolute">
              <Header page="CreateAd" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAd;
