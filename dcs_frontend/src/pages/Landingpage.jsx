import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Landingpage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("./login");
    }, 6000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
  <div className="h-screen flex items-center justify-center text-white overflow-hidden" style={{color: "#F8FAFC"}}>
    
    <div className="flex flex-col items-center text-center animate-fadeIn">
      
      <h1 className="text-4xl md:text-5xl font-bold tracking-widest leading-loose animate-slideUp" >
        Decision Companion System
      </h1>

      <p className="mt-4 opacity-0 animate-fadeText delay-[2000ms]" style={{color: "#598b88"}}>
        Empowering Smart Decisions...
      </p>
      <div className="flex justify-center w-full mt-10">
        <div className="w-64 h-2 bg-white/30 rounded-full overflow-hidden ">
          <div className="h-full  animate-loading" style={{backgroundColor:"#afd6d4"}}></div>
        </div>
      </div>

    </div>
  </div>
)
}

export default Landingpage;
