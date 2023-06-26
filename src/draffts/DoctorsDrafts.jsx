import React, { useEffect, useRef, useState, useCallback } from "react";
import emptyProfile from "../assets/ava3.png";
import "./draft.css";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { TiTick } from "react-icons/ti";
import { RiNumber1 } from "react-icons/ri";
import { RiNumber2 } from "react-icons/ri";
import { RiNumber3 } from "react-icons/ri";
import { useServiceProviderValue } from "../ServiceProvider";
import { contracts } from "../hooks/UseContract";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineSetting } from "react-icons/ai";
import { RxDashboard } from "react-icons/rx";
import { TfiWrite } from "react-icons/tfi";
import { FaSpinner } from "react-icons/fa";
import { BsReverseLayoutTextSidebarReverse } from "react-icons/bs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import ourlogo from "../assets/Group 5.svg";

import { AiOutlineClose } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DoctorsDrafts() {
  const tempContract = contracts();
  const [isLoading, setIsLoading] = useState(false);
  console.log(tempContract);

  const [{}, dispatch] = useServiceProviderValue();
  const mobileNavRef = useRef();
  const [navOpen, setIsNavOpen] = useState(false);
  const toggleNav = () => {
    setIsNavOpen(!navOpen);
  };
  const navigate = useNavigate();
  const location = useLocation();
  const shouldApplyStyle = location.pathname.includes("/finish");
  const report = location.pathname.includes("/report");
  const vitals = location.pathname.includes("/");

  const handle = (e) => {
    navigate(+1);
  };

  const [
    {
      walletAddress,
      temperature,
      bloodCount,
      bloodPressure,
      glucoseLevel,
      heartRate,
      oxygen,
      respRate,
      medication,
      dosage,
      duration,
      complaints,
      comments,
      treatments,
      vaccineName,
      vaccineDate,
      vaccineStatus,
      prescriptions,
      billingDate,
      billingPatientName,
      billingProvider,
      billingLocation,
      billings,
      totalAmount,
    },
  ] = useServiceProviderValue();
  console.log(walletAddress);
  const handleWalletAddress = (e) => {
    dispatch({ type: "SET_PATIENT_ADDRESS", walletAddress: e.target.value });
  };
  // console.log(vaccineStatus);

  const saveRecords = async () => {
    setIsLoading(true);
    try {
      const updateRecord = await tempContract.addPatientRecord(
        walletAddress,
        [
          temperature,
          heartRate,
          respRate,
          oxygen,
          bloodPressure,
          bloodCount,
          glucoseLevel,
        ],
        [complaints, comments, treatments],
        [vaccineName, vaccineDate, vaccineStatus],
        [prescriptions[0].med, prescriptions[0].dur, prescriptions[0].dos],
        [billingDate, billingPatientName, billingProvider, billingLocation],
        [
          billings[0].serviceType,
          billings[0].serviceCharge,
          billings[0].subTotal,
          billings[0].tax,
        ],
        [totalAmount]
      );
      console.log(updateRecord);
      setIsLoading(false);
      toast("Records Successfully Updated!", { autoClose: 3000 });
    } catch (error) {
      console.error("Error executing addPatientRecord:", error);
      setIsLoading(false);
      toast(error, { autoClose: 3000 });
    }
  };

  const closeOpenNav = useCallback(
    (e) => {
      if (
        mobileNavRef.current &&
        navOpen === true &&
        !mobileNavRef.current.contains(e.target)
      ) {
        setIsNavOpen(false);
      }
    },
    [navOpen]
  );
  let doctors_Image = localStorage.getItem("doctor_image");

  let doctors_Name = localStorage.getItem("doctor_name");
  const handleNext = () => {
    if (report) {
      navigate("finish");
      setNumber3(<TiTick className="tick" />);
      setNumber1(<RiNumber1 />);
      setNumber2(<RiNumber2 />);
      setIsActive1(false);
      setIsActive2(false);
      setIsActive3(true);
    } else {
      navigate("report");
      setNumber2(<TiTick className="tick" />);
      setNumber1(<RiNumber1 />);
      setNumber3(<RiNumber3 />);
      setIsActive1(false);
      setIsActive2(true);
      setIsActive3(false);
    }
  };

  let counter = 0;
  const [number1, setNumber1] = useState(<RiNumber1 />);
  const [number2, setNumber2] = useState(<RiNumber2 />);
  const [number3, setNumber3] = useState(<RiNumber3 />);
  const [isActive1, setIsActive1] = useState(false);
  const [isActive2, setIsActive2] = useState(false);
  const [isActive3, setIsActive3] = useState(false);
  const handleClick1 = (e) => {
    navigate("./");
    setNumber1(<TiTick className="tick" />);
    setNumber2(<RiNumber2 />);
    setNumber3(<RiNumber3 />);

    setIsActive1(true);
    setIsActive2(false);
    setIsActive3(false);
  };
  const handleClick2 = (e) => {
    setNumber2(<TiTick className="tick" />);
    setNumber1(<RiNumber1 />);
    setNumber3(<RiNumber3 />);
    setIsActive1(false);
    setIsActive2(true);
    setIsActive3(false);
    navigate("report");
    // const confirmed = window.confirm(
    //   "Are you sure you want to move to the next page?"
    // );
    // if (confirmed) {
    //   navigate("");
    // }
  };
  const handleClick3 = (e) => {
    setNumber3(<TiTick className="tick" />);
    setNumber1(<RiNumber1 />);
    setNumber2(<RiNumber2 />);
    setIsActive1(false);
    setIsActive2(false);
    setIsActive3(true);
    navigate("finish");
  };
  useEffect(() => {
    navigate("./");
    setNumber1(<TiTick className="tick" />);
    setIsActive1(true);
    document.addEventListener("mousedown", closeOpenNav);

    return () => {
      document.removeEventListener("mousedown", closeOpenNav);
    };
  }, []);
  return (
    <div className="doctorsdraft">
      <nav
        className={navOpen ? "patient_dashboard_nav" : "closeNav"}
        ref={mobileNavRef}
      >
        <div className="_side_Bar">
          <AiOutlineClose className="close__btn" onClick={toggleNav} />
          <div className="_center__div">
            <img
              src={ourlogo}
              style={{ width: "70px", height: "70px" }}
              alt="app-logo"
            />
          </div>

          <div className="_mid__section">
            <Link to="/DocDashboard" className="link">
              <RxDashboard style={{ color: "white" }} />
              <p>Dashboard</p>
            </Link>

            <Link to="/DocBillings" className="link">
              <FontAwesomeIcon icon={faCoins} style={{ color: "white" }} />
              <p>Billings</p>
            </Link>
            <Link to="/DocDraft" className="link">
              <TfiWrite style={{ color: "white" }} />
              <p>Draft</p>
            </Link>
          </div>
          <div className="_lower__section">
            <div
              onClick={() => {
                localStorage.removeItem("patientToken");
                localStorage.removeItem("patientEmail");
              }}
            >
              <Link to="/" className="link">
                <FiLogOut style={{ color: "white" }} />
                <p>logout</p>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <GiHamburgerMenu className="hamburger_icon" onClick={toggleNav} />
      <header className="doctorsdraft_header">
        <p className="drafts_header_left"> Add Patient Record</p>
        <div
          className={
            shouldApplyStyle
              ? "drafts_header_right"
              : "drafts_header_right_no_justify"
          }
        >
          {window.location.pathname === "/DocDraft/finish" && (
            <>
              <button
                className="draft_update_btn"
                onClick={saveRecords}
                disabled={isLoading}
              >
                {isLoading ? (
                  <FaSpinner className="spin" />
                ) : (
                  "Update Patient Portal"
                )}
              </button>
              <ToastContainer />
            </>
          )}
          <img
            src={doctors_Image ? doctors_Image : emptyProfile}
            alt="patientspicture"
          />
          <p className="drafts_profile_name">{doctors_Name}</p>
        </div>
      </header>
      <div className="navigation_section">
        <div
          className={isActive1 ? "blue link" : "number_1 circle link"}
          onClick={handleClick1}
        >
          {number1}
        </div>

        <div className="lines"></div>

        {/* ; */}

        <Link to="report" className="link">
          <div
            className={isActive2 ? "blue" : "number_2 circle"}
            onClick={handleClick2}
          >
            {number2}
          </div>
        </Link>

        <div className="lines"></div>
        <Link to="finish" className="link">
          <div
            className={isActive3 ? "blue" : "number_3 circle"}
            onClick={handleClick3}
          >
            {number3}
          </div>
        </Link>
      </div>
      <div className="nav_title">
        <p className={isActive1 ? "title_blue" : ""}>Vitals</p>
        <p className={isActive2 ? "title_blue" : ""}>Report</p>
        <p className={isActive3 ? "title_blue" : ""}>Finish</p>
      </div>
      {window.location.pathname === "/DocDraft/" && (
        <div className="grant_access_div_wrapper">
          <div className="grant_access_div">
            <input
              onChange={handleWalletAddress}
              className="access_input"
              type="text"
              value={walletAddress}
              placeholder="Enter Patients Wallet Address"
            />
            {/* <button className="access_btn">Grant Access</button> */}
          </div>
        </div>
      )}

      <Outlet className="draft_outlet" />

      <div className="report_btn_style">
        <button
          onClick={handleNext}
          className={shouldApplyStyle ? "no_btn" : "draft_next"}
        >
          Next
        </button>
      </div>
    </div>
  );
}
