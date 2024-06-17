import React, { useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

import { useCookies } from "react-cookie";

const VerifyPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [uploading, setUploading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cookies, setCookie] = useCookies(["verification"]);
  const [verificationID, setVerificationID] = useState();

  const section1 = useRef(null);

  const scrollToDiv = (divTarget) => {
    if (divTarget.current) {
      divTarget.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const sendOTP = async () => {
    console.log("sent");
    await axios
      .get(`http://localhost:3000/resetPassword/${email}`)
      .then((response) => {
        if (response.data.proceed) {
          setVerificationID(response.data.verificationID);
        } else {
          setErrorMessage(response.data.message);
        }
      });
  };

  const handleVerification = async () => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    console.log("test");
    await axios
      .get(
        `http://localhost:3000/verifyCode/${verificationID}/${parseInt(
          verificationCode
        )}`
      )
      .then((response) => {
        if (response.data.proceed) {
          setCookie("verification", email, {
            expires: expirationDate,
          });
          navigate("/ResetPassword");
        }else{
          setErrorMessage("INCORRECT OTP")
        }
      });
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
            Forgot Password
          </div>
          <div className="text-gray-500 text-xs text-center  m-4">
            Enter the email and confirm using verification code
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
      {verificationID ? (
        <div className="flex-col  flex items-center mb-6 w-full justify-between 4xs:mt-[5%] md:mt-[2%] h-[25%] md:h-[30%] lg:h-[35%]">
          <form className="4xs:h-[30%] h-[30%]  flex  justify-center w-full">
            <div className="flex justify-around flex-col 4xs:w-4/5 sm:w-3/5 md:w-1/2 lg:w-1/3">
              <label className="border text-xs rounded pb-2 px-4 ">
                <input
                  type="text"
                  value={verificationCode}
                  className=" w-full  my-2 placeholder:text-xs pl-5 py-4 active:bg-transparent focus:outline-none active:bg-white"
                  placeholder="Code"
                  onChange={(e) => {
                    setVerificationCode(e.target.value);
                  }}
                />
              </label>
            </div>
          </form>
          <button
            onClick={handleVerification}
            className="my-2 bg-fuchsia-800 w-3/4 sm:w-3/5 md:w-1/2 lg:w-1/3 py-2 px-12 text-white rounded-xl"
          >
            Verify
          </button>
        </div>
      ) : (
        <div className="flex-col  flex items-center mb-6 w-full justify-between 4xs:mt-[5%] md:mt-[2%] h-[30%] md:h-[25%] lg:h-[25%]">
          <form className="4xs:h-[30%] h-[30%]  flex  justify-center w-full">
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
            </div>
          </form>
          <button
            onClick={sendOTP}
            className="my-2 bg-fuchsia-800 w-3/4 sm:w-3/5 md:w-1/2 lg:w-1/3 py-2 px-12 text-white rounded-xl"
          >
            Send OTP
          </button>
        </div>
      )}
    </div>
  );
};

export default VerifyPassword;
