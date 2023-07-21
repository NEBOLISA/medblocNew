import React, { useCallback, useEffect, useRef, useState } from "react";

import { CiCircleMore } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { AiOutlineLeft } from "react-icons/ai";
import { AiOutlineRight } from "react-icons/ai";
import "./dashboard.css";
import Calendar from "react-calendar";
import NavComponent from "./components/navComponent";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,GIT 
  getDocs,
  addDoc,
  doc,
  query,
  orderBy,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import axios from "axios";
import { useServiceProviderValue } from "../ServiceProvider";
import abi from "../abi.json";
import { ethers } from "ethers";
import { RiArrowDropDownFill } from "react-icons/ri";

//rescue kenneth
export default function DoctorsDashboard() {
  const navigator = useNavigate();
  const [isDropOpen, setIsDropOpen] = useState(false);
  const [retrievedData, setRetrievedData] = useState(null);
  const [snapshot, setSnapshot] = useState("");

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate();
  let concatCurrentDate = `${year}-${month}-${day}`;
  const [{ allpatients, not_title }, dispatch] = useServiceProviderValue();
  let token = localStorage.getItem("doctorToken");
  let doctorID = localStorage.getItem("doctor_id");
  const [date, setDate] = useState(new Date());
  const [patients, setPatients] = useState([]);
  const [getPatientsList, setPatientList] = useState([]);
  const [open, setOpen] = useState(
    Array.from({ length: getPatientsList.length }, () => false)
  );
  const [noNameMatch, setNoNameMatch] = useState("");
  const [noNameCheck, setNoNameCheck] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState(true);
  const options = { month: "short", year: "numeric" };
  const options2 = { day: "numeric", weekday: "long" };
  const mobileMenuRef = useRef();
  const [connButtonText, setConnButtonText] = useState("Connect to Metamask!");
  const [errorMessage, setErrorMessage] = useState(null);
  let contractAddress = "0xB8f1ed9Adca8c6863B3da364B1b332B51462BA06";
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [getForm, setGetForm] = useState("");
  const [doctor_Name, setDoctorName] = useState("");
  const [doctor_Image, setDoctorImage] = useState("");
  const [doctor_Email, setDoctorEmail] = useState("");
  const [doctor_gender, setDoctorGender] = useState("");
  const [doctor_Age, setDoctorAge] = useState("");
  const [doctor_ID, setDoctorID] = useState("");
  const [doctor_License, setDoctorrLicense] = useState("");
  const [doctor_First_Name, setDoctorFirstName] = useState("");
  const [doctor_Last_Name, setDoctorLastName] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNames, setFilteredNames] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnectedWallet(true);
          console.log(defaultAccount);
          localStorage.setItem(
            "defaultAccount",
            JSON.stringify(defaultAccount)
          );
          updateEthers();
          // setConnButtonText('Wallet Connected');
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };
  const selectedyear = date.getFullYear();
  const selectedmonth = (date.getMonth() + 1).toString().padStart(2, "0");
  const selectedday = date.getDate().toString().padStart(2, "0");

  let formattedDate = `${selectedyear}-${selectedmonth}-${selectedday}`;
  console.log(formattedDate);
  const updateEthers = async () => {
    try {
      if (window.ethereum && window.ethereum.isMetaMask) {
        const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);

        const tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        const tempContract = new ethers.Contract(
          contractAddress,
          abi,
          tempSigner
        );
        // console.log(tempContract);
        if (tempContract) {
          // Store necessary information from the contract
          const contractInfo = {
            address: contractAddress,
            abi: abi,
          };

          // Store the contract information in local storage

          setContract(tempContract);
        }
      } else {
        console.error(
          "Please install MetaMask or use a compatible Ethereum browser extension."
        );
      }
    } catch (error) {
      console.error("Error updating Ethers:", error);
    }
  };

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    updateEthers();
  };

  useEffect(() => {
    updateEthers();
    connectWalletHandler();
  }, []);

  localStorage.setItem("contract", contract);

  let checkEffectDOB = localStorage.getItem("doctor_DOB");

  let checkEffectGender = localStorage.getItem("doctor_gender");

  let checkEffectLicense = localStorage.getItem("doctor_license");

  let checkEffectEmail = localStorage.getItem("doctor_email");

  let checkEffectImage = localStorage.getItem("doctor_image");

  let checkEffectName = localStorage.getItem("doctor_name");

  useEffect(() => {
    localStorage.setItem("defaultAccount", JSON.stringify(defaultAccount));
  }, [defaultAccount]);

  // let checkEffectwallet = localStorage.getItem("doctor_walletId");
  // const closeOpenMenus = useCallback(
  //   (e) => {
  //     if (
  //       mobileMenuRef.current &&
  //       open &&
  //       !mobileMenuRef.current.contains(e.target)
  //     ) {
  //       setOpen(false);
  //     }
  //   },
  //   [open]
  // );
  const handleAction = (index) => {
    dispatch({ type: "SET_CLICKED_INDEX", index: index });
    navigator("/DoctorsRecords");
  };

  const getAllPatients = async () => {
    const response = await axios
      .get(`https://medbloc-api.onrender.com/api/v1/patient/`, {
        headers: {
          "x-auth-token": token,
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        const patientsData = res.data;
        localStorage.setItem("patient_list", JSON.stringify(patientsData));

        setPatients(res.data);
      })
      .catch((error) => {});
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    const filtered = getPatientsList.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setPatientList(filtered);
    if (searchTerm === "" && filtered.length === []) {
      const storedPatientList = localStorage.getItem("patient_list");
      const parsedPatientList = JSON.parse(storedPatientList);
      setPatientList(parsedPatientList);
    } else if (searchTerm !== "" && filtered.length === 0) {
      setNoNameCheck(true);
      setNoNameMatch("Name not found!");
    } else if (filtered.length === 0 && searchTerm === "") {
      setNoNameCheck(false);
      setNoNameMatch("");
      const storedPatientList = localStorage.getItem("patient_list");
      const parsedPatientList = JSON.parse(storedPatientList);
      setPatientList(parsedPatientList);
    } else if (filtered.length !== 0 && searchTerm === "") {
      const storedPatientList = localStorage.getItem("patient_list");
      const parsedPatientList = JSON.parse(storedPatientList);
      setPatientList(parsedPatientList);
    }
  };

  useEffect(() => {
    getAllPatients();
    const storedPatientList = localStorage.getItem("patient_list");
    const parsedPatientList = JSON.parse(storedPatientList);
    setPatientList(parsedPatientList);

    const getDoctorsDetails = async () => {
      let DoctorEmail = localStorage.getItem("doctorEmail");
      const response = await axios
        .get(`https://medbloc-api.onrender.com/api/v1/doctor/`, {
          headers: {
            "x-auth-token": token,
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((res) => {
          console.log(res);
          const res1 = res?.data.find((item) => item.email === DoctorEmail);
          console.log(res1);
          localStorage.setItem("doctor_image", res1?.image);
          localStorage.setItem("doctor_name", res1?.name);
          localStorage.setItem("doctor_email", res1?.email);
          localStorage.setItem("doctor_gender", res1?.gender);
          localStorage.setItem("doctor_DOB", res1?.dateOfBirth);
          localStorage.setItem("doctor_ID", res1?._id);
          localStorage.setItem("doctor_address", res1?.address);
          localStorage.setItem("doctor_license", res1?.license);
          localStorage.setItem("doctor_country", res1?.country);
          localStorage.setItem("doctor_number", res1?.phoneNumber);
          localStorage.setItem("doctor_origin", res1?.stateOfOrigin);
          localStorage.setItem("doctor_residence", res1?.stateOfResidence);
          localStorage.setItem("doctor_wallet", res1?.walletId);
          localStorage.setItem("doctor_hospital", res1?.hospital);
          localStorage.setItem("doctor_firstname", res1?.firstName);
          localStorage.setItem("doctor_lastname", res1?.lastName);

          let doctor_Last_Name = localStorage.getItem("doctor_lastname");
          let doctor_FirstName = localStorage.getItem("doctor_firstname");
          let doctor_Image = localStorage.getItem("doctor_image");
          let doctor_Name = localStorage.getItem("doctor_name");
          let doctor_Email = localStorage.getItem("doctor_email");
          let doctor_gender = localStorage.getItem("doctor_gender");
          let doctor_DOB = localStorage.getItem("doctor_DOB");
          let doctor_ID = localStorage.getItem("doctor_ID");

          setDoctorLastName(doctor_Last_Name);
          setDoctorFirstName(doctor_FirstName);
          setDoctorID(doctor_ID);
          setDoctorAge(doctor_DOB);
          setDoctorImage(doctor_Image);
          setDoctorGender(doctor_gender);
          setDoctorName(doctor_Name);
          setDoctorEmail(doctor_Email);

          let doctor_license = localStorage.getItem("doctor_license");
          let doctor_number = localStorage.getItem("doctor_number");

          setDoctorrLicense(doctor_license);
        })
        .catch((error) => {
          console.error(error.message);
        });

      // const res = response?.data.find((item) => item._ === doctorEmail);
      // console.log(res);
    };
    // connectWalletHandler();
    // updateEthers();
    getDoctorsDetails();

    // document.addEventListener("mousedown", closeOpenMenus);
  }, [
    //closeOpenMenus,

    checkEffectDOB,
    checkEffectEmail,
    checkEffectGender,
    checkEffectImage,
    checkEffectLicense,
    checkEffectName,
  ]);

  const handleButtonClick = (index) => {
    const updatedOpenStates = [...open];
    updatedOpenStates[index] = !updatedOpenStates[index];
    setOpen(updatedOpenStates);
  };
  const handleButtonClick2 = () => {
    setOpen2(!open2);
  };

  const retrieveData = async () => {
    let doctor_Name = localStorage.getItem("doctor_name");
    let doctor_Email = localStorage.getItem("doctor_email");
    try {
      const userDocRef = doc(db, "Appointments", doctor_Email);
      const userDataCollectionRef = collection(userDocRef, `My Appointments`);

      const snapshot = await getDocs(userDataCollectionRef);

      const userData = [];

      snapshot.forEach((doc) => {
        userData.push({ id: doc.id, ...doc.data() });
      });

      setRetrievedData(userData);
      console.log("Retrieved data:", userData);
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  };
  useEffect(() => {
    retrieveData();
  }, [date]);
  function formatTimeRange(timeRange) {
    const [startTime, endTime] = timeRange.split("-");
    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);
    return `${formattedStartTime}-${formattedEndTime}`;
  }

  function formatTime(time) {
    const [hours, minutes] = time.split(":");
    const parsedHours = parseInt(hours, 10);
    const formattedHours = parsedHours % 12 === 0 ? 12 : parsedHours % 12;
    const period = parsedHours >= 12 ? "pm" : "am";
    return `${formattedHours}:${minutes}${period}`;
  }

  let CurrentAppointment = retrievedData?.filter(
    (item) => item?.selectedDate == formattedDate
  );
  console.log(CurrentAppointment);
  console.log(formattedDate);
  const handleAddCargo = (e) => {};
  console.log(patients);
  return (
    <div className="doctorsdashboard">
      <NavComponent
        name={doctor_Name}
        firstName={doctor_First_Name}
        image={doctor_Image}
      />

      {connectedWallet ? (
        <main>
          <div className="left_side_wrapper">
            <div className="left-side">
              <div className="header_div">
                <h2 className="title">Patient List</h2>
                <div className="search_div">
                  <input
                    className="doc_search"
                    type="text"
                    onChange={handleSearch}
                    value={searchTerm}
                    placeholder="Search"
                  />
                  <CiSearch className="search_icon" />
                </div>
              </div>
              <div className="title_div">
                <p>File no.</p>
                <p>Patient Name</p>
                <p></p>
              </div>

              <div className="patients_div">
                {getPatientsList?.map((patient, index) => {
                  return (
                    <div className="patients_info" key={patient?._id}>
                      <p>#{parseInt(index) + 1}</p>
                      <p>
                        {/* {patient?.name ||
                          patient?.firstName + " " + patient?.lastName ||
                          " No Name"} */}
                        {patient?.name
                          ? patient?.name ||
                            patient?.firstName + " " + patient?.lastName
                          : "Anonymous"}
                      </p>
                      <CiCircleMore
                        className="circle_more"
                        onClick={() => handleButtonClick(index)}
                      />
                      {open[index] && (
                        <div class="dropdown" ref={mobileMenuRef}>
                          <ul>
                            <li onClick={() => handleAction(patient?._id)}>
                              Patients medical record
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
                {noNameCheck && (
                  <p style={{ textAlign: "center", marginTop: "20%" }}>
                    {noNameMatch}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="right-side">
            <div className="calendar-container">
              <Calendar
                onClickDay={handleAddCargo}
                onChange={setDate}
                value={date}
              />
            </div>
            <div className="schedule_div">
              <div className="schedule_wrapper">
                <div className="top">
                  <Link to="/DocSchedule" className="link">
                    <button>Schedule</button>
                  </Link>

                  <p>{date.toLocaleDateString("en-us", options)}</p>
                </div>
                <div className="middle">
                  <p>{date.toLocaleDateString("en-us", options2)}</p>
                </div>
                <div>
                  {CurrentAppointment?.length !== 0 ? (
                    CurrentAppointment?.map((item) => {
                      return (
                        <div className="appointment_brief">
                          <p>{item.title}</p>
                          <p>
                            {formatTimeRange(
                              `${item.startTime}-${item.endTime}`
                            )}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="appointment_brief">
                      <p>No Appointment for today!!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <div className="doc_connect_div">
          <p>You are not yet connected, Please click the button to connect</p>
          <button className="doc_connect_btn" onClick={connectWalletHandler}>
            {connButtonText}
          </button>
        </div>
      )}
      {/* <Finish contract={contract}/> */}
    </div>
  );
}
// rescue kenneth
