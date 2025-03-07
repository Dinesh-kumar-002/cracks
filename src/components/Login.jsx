import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Spinner,
} from "@radix-ui/themes";
import { GiCheckMark } from "react-icons/gi";
import { useForm } from "react-hook-form";
import { GrLinkPrevious } from "react-icons/gr";
import OtpInput from "react-otp-input";
import "./login.css";
import signUpToggle from "../store/signUpToggle";
import loginOffcanvas from "../store/loginOffcanvas";
import cartToggle from "../store/cartToggle";
import Cookies from "universal-cookie";
import userLoginStatus from "../store/userLoginStatus";
import { toast } from 'react-toastify';

  


function Login() {
    const {loginStatus,setLogin,setLoginStatus,refreshLoginStatus}= userLoginStatus();
    const {loginOffcanvasStatus,loginOffcanvasStatusToggle}=loginOffcanvas();
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [otpError, setOtpError] = useState("");
    const [verifyButtonContent,setVerifyButtonContent]=useState("verify");
    const [emailSet, setEmailSet] = useState(false);
    const [otpHide, setOtpHide] = useState(true);
    const [otpSent, setOtpSent] = useState(false);
    const {signUpStatus, signUpStatusToggle } = signUpToggle();
    const [countDownTime, setCountDownTime] = useState({
      minutes: 0,
      seconds: 0,
    });
    const [isCounting, setIsCounting] = useState(false);
  
    const otpResponse = async () => {
      await axios
        .post("https://myhitech.digitalmantraaz.com/api/verfiy-otp", {
          email,
          otp,
        })
        .then((otp) => {
          console.log(otp);
          setEmailSet(true);
          setOtpHide(true);
          
          // console.log("OTP success",otp.data.success);
          if(otp.data.success){
            setOtpError(otp.data.message);
            setEmailError("");
            setLogin(email);
            const loginCookie = new Cookies(null, { path: "/" });
            const userCookieEmail = email;
            // console.log(userCookieEmail);
        
            if (!loginCookie.get("userCookieEmail")) {
            loginCookie.set("userCookieEmail", userCookieEmail);
            }
            setLoginStatus();
            setEmail("");
            refreshLoginStatus();
            setVerifyButtonContent(<GiCheckMark />);
            loginOffcanvasStatusToggle();
            toast.success("Login Successfull",{position: "bottom-center",autoClose: 2500});
          }
          setOtpError(otp.data.message);
          
        })
        .catch((error) => {
          // console.log("Error verifying OTP:", error);
          setOtpError(error.response.data.message);
        });
    };
  
    useEffect(() => {
      if (otp.length == 6) {
        setOtpSent(true);
        setOtpError("please wait...");
        otpResponse();
      } else {
        setOtpError("");
        setOtpSent(false);
      }
    }, [otp]);
  
    useEffect(() => {
      if (!isCounting) return;
  
      const interval = setInterval(() => {
        setCountDownTime((prevTime) => {
          if (prevTime.minutes === 0 && prevTime.seconds === 0) {
            clearInterval(interval);
            setIsCounting(false);
            setEmailSet(false);
            setVerifyButtonContent("Verify");
            return { minutes: 0, seconds: 0 };
          }
  
          const newSeconds = prevTime.seconds === 0 ? 59 : prevTime.seconds - 1;
          const newMinutes =
            prevTime.seconds === 0 ? prevTime.minutes - 1 : prevTime.minutes;
  
          return { minutes: newMinutes, seconds: newSeconds };
        });
      }, 1000);
  
      return () => clearInterval(interval);
    }, [isCounting]);
  
    async function sendVerifyCode() {
      setVerifyButtonContent(<Spinner size="3" />)
      setOtp("");
      setOtpSent("");
      try {
        const response = await axios.post(
          "https://myhitech.digitalmantraaz.com/api/login-verify",
          { email }
        );
        const responseData = response.data;
  
        if (responseData.success) {
          setCountDownTime({ minutes: 0, seconds: 10 });
          setIsCounting(true);
          setEmailSet(true);
          setOtpHide(false);
          setEmailError("");
        } else {
          setEmailSet(false);
          setEmailError(responseData.message);
        }
        // console.log(emailSet);
        
      } catch (error) {
        // console.log("Error verifying OTP:", error);
        setEmailError(error.response?.data?.message || "Something went wrong");
        setVerifyButtonContent("verify");
      }
    }
   
  return (
    <div>
         <div
      className="p-5 fixed top-16 right-0 h-full bg-black z-9"
      style={{ display: loginOffcanvasStatus ? "block" : "none" }}
    >
      <div className="flex justify-between mb-2">
        <button onClick={loginOffcanvasStatusToggle}>
          <GrLinkPrevious />
        </button>
        <h1 className="text-[20px] mb-5">Login</h1>
      </div>


       
        <div>
          <div className="flex shadow-sm">
            <input
              type="text"
              placeholder="Email ID"
              disabled={emailSet}
              className="block w-full !border-e-0 !rounded-tr-none !rounded-br-none"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
             
            />
            <button
              type="button"
              disabled={emailSet}
              className={`px-2 bg-green-600 text-white disabled:opacity-50 h-[36px]`}
              onClick={sendVerifyCode}
            >
              {verifyButtonContent}
            </button>
          </div>
        </div>
        <span className="text-start !mb-0 text-red-500 font-bold">{emailError}</span>
        <p className="text-center mb-1 text-green-600" style={{ display: isCounting ? "block" : "none" }}>
          OTP has been sent (Resend OTP in {countDownTime.minutes}:
          {countDownTime.seconds < 10
            ? `0${countDownTime.seconds}`
            : countDownTime.seconds}
          )
        </p>
        {otpHide ? (
          ""
        ) : (
          <div className="mt-0">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              containerStyle={{ justifyContent: "center" }}
              renderSeparator={<span className="error">&nbsp;&nbsp;</span>}
              renderInput={(props) => (
                <input
                  {...props}
                  style={{ width: "2rem", textAlign: "center" }}
                  type="number"
                />
              )}
            />
            <p className="text-center text-green-600 mb-2 text-[15px]">
              {otpSent ? "" : `Enter OTP (One Time Password)`}
            </p>
          </div>
        )}
        <p className="text-center text-green-600 text-[15px]">{otpError}</p>
       

      <div
        style={{
          display: "flex",
          marginTop: 20,
          justifyContent: "center",
        }}
      >
       
        {/* <button className="bg-green-600 px-3 py-2 green" style={{borderRadius:"none"}} type="submit">Login</button> */}
      </div>
        <p className="text-center mt-4 text-gray-500" onClick={()=>{signUpStatusToggle();loginOffcanvasStatusToggle()}}>Dont have account? / <span className="text-green-500">Register</span></p>
    </div>
    </div>
  )
}

export default Login