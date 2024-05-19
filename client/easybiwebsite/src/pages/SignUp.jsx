import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import ClipLoader from "react-spinners/ClipLoader";

const SignUp = () => {
  const navigate = useNavigate();
  const section1 = useRef(null);

  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [nameValid, setNameValid] = useState(false);
  const [userNameValid, setUserNameValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [contactValid, setContactValid] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showpassword, setShowPassword] = useState(false);
  const eye = require("../assets/eye.png");
  const hidden = require("../assets/hidden.png");

  const [cookie, setCookie] = useCookies(["verification"]);

  const scrollToDiv = (divTarget) => {
    if (divTarget.current) {
      divTarget.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // REGEX
  const NAME_REGEX = /^[a-zA-Z ].{1,24}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,24}$/;
  const USERNAME_REGEX = /^[a-zA-Z ].{1,24}$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const CONTACT_REGEX = /^\+[0-9]{10,15}$/;

  // STYLING FOR INVADILITY
  const [nameColor, setNameColor] = useState("#ddd");
  const [userNameColor, setUserNameColor] = useState("#ddd");
  const [emailColor, setEmailColor] = useState("#ddd");
  const [passwordColor, setPasswordColor] = useState("#ddd");
  const [contactColor, setContactColor] = useState("#ddd");

  const emailChanged = (text) => {
    setEmail(text);
    setEmailValid(EMAIL_REGEX.test(text));
    setEmailColor(EMAIL_REGEX.test(text) || email === "" ? "#ddd" : "red");
  };

  const passwordChanged = (text) => {
    setPassword(text);
    setPasswordValid(PWD_REGEX.test(text));
    setPasswordColor(PWD_REGEX.test(text) || password === "" ? "#ddd" : "red");
  };

  const nameChanged = (text) => {
    setName(text);
    setNameValid(NAME_REGEX.test(text));
    setNameColor(NAME_REGEX.test(text) || name === "" ? "#ddd" : "red");
  };

  const contactChanged = (text) => {
    setContact(text);
    setContactValid(CONTACT_REGEX.test(text));
    setContactColor(
      CONTACT_REGEX.test(text) || contact === "" ? "#ddd" : "red"
    );
  };

  const userNameChanged = (text) => {
    setUserName(text);
    setUserNameValid(USERNAME_REGEX.test(text));
    setUserNameColor(
      USERNAME_REGEX.test(text) || userName === "" ? "#ddd" : "red"
    );
  };

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const handleSubmit = () => {
    if (
      nameValid &&
      emailValid &&
      passwordValid &&
      userNameValid &&
      contactValid &&
      uploading === false
    ) {
      const removeTrailingWhitespace = (str) => {
        let i = str.length - 1;

        while (i >= 0 && str.charAt(i) === " ") {
          i--;
        }

        return str.slice(0, i + 1);
      };
      const data = {
        Name: removeTrailingWhitespace(name),
        UserName: removeTrailingWhitespace(userName),
        Email: removeTrailingWhitespace(email),
        Password: removeTrailingWhitespace(password),
        DateCreated: currentDate,
        UserImageUrl: "",
        Contact: removeTrailingWhitespace(contact),
      };
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7); // Handle form submission, e.g., send data to the server
      axios.post("http://localhost:3000/verify", data).then((response) => {
        const res = response.data;
        if (res.proceed) {
          data.VerificationID = res.verificationID;
          setCookie("verification", data, {
            expires: expirationDate,
          });
          navigate("/Verify");
        } else {
          setTimeout(() => {
          setUploading(false);
        }, 3000);
          setErrorMessage(res.message);
        }
      });
    } else {
      setTimeout(() => {
          setUploading(false);
        }, 3000);
      setErrorMessage("PLEASE FILL IN ALL THE FIELDS CORRECTLY");
    }
  };

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "purple",
  };

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
      <div>
        <div className="flex flex-row  justify-center items-center w-full mt-8  ">
          <div className="font-semibold text-3xl text-custom-purple">Easy</div>
          <div className="font-semibold text-3xl ">Bi</div>
        </div>
        <div className="flex justify-center items-center flex-col">
          <div className="text-4xl 4xs:text-2xl 2xs:text-2xl font-semibold mt-24 4xs:mt-10">
            Welcome To EasyBi
          </div>
          <div className="text-gray-500 text-xs text-center  m-4">
            Sign Up to EasyBi and search for services and places
          </div>
        </div>
      </div>
      {errorMessage ? (
        <div className="bg-bg-yellow-300 my-5 flex justify-center items-center">
          <div className="bg-red-600 px-8 py-[4px] rounded">
            <div className="text-white font-medium text-sm">
              {errorMessage}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="flex-col flex items-center justify-between 4xs:mt-[5%]">
        <form className="h-[400px] flex  justify-center w-full">
          <div className="h-[380px] flex justify-between flex-col 4xs:w-4/5 sm:w-3/5 md:w-2/4 lg:w-1/3">
            <label
              className="border text-xs rounded pb-2 px-4"
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
              className="border text-xs rounded pb-2 px-4"
              style={{ borderColor: userNameColor }}
            >
              <input
                type="text"
                required
                value={userName}
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
              className="border text-xs rounded pb-2 px-4"
              style={{ borderColor: emailColor }}
            >
              <input
                value={email}
                type="email"
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
            <label
              className="border text-xs rounded pb-2 px-4"
              style={{ borderColor: contactColor }}
            >
              <input
                type="phone"
                required
                value={contact}
                className=" w-full placeholder:text-xs pl-5 py-4 active:bg-transparent focus:outline-none active:bg-white"
                placeholder="Contact"
                onChange={(e) => {
                  contactChanged(e.target.value);
                }}
                onBlur={() => {
                  contactChanged(contact);
                }}
              />
            </label>
            {contactColor === "red" ? (
              <div className=" my-1 flex justify-center items-center">
                <div className="text-xs text-red-500">
                  Contact should be in this format +254XXXXXXX
                </div>
              </div>
            ) : (
              <></>
            )}

            <label
              className="border text-xs rounded pb-2 px-4 pt-2 flex flex-row content-center items-center justify-between"
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
          </div>
        </form>
        <button
          onClick={() => {
            scrollToDiv(section1);
            setUploading(true);
            handleSubmit();
          }}
          className="my-2   w-3/4 sm:w-3/5 md:w-1/2 lg:w-1/3 py-2 px-12 bg-fuchsia-800 text-white rounded-xl"
        >
          Sign Up
        </button>
      </div>
      <div className="flex flex-row justify-center items-center w-full mt-4 mb-20 ">
        <div className="text-#ddd-600 text-sm mr-2">
          Account already exists?
        </div>
        <Link to="/signIn" className="text-fuchsia-800 text-sm">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
