import React, { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

import { useNavigate } from "react-router-dom";

function Verify() {
  const [cookie] = useCookies(["verification"]);
  const [userCookie,setCookies] = useCookies(["user"]);

  const [verification, setVerification] = useState();
  const [uploading, setUploading] = useState(false);
  const [trialCode, setTrialCode] = useState();
  const [denied, setDenied] = useState();
  const navigate = useNavigate();

  const section1 = useRef(null);

  const scrollToDiv = (divTarget) => {
    if (divTarget.current) {
      divTarget.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const start = async () => {
    const verification = await cookie.verification;
    setVerification(verification);
  };

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "purple",
  };

  const handleVerification = async () => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    await axios
      .get(
        `http://localhost:3000/verifyCode/${
          verification.VerificationID
        }/${parseInt(trialCode)}`
      )
      .then(async (res) => {
        if (res.data.proceed) {
          await axios
            .post(`http://localhost:3000/createUser`, {
              verification,
            })
            .then((res) => {
              const data = {
                Email: res.data.data.Email,
                Name: res.data.data.Name,
                UserID: res.data.data.UserID,
                UserImageUrl: res.data.data.UserImageUrl,
                UserName: res.data.data.UserName,
              };
              
              setCookies("user", data, {
                expires: expirationDate,
              });
              alert("Login Successful");
              //remember to add navigation to the page that called navigate()
              navigate("/");
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          setUploading(false);
          setDenied(true);
        }
      });
  };

  useEffect(() => {
    start();
  }, []);

  const shieldpng = require("../assets/shield.png");
  return (
    <div>
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
      <div className="flex justify-center h-screen w-full">
        <div className="flex flex-col items-center border-[1.5px] px-2 py-2 mt-10 md:h-[80%] h-3/4 sm:w-[45%] 4xs:w-[90%] ">
          <div className="font-semibold text-3xl">Verify</div>
          <div className="4xs:w-[80%] md:w-full text-center">
            <div className="font-semilight text-gray-500 mt-2 md:text-base text-sm">
              A verification code has been sent to email</div>
          </div>
          <div>
            <div>
              <img alt="" src={shieldpng} className="w-48 h-48" />
            </div>
          </div>
          {denied ? (
            <div className="bg-bg-yellow-300 my-5 flex justify-center items-center">
              <div className="bg-red-600 px-8 py-2 rounded-xl">
                <div className="text-white font-semibold text-sm">
                  THE CODES PROVIDED DON'T MATCH
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="w-full flex justify-center">
            <input
              style={{ borderColor: denied ? "red" : "purple" }}
              onChange={(e) => {
                setTrialCode(e.target.value);
              }}
              placeholder="Code.."
              className="border-[1.5px] pl-7 py-2 rounded-2xl  border-fuchsia-800"
            />
          </div>
          <div
            role="button"
            onClick={() => {
              scrollToDiv(section1);
              setUploading(true);
              handleVerification();
            }}
            className="hover:scale-105 transition-transform duration-200 mt-10 w-20 flex 
            items-center justify-center px-20 py-2 rounded-3xl bg-black shadow-xl border-fuchsia-800"
          >
            <div className="text-white">Verify</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Verify;
