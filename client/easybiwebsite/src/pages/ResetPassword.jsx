import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

import { useCookies } from "react-cookie";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [uploading, setUploading] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cookie] = useCookies(["verification"]);
  const [userCookie, setUserCookie] = useCookies(["user"]);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showpassword, setShowPassword] = useState(false);
  const eye = require("../assets/eye.png");
  const hidden = require("../assets/hidden.png");
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);

  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,24}$/;

  const [confirmPasswordColor, setConfirmPasswordColor] = useState("");
  const [passwordColor, setPasswordColor] = useState("#ddd");

  const passwordChanged = (text) => {
    setPassword(text);
    setPasswordValid(PWD_REGEX.test(text));
    setPasswordColor(PWD_REGEX.test(text) || password === "" ? "#ddd" : "red");
  };

  const confirmPasswordChanged = (text) => {
    setConfirmPassword(text);
    setConfirmPasswordValid(password === text);
    setConfirmPasswordColor(
      password === text || confirmPassword === "" ? "#ddd" : "red"
    );
  };

  const section1 = useRef(null);

  const resetPassword = async () => {
    if (confirmPasswordValid && passwordValid && uploading === false) {
      const removeTrailingWhitespace = (str) => {
        let i = str.length - 1;

        while (i >= 0 && str.charAt(i) === " ") {
          i--;
        }

        return str.slice(0, i + 1);
      };
      const data = {
        email: removeTrailingWhitespace(email),
        password: removeTrailingWhitespace(password),
      };

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);

      await axios
        .put("http://localhost:3000/resetPassword", data)
        .then((response) => {
          console.log(response.data)
          setUserCookie("user", response.data.user, {
            expires: expirationDate,
          });
          navigate("/HomePage");
        });
    } else {
      setTimeout(() => {
        setUploading(false);
      }, 3000);
      setErrorMessage("PLEASE FILL IN ALL THE FIELDS CORRECTLY");
    }
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

  const getEmail = async () => {
    const verification = await cookie.verification;
    setEmail(verification);
  };

  useEffect(() => {
    getEmail();
  }, []);

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
            <label
              className="border my-3 text-xs rounded pb-2 px-4 pt-2 flex flex-row content-center items-center justify-between"
              style={{ borderColor: passwordColor }}
            >
              <input
                value={password}
                type={showpassword ? "text" : "password"}
                required
                className=" w-3/4 placeholder:text-xs pl-5 py-4 active:bg-transparent focus:outline-none active:bg-white"
                placeholder="Password"
                onChange={(e) => {
                  passwordChanged(e.target.value);
                }}
                onBlur={() => {
                  passwordChanged(password);
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
            {passwordColor === "red" ? (
              <div className=" my-1 flex justify-center items-center">
                <div className="text-xs text-red-500">
                  Password should contain a capital letter and number
                </div>
              </div>
            ) : (
              <></>
            )}
            <label
              className="border my-3 text-xs rounded pb-2 px-4 pt-2 flex flex-row content-center items-center justify-between"
              style={{ borderColor: confirmPasswordColor }}
            >
              <input
                value={confirmPassword}
                type={showConfirmPassword ? "text" : "password"}
                required
                className=" w-3/4 placeholder:text-xs pl-5 py-4 active:bg-transparent focus:outline-none active:bg-white"
                placeholder="Confirm Password"
                onChange={(e) => {
                  confirmPasswordChanged(e.target.value);
                }}
                onBlur={() => {
                  confirmPasswordChanged(confirmPassword);
                }}
              />
              <div
                onClick={() => {
                  setShowConfirmPassword(!showConfirmPassword);
                }}
              >
                {showConfirmPassword ? (
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
          onClick={resetPassword}
          className="my-2 bg-fuchsia-800 w-3/4 sm:w-3/5 md:w-1/2 lg:w-1/3 py-2 px-12 text-white rounded-xl"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
