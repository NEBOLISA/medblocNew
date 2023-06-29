import React, { useState } from "react";
import "./login.css";
import { BsArrowLeft } from "react-icons/bs";
import bigImage from "../assets/signup-second.png";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StateContext from "../stateProvider/stateprovider";
import { useContext } from "react";
import axioscall from "../api/secondApi";
import { useServiceProviderValue } from "../ServiceProvider";
import newlogo from "../assets/newlogo2.png";

const validEmailRex = new RegExp(
  "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
);
const PWD_REGEX = new RegExp("^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$");
const DOCTOR_LOGIN = "/doctor/login";
const PATIENT_LOGIN = "/patient/login";

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useContext(StateContext);
  const handle = () => {
    navigate(-1);
  };
  const [{ user, login }, dispatch] = useServiceProviderValue();

  const { state } = useLocation();
  // console.log(state.state.value);

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [makeVisible, setMakeVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errmsg, setErrMsg] = useState("");

  const handleVisibleChange = () => {
    setMakeVisible(!makeVisible);
  };
  let DOCTOR_ITEM = localStorage.getItem("doctorEmail");
  let PATIENT_ITEM = localStorage.getItem("patientEmail");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let valid1 = validEmailRex.test(userEmail);
    let valid2 = PWD_REGEX.test(userPassword);
    if (!valid1 || !valid2) {
      setErrorMessage("invalid input,put in your correct email and password");

      return;
    }
    const DoctorData = {
      email: userEmail,
      password: userPassword,
    };
    const PatientData = {
      email: userEmail,
      password: userPassword,
    };
    if (user === "doctor") {
      try {
        const response = await axioscall.post(
          DOCTOR_LOGIN,
          JSON.stringify(DoctorData),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            // withCredentials: true,
          }
        );
        // console.log(response.data.token);

        // const userStringify = JSON.stringify(userdetails);
        localStorage.setItem("doctorToken", response?.data.token);
        localStorage.setItem("doctorEmail", response?.data.email);

        setIsLoading(false);
        setAuth({
          userEmail: response?.data.email,
          doctorToken: response?.data.token,
        });
        setUserEmail("");
        setUserPassword("");
        const item = localStorage.getItem("doctorToken");
        console.log(response?.data);
        if (item) {
          navigate("/DocDashboard");
        } else if (!item) {
          // navigate("./landing");
          console.log("to landing");
        }
      } catch (err) {
        if (!err?.response) {
          setErrMsg("No Server Response");
          setIsLoading(false);
          // setAuth({
          //   userEmail,
          //   userPassword,
          //   patientToken: response?.data.token,
          // });
          setUserEmail("");
          setUserPassword("");
          const item = localStorage.getItem("userdetails");
          // const toParse = JSON.parse(item.token);
          //note kenneth above
        } else if (err.response?.status === 409) {
          setErrMsg("Username Taken");
          setIsLoading(false);
        } else if (err.response.status === 400) {
          setErrMsg(
            "invalid user, please sign up if you are new to this plateform"
          );
          setIsLoading(false);
          console.log(errmsg);
        } else if (err.response?.status === 204) {
          setErrMsg("the server failed to load a response");
          setIsLoading(false);
        } else {
          setErrMsg("Registration Failed");
          setIsLoading(false);
        }
      }
    } else if (user === "patient") {
      try {
        const response = await axioscall.post(
          PATIENT_LOGIN,
          JSON.stringify(PatientData),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            // withCredentials: true,
          }
        );

        const userdetails = {
          token: response?.data.token,
          email: response?.data.email,
        };
        console.log(response?.data);

        // const userStringify = JSON.stringify(userdetails);
        localStorage.setItem("patientToken", response?.data.token);
        localStorage.setItem("patient_email", response?.data.email);

        setIsLoading(false);
        setAuth({
          userEmail,
          userPassword,
          patientToken: response?.data.token,
        });
        setUserEmail("");
        setUserPassword("");
        const item = localStorage.getItem("patientToken");
        // const toParse = JSON.parse(item.token);

        if (item) {
          navigate("/Dashboard");
        } else if (!item) {
          // navigate("./landing");
          console.log("to landing");
        }
      } catch (err) {
        if (!err?.response) {
          setErrMsg("No Server Response");
          setIsLoading(false);
        } else if (err.response?.status === 409) {
          setErrMsg("Username Taken");
          setIsLoading(false);
        } else if (err.response?.status === 204) {
          setErrMsg("the server failed to load a response");
          setIsLoading(false);
        } else if (err.response?.status === 400) {
          setErrMsg(
            err +
              " " +
              "invalid user, please sign up if you are new to this plateform"
          );
          setIsLoading(false);
        } else {
          setErrMsg("Registration Failed");
          setIsLoading(false);
          console.log(errmsg);
        }
      }
    }
  };
  return (
    <div className="first-container confirmation">
      <div className="sign-up-container">
        <div className="signup-form length">
          {/* <BsArrowLeft onClick={handle} style={{ cursor: "pointer" }} /> */}
          <div>
            <img src={newlogo} alt="medblog" />
          </div>
          <h2>Login</h2>
          <p>Please enter your login details to sign in.</p>
          <form className="form" onSubmit={handleLogin}>
            {errorMessage ? (
              <p style={{ color: "red" }}>{errorMessage} </p>
            ) : (
              ""
            )}

            {errmsg && <p style={{ color: "red" }}>{errmsg}</p>}
            <div class="input">
              <label>Email Address</label>
              <input
                type="text"
                placeholder="chimuanyaruth20@gmail.com"
                onChange={(e) => setUserEmail(e.target.value)}
                value={userEmail}
                required
              />
            </div>
            <div class="input">
              <label>
                Password
                <FontAwesomeIcon
                  icon={makeVisible ? faEye : faEyeSlash}
                  className="password-toggle"
                  onClick={handleVisibleChange}
                />
              </label>
              <input
                type={makeVisible ? "text" : "password"}
                placeholder="password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                required
              />
            </div>
            <div className="diverge">
              <div className="diverge-1">
                <input type="checkbox" />
                <span>Keep me logged in</span>
              </div>
              <div>
                <Link to="/forgotPassword" className="linky">
                  <span>Forgot password?</span>
                </Link>
              </div>
            </div>
            {isLoading ? (
              <button>loading...</button>
            ) : (
              <button
                className="btn"
                type="submit"
                disabled={!userEmail || !userPassword}
              >
                Log in
              </button>
            )}
          </form>
          <p className="create-account">
            Don’t have an account?
            <Link to="/confirmation" className="wallet-link2">
              <span>sign up</span>
            </Link>
          </p>
        </div>
        <div className="image-placeholder">
          <img src={bigImage} alt="big" />
        </div>
      </div>
    </div>
  );
}
