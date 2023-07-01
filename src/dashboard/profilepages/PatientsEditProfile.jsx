import React, { useEffect, useRef } from "react";
import "./PatientsEditProfile.css";
import emptyProfile from "../../assets/ava3.png";
import States from "../data/states";
import Months from "../data/months";
import Cities from "../data/cities";
import { useState, useMemo } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";
import { BsCameraFill } from "react-icons/bs";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

function PatientsEditProfile() {
  let patientID = localStorage.getItem("patient_ID");
  let token = localStorage.getItem("patientToken");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [NoImage, setNoImageMsg] = useState("");
  const options = useMemo(() => countryList().getData(), []);
  const [data, setData] = useState();
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedHeight, setSelectedHeight] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [selectedAlle, setSelectedAlle] = useState("");
  const [selectedGeno, setSelectedGeno] = useState("");
  const [selectedBlood, setSelectedBlood] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedNumber, setSelectedNumber] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedLastName, setSelectedLastName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMiddleName, setSelectedMiddleName] = useState("");
  const [selectedFirstName, setSelectedFirstName] = useState("");
  const [selectedWallet, setWallet] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [value, setValue] = useState("");

  const [year, setYear] = useState("");
  let thisYear = new Date().getFullYear();
  const [isLoading, setIsLoading] = useState(false);

  let allYears = [];
  // handler to set the state of value of selected country
  const changeHandler = (value) => {
    setValue(value.label);
  };
  console.log(value);
  //Handler function to set selected states
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };
  const handleFirstNameChange = (e) => {
    setSelectedFirstName(e.target.value);
  };
  const handleMiddleNameChange = (e) => {
    setSelectedMiddleName(e.target.value);
  };
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };
  const handleLastNameChange = (e) => {
    setSelectedLastName(e.target.value);
  };
  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value);
  };
  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
  };
  const handleNumberChange = (e) => {
    setSelectedNumber(e.target.value);
  };
  const handleEmailChange = (e) => {
    setSelectedEmail(e.target.value);
  };
  const handleBloodChange = (e) => {
    setSelectedBlood(e.target.value);
  };
  const handleGenoChange = (e) => {
    setSelectedGeno(e.target.value);
  };
  const handleAlleChange = (e) => {
    setSelectedAlle(e.target.value);
  };
  const handleWeigChange = (e) => {
    setSelectedWeight(e.target.value);
  };
  const handleHeightChange = (e) => {
    setSelectedHeight(e.target.value);
  };
  const handleWalletChange = (e) => {
    setWallet(e.target.value);
  };
  // handler function to set selected state
  const handleSelectedCity = (e) => {
    setSelectedCity(e.target.value);
  };
  const checkForValues = () => {
    if (
      data ||
      selectedAddress ||
      selectedAlle ||
      selectedCity ||
      selectedHeight ||
      selectedGeno ||
      selectedBlood ||
      selectedEmail ||
      selectedNumber ||
      selectedDate ||
      selectedGender ||
      selectedMiddleName ||
      selectedFirstName ||
      selectedState ||
      selectedWeight ||
      selectedLastName ||
      selectedWallet ||
      value
    ) {
      return true;
    } else {
      return false;
    }
  };
  const saveProfile = () => {
    if (checkForValues()) {
      UpdatePatientDetails();
    } else {
      setNoImageMsg("Please Enter details you wish to edit before saving");
      setTimeout(() => {
        setNoImageMsg("");
      }, 3000);
    }
  };

  let email = localStorage.getItem("patient_email");
  let password = localStorage.getItem("patient_password");
  let name = localStorage.getItem("patient_name");
  let walletId = localStorage.getItem("patient_walletId");
  let patient_Image = localStorage.getItem("patient_image");

  let patient_gender = localStorage.getItem("patient_gender");

  let patient_DOB = localStorage.getItem("patient_DOB");

  let patient_Blood = localStorage.getItem("patient_blood");

  let patient_Geno = localStorage.getItem("patient_genotype");

  let patient_Height = localStorage.getItem("patient_height");

  let patient_Weight = localStorage.getItem("patient_weight");
  let patient_address = localStorage.getItem("patient_address");
  let patient_city = localStorage.getItem("patient_city");
  let patient_country = localStorage.getItem("patient_country");
  let patient_number = localStorage.getItem("patient_number");
  let patient_state = localStorage.getItem("patient_state");
  let patient_Alle = localStorage.getItem("patient_allergies");
  let patient_First_Name = localStorage.getItem("patient_firstName");
  let patient_Last_Name = localStorage.getItem("patient_lastName");
  let patient_Middle_Name = localStorage.getItem("patient_middle_name");
  let formattedName = `${selectedFirstName || patient_First_Name} ${
    selectedLastName || patient_Last_Name
  }`;

  const UpdatePatientDetails = async () => {
    setIsLoading(true);

    const response = await axios
      .put(
        `https://medbloc-api.onrender.com/api/v1/patient/${patientID}`,
        {
          name: formattedName || name,
          email: selectedEmail || email,
          walletId: selectedWallet || walletId,
          image: data || patient_Image,
          height: selectedHeight || patient_Height,
          genotype: selectedGeno || patient_Geno,
          bloodgroup: selectedBlood || patient_Blood,
          weight: selectedWeight || patient_Weight,
          allergies: selectedAlle || patient_Alle,
          gender: selectedGender || patient_gender,
          dateOfBirth: selectedDate || patient_DOB,
          city: selectedCity || patient_city,
          country: value || patient_country,
          address: selectedAddress || patient_address,
          phoneNumber: selectedNumber || patient_number,
          state: selectedState || patient_state,
          firstName: selectedFirstName || patient_First_Name,
          lastName: selectedLastName || patient_Last_Name,
          middleName: selectedMiddleName || patient_Middle_Name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((response) => {
        console.log(response);
        localStorage.setItem("patient_image", response?.data.image);
        localStorage.setItem("patient_name", response?.data.name);
        localStorage.setItem("patient_email", response?.data.email);
        localStorage.setItem("patient_walletId", response?.data.walletId);

        localStorage.setItem("patient_gender", response?.data.gender);
        localStorage.setItem("patient_DOB", response?.data.dateOfBirth);
        localStorage.setItem("patient_blood", response?.data.bloodgroup);

        localStorage.setItem("patient_genotype", response?.data.genotype);
        localStorage.setItem("patient_height", response?.data.height);
        localStorage.setItem("patient_weight", response?.data.weight);
        localStorage.setItem("patient_address", response?.data.address);
        localStorage.setItem("patient_country", response?.data.country);
        localStorage.setItem("patient_number", response?.data.phoneNumber);
        localStorage.setItem("patient_city", response?.data.city);
        localStorage.setItem("patient_state", response?.data.state);
        localStorage.setItem("patient_allergies", response?.data.allergies);
        localStorage.setItem("patient_name", response?.data.name);
        localStorage.setItem("patient_email", response?.data.email);
        localStorage.setItem("patient_firstName", response?.data.firstName);
        localStorage.setItem("patient_lastName", response?.data.lastName);
        localStorage.setItem("patient_middleName", response?.data.middleName);

        setSuccessMsg("Details Saved Successfully");
        setTimeout(() => {
          setSuccessMsg("");
        }, 3000);

        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };
  const availableCities = Cities?.find((s) => s.name === selectedState);
  // handler to set the data of the selected image to "data" state
  const handleChange = (e) => {
    const data1 = new FileReader();

    data1.addEventListener("load", () => {
      const fileSize = data1.size; // Size in bytes
      const fileSizeInKB = Math.round(fileSize / 1024);
      if (fileSizeInKB >= 120) {
        setNoImageMsg("Please choose an image less than 120kb");
        setTimeout(() => {
          setNoImageMsg("");
        }, 3000);

        console.log(data);
      } else {
        setData(data1?.result);
        console.log("inside" + data1);
      }
    });

    if (e.target.files[0]) {
      const fileSize = e.target.files[0].size; // Size in bytes
      const fileSizeInKB = Math.round(fileSize / 1024);
      if (fileSizeInKB >= 120) {
        e.target.value = null;
        setNoImageMsg("Please choose an image less than 120kb");
        setTimeout(() => {
          setNoImageMsg("");
        }, 3000);

        console.log(e.target.files[0]);
      } else {
        data1.readAsDataURL(e.target.files[0]);
      }
    }
  };
  //function to handle year change selection
  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  // function to set style on react Select element
  const style = {
    control: (base) => ({
      ...base,
      border: 0,
      // This line disable the blue border
      boxShadow: "none",
    }),
  };
  useEffect(() => {
    let email = localStorage.getItem("patient_email");

    let walletId = localStorage.getItem("patient_walletId");

    let patient_gender = localStorage.getItem("patient_gender");

    let patient_DOB = localStorage.getItem("patient_DOB");

    let patient_Blood = localStorage.getItem("patient_blood");

    let patient_Geno = localStorage.getItem("patient_genotype");

    let patient_Height = localStorage.getItem("patient_height");

    let patient_Weight = localStorage.getItem("patient_weight");
    let patient_address = localStorage.getItem("patient_address");
    let patient_city = localStorage.getItem("patient_city");
    let patient_country = localStorage.getItem("patient_country");
    let patient_number = localStorage.getItem("patient_number");
    let patient_state = localStorage.getItem("patient_state");
    let patient_Alle = localStorage.getItem("patient_allergies");
    let patient_First_Name = localStorage.getItem("patient_firstName");
    let patient_Last_Name = localStorage.getItem("patient_lastName");
    let patient_Middle_Name = localStorage.getItem("patient_middle_name");
    console.log(patient_First_Name);
    setSelectedFirstName(patient_First_Name);
    setSelectedAddress(patient_address);
    setSelectedAlle(patient_Alle);
    setSelectedBlood(patient_Blood);
    setSelectedCity(patient_city);
    setSelectedDate(patient_DOB);
    setSelectedEmail(email);
    setSelectedGender(patient_gender);
    setSelectedGeno(patient_Geno);
    setSelectedHeight(patient_Height);
    setSelectedLastName(patient_Last_Name);
    setSelectedMiddleName(patient_Middle_Name);
    setSelectedState(patient_state);
    setSelectedNumber(patient_number);
    setSelectedWeight(patient_Weight);
    setSelectedCountry(patient_country);
    setWallet(walletId);
  }, []);

  // function to set states for state and lga selection

  return (
    <div className="patientseditprofile">
      <div className="left_side-">
        <div className="topleft-">
          <Link to="/Profile" className="link">
            <BiArrowBack className="back_arrow" />
          </Link>
          <div className="select_image_div-">
            <label for="inputTag">
              <BsCameraFill className="camera_icon-" />
              <input
                className="p_input"
                id="inputTag"
                onChange={handleChange}
                type="file"
              />
              <br />
              {data ? (
                <img
                  style={{ objectFit: "fill" }}
                  src={data}
                  alt="profileImage"
                />
              ) : (
                <img
                  src={patient_Image ? patient_Image : emptyProfile}
                  alt="profileImage"
                />
              )}
            </label>
          </div>

          <div className="profile_details-">
            <h2 className="name-">{name}</h2>
            <p className="email-">{email}</p>
            <button
              className="profile_btn-"
              onClick={saveProfile}
              disabled={isLoading}
            >
              {isLoading ? <FaSpinner className="spin" /> : "Save Changes"}
            </button>
            {
              <p style={{ color: "red", fontSize: "12px", marginTop: "3px" }}>
                {NoImage}
              </p>
            }
            {
              <p style={{ color: "green", fontSize: "12px", marginTop: "3px" }}>
                {successMsg}
              </p>
            }
          </div>
        </div>

        {/* LEFT SIDE BOTTOM LEFT */}

        <div className="_bottom_left-">
          <h1 className="header-">General Information</h1>
          <div className="_bottom_profile_details-">
            {/* BOTTOM LEFT LEFT SECTION  */}
            <div className="_left_section-">
              <h3 className="label-">First name</h3>
              <div className="input_div-">
                <p className="input_para-">
                  <input
                    className="p_input"
                    type="text "
                    onChange={handleFirstNameChange}
                    value={selectedFirstName}
                    placeholder="Enter First Name"
                  />
                </p>
              </div>
              <h3 className="label-">Middle name</h3>
              <div className="input_div-">
                <p className="input_para-">
                  <input
                    className="p_input"
                    type="text "
                    onChange={handleMiddleNameChange}
                    value={selectedMiddleName}
                    placeholder="Enter Middle Name"
                  />
                </p>
              </div>
              <h3 className="label-">Date of birth</h3>
              <div className="input_div-">
                <p className="input_label-">
                  <input
                    className="p_input"
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    placeholder="Select Date of Birth"
                  />
                </p>
              </div>
            </div>
            {/* END OF BOTTOM LEFT LEFT SECTION */}

            {/* BOTTOM LEFT RIGHT SECTION */}
            <div className="_right_section-">
              <h3 className="label-">Last name</h3>
              <div className="input_div-">
                <p className="input_para-">
                  <input
                    className="p_input"
                    onChange={handleLastNameChange}
                    value={selectedLastName}
                    type="text "
                    placeholder="Enter Last Name"
                  />
                </p>
              </div>
              <h3 className="label-">Gender</h3>
              <div className="input_div-">
                <p className="input_para-">
                  <select
                    className="select-"
                    name="gender"
                    value={selectedGender}
                    onChange={handleGenderChange}
                    id="gender" /*onChange={""}*/
                  >
                    <option disabled selected value="">
                      Select Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </p>
              </div>
              <h3 className="label-">Wallet Address</h3>
              <div className="input_div-">
                <p className="input_para-">
                  <input
                    className="p_input"
                    onChange={handleWalletChange}
                    value={selectedWallet}
                    type="text "
                    placeholder="Enter Wallet Address"
                  />
                </p>
              </div>
            </div>
            {/* END OF BOTTOM LEFT RIGHT SECTION */}
          </div>
        </div>
        <p className="warning_msg">
          <span style={{ color: "red" }}>Notice:</span> If you have more than
          one account with the same email address on file, you will not be able
          to use that email address as a username to sign in.
        </p>
        {/* END OF  LEFT SIDE BOTTOM LEFT */}
      </div>
      {/* END OF LEFT SIDE */}

      {/* RIGHT SIDE*/}
      <div className="_right_side-">
        {/* TOP RIGHT SIDE */}
        <div className="right_top_side-">
          <h1 className="header-">Contact Information</h1>
          <div className="_bottom_profile_details-">
            <div className="_left_section-">
              <h3 className="label-">Address</h3>
              <div className="input_div-">
                <p className="input_para-">
                  <input
                    onChange={handleAddressChange}
                    className="p_input"
                    value={selectedAddress}
                    type="text "
                    placeholder="Enter Address"
                  />
                </p>
              </div>
              <h3 className="label-">City</h3>
              <div className="input_div-">
                <select className="state-" onChange={handleSelectedCity}>
                  {availableCities ? (
                    availableCities?.cities.map((city, key) => (
                      <option
                        className="state_option-"
                        // onChange={handleStateChange}
                        value={city}
                        key={key}
                      >
                        {city}
                      </option>
                    ))
                  ) : (
                    <option>Select State First</option>
                  )}
                </select>
              </div>
            </div>
            <div className="_right_section-">
              <h3 className="label-">Country</h3>
              <div className="input_div- country_div-">
                <p className="input_para-">
                  <Select
                    styles={style}
                    className="react_select"
                    options={options}
                    value={value.label}
                    onChange={changeHandler}
                  />
                </p>
              </div>

              <h3 className="label-">State</h3>
              <div className="input_div-">
                <select
                  className="state-"
                  name="gender"
                  onChange={handleStateChange}
                  id="gender" /*onChange={""}*/
                >
                  {Cities.map((state, key) => (
                    <option
                      className="state_option-"
                      selected={key === 0}
                      value={state.name}
                      key={key}
                    >
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="_down_part-">
            <h3 className="label-">Phone number</h3>
            <div className="input_div-">
              <p className="input_para-">
                <input
                  className="p_input"
                  type="number "
                  value={selectedNumber}
                  onChange={handleNumberChange}
                  placeholder="Enter Phone Number"
                />
              </p>
            </div>
            <h3 className="label-">Email address</h3>
            <div className="input_div-">
              <p className="input_para-">
                <input
                  className="p_input"
                  value={selectedEmail}
                  type="email"
                  onChange={handleEmailChange}
                  placeholder="Enter Email Address"
                />
              </p>
            </div>
          </div>
        </div>
        {/* END OF TOP RIGHT SIDE */}

        {/* BOTTOM RIGHT SIDE */}
        <div className="right_bottom_side-">
          <h1 className="header-">Biometric and Genetic Information</h1>
          <div className="top_section-">
            <div className="first_name_div">
              <h3 className="label-">Blood Group</h3>
              <div className="input_div-">
                <p className="input_para-">
                  <select
                    className="select-"
                    type="text "
                    value={selectedBlood}
                    onChange={handleBloodChange}
                    placeholder="Enter Blood Group"
                  >
                    <option disabled selected value="">
                      Select BloodGroup
                    </option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB">AB</option>
                  </select>
                </p>
              </div>
            </div>
            <div className="last_name_div">
              <h3 className="label-">Genotype</h3>
              <div className="input_div-">
                <p className="input_para-">
                  <select
                    className="select-"
                    type="text "
                    onChange={handleGenoChange}
                    value={selectedGeno}
                    placeholder="Enter Genotype"
                  >
                    <option disabled selected value="">
                      Select Genotype
                    </option>
                    <option value="AS">AS</option>
                    <option value="AA">AA</option>
                    <option value="SS">SS</option>
                  </select>
                </p>
              </div>
            </div>
          </div>
          <h3 className="label-">Allergies</h3>
          <div className="input_div-">
            <p className="input_para-">
              <input
                className="p_input"
                onChange={handleAlleChange}
                value={selectedAlle}
                type="text"
                placeholder="Enter Allergies"
              />
            </p>
          </div>

          <div className="bottom_section-">
            <div className="expiry_month">
              <h3 className="label-">Weight(kilogram)</h3>
              <div className="input_div-">
                <p className="input_para-">
                  <input
                    className="p_input"
                    type="number"
                    onChange={handleWeigChange}
                    value={selectedWeight}
                    placeholder="Enter Weight(kg)"
                  />
                </p>
              </div>
            </div>
            <div className="expiry_year">
              <h3 className="label-">Height(metres)</h3>
              <div className="input_div-">
                <p className="input_para-">
                  <input
                    className="p_input"
                    type="number"
                    value={selectedHeight}
                    onChange={handleHeightChange}
                    placeholder="Enter Height(m)"
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* END OF RIGHT SIDE TOP SECTION */}
    </div>
  );
}

export default PatientsEditProfile;
