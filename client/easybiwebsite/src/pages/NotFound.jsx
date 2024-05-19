// NotFound.js
import React from "react";
import { useNavigate } from "react-router-dom";


const NotFound = () => {
    const navigate=useNavigate()
  return (
    <div>
      <div className="w-full h-screen bg-stone-50">
        <div className="h-1/2  justify-center items-end flex">
          <div className="text-9xl text-stone-800">404</div>
        </div>
        <div className="h-1/6 justify-center items-center flex">
          <div className="text-stone-800">Sorry, the page you are looking for does not exist.</div>
        </div>
        <div className="justify-center items-center flex">
        <button onClick={()=>{navigate('/HomePage')}} className="bg-black hover:scale-105 transition-transform duration-700 py-2 px-14 rounded text-white">Home</button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
