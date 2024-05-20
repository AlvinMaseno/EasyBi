import React, { useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

import { useCookies } from "react-cookie";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [uploading, setUploading] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cookies, setCookie] = useCookies(["user"]);
  const [showpassword, setShowPassword] = useState(false);
  const eye = require("../assets/eye.png");
  const hidden = require("../assets/hidden.png");

  const section1 = useRef(null);

  const scrollToDiv = (divTarget) => {
    if (divTarget.current) {
      divTarget.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSignIn = (e) => {
    setUploading(true);
    e.preventDefault(); // Prevent the default form submission behavior
    axios
      .post("http://localhost:3000/signIn", {
        Email: email,
        Password: password,
      })
      .then((response) => {
        const res = response.data;
        if (res.proceed) {
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 7);
          setCookie(
            "user",
            {
              Email: res.data.Email,
              Name: res.data.Name,
              UserID: res.data.UserID,
              UserImageUrl: res.data.UserImageUrl,
              UserName: res.data.UserName,
            },
            { expires: expirationDate }
          );
          alert("Login Successful");
          navigate("/HomePage");
        } else {
          setErrorMessage(res.message);
          // Handle sign-in error here, show error message or take appropriate action
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
        setErrorMessage("A RARE ERROR OCCURRED");
        // Handle other types of errors here
      });
    setUploading(false);
  };

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "purple",
  };

  return (
    <div className="flex flex-1 flex-col h-screen">
      <div ref={section1}></div>
      {uploading === true ? (
        <div>
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
      <div className="">
        <div className="flex flex-row  justify-center items-center w-full mt-8  ">
          <div className="font-semibold text-3xl text-custom-purple ">Easy</div>
          <div className="font-semibold text-3xl ">Bi</div>
        </div>
        <div className="flex justify-center items-center w-full flex-col md:mt-2 4xs:mt-24">
          <div className="text-4xl 4xs:text-2xl 2xs:text-2xl font-semibold mt-24 4xs:mt-10">
            Welcome Back
          </div>
          <div className="text-gray-500 text-xs text-center  m-4">
            Sign in back to EasyBi and search for services and places
          </div>
        </div>
      </div>
      {errorMessage ? (
        <div className="bg-bg-yellow-300 my-5 flex justify-center items-center">
          <div className="bg-red-600 px-8 py-[4px] rounded">
            <div className="text-white font-medium text-sm">{errorMessage}</div>
          </div>
        </div>
      ) : (
        <></>
      )}

      <div className="flex-col flex items-center mb-6 w-full justify-between 4xs:mt-[5%] md:mt-[2%] h-[25%] md:h-[30%] lg:h-[35%]">
        <form className="4xs:h-[85%] h-[75%] flex  justify-center w-full">
          <div className="flex justify-around flex-col 4xs:w-4/5 sm:w-3/5 md:w-1/2 lg:w-1/3">
            <label className="border text-xs rounded pb-2 px-4 ">
              <input
                type="email"
                className=" w-full my-2 placeholder:text-xs pl-5 py-4 active:bg-transparent focus:outline-none active:bg-white"
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </label>
            <label className="my-2 border text-xs rounded pb-2 px-4 pt-2 flex flex-row content-center items-center justify-between">
              <input
                type={showpassword ? "text" : "password"}
                className="w-3/4 placeholder:text-xs pl-5 py-4 active:bg-transparent focus:outline-none active:bg-white"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <div
                onClick={() => {
                  setShowPassword(!showpassword);
                }}
              >
                {showpassword ? (
                  <div>
                    <img alt="" src={hidden} className="h-5 w-5" />
                  </div>
                ) : (
                  <div>
                    <img alt="" src={eye} className="h-5 w-5" />
                  </div>
                )}
              </div>
            </label>
          </div>
        </form>
        <button
          onClick={handleSignIn}
          className="my-2 bg-fuchsia-800 w-3/4 sm:w-3/5 md:w-1/2 lg:w-1/3 py-2 px-12 text-white rounded-xl"
        >
          Login
        </button>
      </div>
      <div className="flex flex-row justify-center items-center w-full mt-4 ">
        <div className="text-gray-600 text-sm mr-2">Dont have an Account?</div>
        <Link to="/signUp" className="text-custom-purple text-sm">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
