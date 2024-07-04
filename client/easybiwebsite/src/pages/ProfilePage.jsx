import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { IoClose } from "react-icons/io5";
import { IoMdPhotos } from "react-icons/io";
import { BsFillTrashFill } from "react-icons/bs";
import { useCookies } from "react-cookie";
import VerticalHeader from "../Components/VerticalHeader";
import Header from "../Components/Header";

function ProfileScreen() {
  const [name, setName] = useState();
  const [userName, setUserName] = useState();
  const [email, setEmail] = useState();
  const [userID, setUserID] = useState();
  const [image, setImage] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [imageReceived, setImageReceived] = useState();
  const [imagePickedUri, setImagePickedUri] = useState("");
  const [pickMenu, setPickMenu] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [nameDefault, setNameDefault] = useState();
  const [userNameDefault, setUserNameDefault] = useState();
  const [emailDefault, setEmailDefault] = useState();
  const [largeScreen, setLargeScreen] = useState(false);
  const [deleteAccountMenu, setDeleteAccountMenu] = useState();

  // REGEX
  const NAME_REGEX = /^[a-zA-Z ].{1,24}$/;
  const USERNAME_REGEX = /^[a-zA-Z ].{1,24}$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // STYLING FOR INVADILITY
  const [nameColor, setNameColor] = useState("#ddd");
  const [userNameColor, setUserNameColor] = useState("#ddd");
  const [emailColor, setEmailColor] = useState("#ddd");

  const navigate = useNavigate();

  const section1 = useRef(null);

  const dpImage = require("../assets/museum.png");
  const profileImage = require("../assets/profile.png");

  const [userCookies, removeCookie] = useCookies(["user"]);

  const emailChanged = (text) => {
    setEmail(text);
    setEmailColor(EMAIL_REGEX.test(text) || email === "" ? "#ddd" : "red");
  };

  const nameChanged = (text) => {
    setName(text);
    setNameColor(NAME_REGEX.test(text) || name === "" ? "#ddd" : "red");
  };



  const userNameChanged = (text) => {
    setUserName(text);
    setUserNameColor(
      USERNAME_REGEX.test(text) || userName === "" ? "#ddd" : "red"
    );
  };

  const getValues = async () => {
    const userID = await userCookies.user.UserID;
    const userd = await userCookies.user;
    console.log(userd.UserID)
    setUserID(userID);

    axios
      .get(`http://localhost:3000/getUser/${userID}`)
      .then((response) => {
        setImageUrl(response.data.UserImageUrl);
        setImageReceived(response.data.UserImageUrl);
        setName(response.data.Name);
        setUserName(response.data.UserName);
        setEmail(response.data.Email);
        setNameDefault(response.data.Name);
        setUserNameDefault(response.data.UserName);
        setEmailDefault(response.data.Email);
      
        setTimeout(() => {
          setUploading(false);
        }, 3000);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleLogOut = () => {
    setUploading(true);
    setTimeout(() => {
      removeCookie("user");
      navigate("/HomePage");
      setUploading(false);
    }, 3000);
  };

  const handleDeleteAcc = async () => {
    setUploading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/getPersonalAdData/${userID}`
      );
      response.data.map(async (item) => {
        if (item.ImageUrl.length !== 0) {
          try {
            await axios.delete(`http://localhost:3000/deleteAdImages`, {
              data: { urls: item.ImageUrl }, // pass data in the request body
            });
          } catch (error) {
            console.error("Error deleting Images from the cloud", error);
          }
        }

        try {
          await axios.delete(
            `http://localhost:3000/deleteAdReviews?id=${item._id}`
          );
        } catch (error) {
          console.error("Error Delete ad reviews", error);
        }

        try {
          await axios.delete(
            `http://localhost:3000/deleteAdReports?id=${item._id}`
          );
        } catch (error) {
          console.error("Error deleting ad reports", error);
        }
        try {
          await axios.delete(`http://localhost:3000/deleteAd?id=${item._id}`);
        } catch (error) {
          console.error("Error deleting Ad", error);
        }
        try {
          await axios.delete(
            `http://localhost:3000/deleteChats?id=${item._id}`
          );
        } catch (error) {
          console.error("Chats deletion Failed", error);
        }
      });
    } catch (error) {
      console.error(error);
    }

    try {
      await axios.delete(`http://localhost:3000/deleteChats?id=${userID}`);
    } catch (error) {
      console.error("Chats deletion Failed", error);
    }
    deleteUserImage();
    try {
      await axios.delete(`http://localhost:3000/deleteUser?id=${userID}`);
    } catch (error) {
      console.error("Error deleting User", error);
    }
    document.body.style.overflow = "visible";
    handleLogOut();
  };

  const deleteUserImage = async () => {
    if (imageReceived !== "") {
      try {
        const result = await axios.delete(
          `http://localhost:3000/deleteUserImage`,
          {
            data: { url: imageReceived }, // pass data in the request body
          }
        );
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  };

  const handleSaveChanges = async () => {
    setUploading(true);
    if (
      USERNAME_REGEX.test(userName) &&
      EMAIL_REGEX.test(email) &&
      NAME_REGEX.test(name) 
    ) {
      if (
        (imagePickedUri !== "" || imagePickedUri == "Delete Image") &&
        imageReceived
      ) {
        await deleteUserImage();
      }
      if (imagePickedUri !== "" && imagePickedUri !== "Delete Image") {
        const result = await uploadUserImage();
        axios
          .put(`http://localhost:3000/updateUserProfileChanges`, {
            userid: userID,
            UserImageUrl: result,
            Name: name,
            Email: email,
            UserName: userName,
            Defaults: {
              NameDefault: nameDefault,
              EmailDefault: emailDefault,
              UserNameDefault: userNameDefault,
            },
          })
          .then((response) => {
            if (response.data.proceed) {
              setTimeout(() => {
                setUploading(false);
              }, 3000);
            } else {
              setTimeout(() => {
                setUploading(false);
              }, 3000);
              setErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        axios
          .put(`http://localhost:3000/updateUserProfileChanges`, {
            userid: userID,
            UserImageUrl: "",
            Name: name,
            Email: email,
            UserName: userName,
            Defaults: {
              NameDefault: nameDefault,
              EmailDefault: emailDefault,
              UserNameDefault: userNameDefault,
            },
          })
          .then((response) => {
            if (response.data.proceed) {
              setTimeout(() => {
                setUploading(false);
              }, 3000);
            } else {
              setTimeout(() => {
                setUploading(false);
              }, 3000);
              setErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } else {
      setErrorMessage("PLEASE FILL ALL THE FIELDS CORRECTLY");
    }
    setTimeout(() => {
      setUploading(false);
    }, 3000);
  };

  const uploadUserImage = async () => {
    try {
      const formData = new FormData();
      formData.append("image", image, `image.jpg`);

      const response = await fetch(`http://localhost:3000/uploadUserImage`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error(error);
      return null;
    }
  };


  

  const chooseImage = (e) => {
    const file = e.target.files[0];
    // Check if the file exists and is an image
    if (file && file.type.startsWith("image/")) {
      setImage(file); // Push the file object
      const reader = new FileReader();

      reader.onloadend = () => {
        setImageUrl(reader.result);
        setImagePickedUri(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file");
    }
    document.body.style.overflow = "visible";
    setPickMenu(false);
  };

  const scrollToDiv = (divTarget) => {
    if (divTarget.current) {
      divTarget.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "purple",
  };

  useEffect(() => {
    getValues();
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
      {uploading ? (
        <div className="z-30 h-screen w-full absolute">
          <div className="fixed  flex bg-black z-10 w-[100%] h-[100%] opacity-10 items-center justify-center "></div>
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
      {pickMenu === true ? (
        <div className="z-30 h-screen w-full absolute">
          <div
            onClick={() => {
              setPickMenu(false);
              document.body.style.overflow = "visible";
            }}
            className="absoulte z-40 bg-black flex flex-row-reverse pr-10 4xs:pr-4 sm:pr-4"
          >
            <IoClose size={40} className="opacity-70" color="white" />
          </div>
          <div className="absolute flex bg-black z-10 w-full h-screen opacity-80 items-center justify-center "></div>
          <div className="flex justify-center items-center absolute z-20 w-full h-screen">
            <div className="bg-white w-[90%] md:w-[50%] rounded p-5 4xs:p-2 2xs:p-2">
              <div
                className="flex flex-row-reverse cursor-pointer"
                onClick={() => {
                  setPickMenu(false);
                  document.body.style.overflow = "visible";
                }}
              >
                <IoClose size={20} className="opacity-70" color="gray" />
              </div>
              <div className="flex justify-center">
                <div className="text-xl">Photos Settings</div>
              </div>
              <div className="flex justify-center h-[40%] w-full my-5">
                <div>
                  <img alt="" src={dpImage} className="h-[200px] w-[200px]" />
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <label className="flex w-1/2 py-4 justify-center hover:scale-105 transition-transform duration-200 cursor-pointer ">
                  <div className="mr-2  flex items-center justify-center">
                    <IoMdPhotos />
                  </div>
                  <div className=" text-sm font-semibold">Choose Image</div>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }} // Hide the input element
                    onChange={(e) => chooseImage(e)} // Define a function to handle file selection
                  />
                </label>
                <div
                  onClick={() => {
                    setImagePickedUri("Delete Image");
                    setImageUrl("");
                    document.body.style.overflow = "visible";
                    setPickMenu(false);
                  }}
                  className="flex  w-1/2 py-4 border-t justify-center hover:scale-105 transition-transform duration-200 cursor-pointer "
                >
                  <div className="mr-2  flex items-center justify-center">
                    <BsFillTrashFill color="red" />
                  </div>
                  <div className="text-red-500 text-sm font-semibold">
                    Remove Image
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {deleteAccountMenu === true ? (
        <div className="z-30 h-screen w-full absolute">
          <div
            onClick={() => {
              setDeleteAccountMenu(false);
              document.body.style.overflow = "visible";
            }}
            className="absoulte z-40 bg-black flex flex-row-reverse sm:pr-10"
          >
            <IoClose size={40} className="opacity-70" color="white" />
          </div>
          <div className="absolute flex bg-black z-10 w-full h-screen opacity-80 items-center justify-center "></div>
          <div className="flex justify-center items-center absolute z-20 w-full h-screen">
            <div className="bg-white w-[95%] md:w-[50%] rounded lg:p-5 px-3 pt-2">
              <div
                className="flex flex-row-reverse cursor-pointer"
                onClick={() => {
                  setDeleteAccountMenu(false);
                  document.body.style.overflow = "visible";
                }}
              >
                <IoClose size={20} className="opacity-70" color="gray" />
              </div>
              <div className="flex justify-center">
                <div className="text-xl">Delete Account</div>
              </div>
              <div className="flex justify-center lg:my-5 my-2">
                <div className="text-xs">
                  Are you sure you want to delete this Account?
                </div>
              </div>
              <div className="w-full flex items-center justify-center">
                <div className="flex justify-between lg:w-2/3 w-4/5 my-5">
                  <div
                    onClick={() => {
                      setDeleteAccountMenu(false);
                      document.body.style.overflow = "visible";
                    }}
                    className="border-[1px] cursor-pointer  hover:scale-105 transition-transform duration-400 px-8 lg:py-2 py-[7px] rounded-3xl border-black"
                  >
                    <div className="text-sm font-bold">Cancel</div>
                  </div>
                  <div
                    onClick={handleDeleteAcc}
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
      <div ref={section1}></div>
      <div className="flex h-screen w-full">
        {largeScreen ? (
          <div className="z-20">
            <VerticalHeader page="ProfilePage" />
          </div>
        ) : (
          <></>
        )}
        <div className="py-10 lg:ml-[160px] flex flex-col flex-1 overflow-x-auto pb-24 lg:pb-0">
          <div className="flex flex-col items-center ">
            <div className="text-2xl">Account Settings</div>
          </div>

          <div className="flex flex-col  items-center my-5 ">
            <div className="w-[80%] h-[100%] pt-5 pb-8 justify-between rounded-lg border flex flex-col items-center">
              <div className="flex flex-col items-center">
                {imageUrl ? (
                  <img 
                    onClick={() => {
                      scrollToDiv(section1);
                      setPickMenu(true);
                      document.body.style.overflow = "hidden";
                    }}
                    src={imageUrl}
                    alt="Preview"
                    className="h-[100px] object-cover justify-center border w-[100px] rounded-[50px] hover:scale-105 transition-transform duration-200 cursor-pointer"
                  />
                ) : (
                  <img
                    onClick={() => {
                      scrollToDiv(section1);
                      setPickMenu(true);
                      document.body.style.overflow = "hidden";
                    }}
                    src={profileImage}
                    alt="Preview"
                    className="h-[100px] justify-center border w-[100px] rounded-[50px] hover:scale-105 transition-transform duration-200 cursor-pointer"
                  />
                )}
              </div>

              <div className="flex flex-col items-center ">
                <div className="text-2xl">{name}</div>
              </div>
              {errorMessage ? (
                <div className=" my-5 flex justify-center items-center">
                  <div className="bg-red-600 px-8 py-2 rounded-xl">
                    <div className="text-white font-semibold text-sm">
                      {errorMessage}
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className="h-[80%] flex flex-col w-4/5 mb-4">
                <label
                  className="border text-xs rounded my-2 pb-2 px-4 w-full"
                  style={{ borderColor: nameColor }}
                >
                  <input
                    type="Name"
                    value={name}
                    required
                    className="w-full placeholder:text-xs pl-5 py-4 active:bg-transparent focus:outline-none  active:bg-white"
                    placeholder="Name"
                    onChange={(e) => {
                      nameChanged(e.target.value);
                    }}
                    onBlur={() => {
                      nameChanged(name);
                    }}
                  />
                </label>
                <label
                  className="border text-xs rounded  my-2 pb-2 px-4"
                  style={{ borderColor: userNameColor }}
                >
                  <input
                    type="text"
                    value={userName}
                    required
                    className=" w-full placeholder:text-xs pl-5 py-4 active:bg-transparent focus:outline-none active:bg-white"
                    placeholder="UserName"
                    onChange={(e) => {
                      userNameChanged(e.target.value);
                    }}
                    onBlur={() => {
                      userNameChanged(userName);
                    }}
                  />
                </label>
                <label
                  className="border my-2 text-xs rounded pb-2 px-4"
                  style={{ borderColor: emailColor }}
                >
                  <input
                    type="email"
                    value={email}
                    required
                    className=" w-full placeholder:text-xs pl-5 py-4 active:bg-transparent focus:outline-none active:bg-white"
                    placeholder="Email"
                    onChange={(e) => {
                      emailChanged(e.target.value);
                    }}
                    onBlur={() => {
                      emailChanged(email);
                    }}
                  />
                </label>
                
              </div>
              <div className="flex flex-col w-full justify-between items-center flex-1">
                <div
                  onClick={() => {
                    handleSaveChanges();
                    scrollToDiv(section1);
                  }}
                  className="bg-black my-2 w-3/4 hover:scale-105 transition-transform duration-200 cursor-pointer  flex justify-center h-11 rounded-2xl items-center"
                >
                  <div className="text-white">SAVE CHANGES</div>
                </div>
                <div
                  onClick={handleLogOut}
                  className="bg-black my-2 w-3/4 hover:scale-105 transition-transform duration-200 cursor-pointer flex justify-center h-11 rounded-2xl items-center"
                >
                  <div className="text-white">LOG OUT</div>
                </div>
                <hr className="w-[70%] mt-8" />
                <div
                  onClick={() => {
                    setDeleteAccountMenu(true);
                  }}
                  className="w-3/4 hover:scale-105 transition-transform duration-200 cursor-pointer flex justify-center h-11 rounded-2xl items-center"
                >
                  <div className="text-red-500 text-sm">DELETE ACCOUNT</div>
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
          <Header page="ProfilePage" />
        </div>
      )}
    </div>
  );
}

export default ProfileScreen;
