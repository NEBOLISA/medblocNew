import React from "react";
import { BiFilter } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { useGlobalFilter } from "react-table";
import Table from "./table";
import { useTable } from "react-table";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Vaccine() {
  const navigate = useNavigate();
  let getFormattedRecords = JSON.parse(
    localStorage.getItem("getFormattedRecords")
  );
  console.log(getFormattedRecords);

  // const dummyData= [
  //   {hosiptalName:"Gen. Hospital, Enugu Town",name:"Dr. Ada (Gen. Medicine)",Date:"02/05/2023",Time:"14:00" ,Remark:"complete",vaccine:"Covid Vaccine Shots 1,2,3"},
  //   {hosiptalName:"Gen. Hospital, Enugu Town",name:"Dr. Ada (Gen. Medicine)", Time:"14:00" ,Remark:"complete",vaccine:"Covid Vaccine Shots 1,2,3",Date:"02/05/2023"},
  //   {hosiptalName:"Gen. Hospital, Enugu Town",name:"Dr. Ada (Gen. Medicine)", Time:"14:00" ,Remark:"complete",vaccine:"Covid Vaccine Shots 1,2,3",Date:"02/05/2023"},
  //   {hosiptalName:"Gen. Hospital, Enugu Town",name:"Dr. Ada (Gen. Medicine)", Time:"14:00" ,Remark:"complete",vaccine:"Covid Vaccine Shots 1,2,3",Date:"02/05/2023"},
  //   {hosiptalName:"Gen. Hospital, Enugu Town",name:"Dr. Ada (Gen. Medicine)", Time:"14:00" ,Remark:"complete",vaccine:"Covid Vaccine Shots 1,2,3" ,Date:"02/05/2023"},
  //   {hosiptalName:"Gen. Hospital, Enugu Town",name:"Dr. Ada (Gen. Medicine)", Time:"14:00" ,Remark:"complete",vaccine:"Covid Vaccine Shots 1,2,3",Date:"02/05/2023"},

  // ]

  const dummyData = getFormattedRecords
    ? getFormattedRecords.map((item, index) => ({
        hosiptalName: item.billing[3],
        name: item.billing[2],
        Time: "14:00",
        Remark: item.treatmentDetails[2],
        vaccine: item.vaccine[0],
        Date: item.vaccine[1],
        index: index, // Add the index as a property
      }))
    : [];

  const COCA_COLA = [
    {
      Headers: "Hospital/healthprovider",
      accessor: "hosiptalName",
      Cell: ({ cell: { row } }) => {
        return (
          <div>
            <span style={{ fontSize: "13px" }}>
              {" "}
              {row.original.hosiptalName}
            </span>
            <br />
            <span> {row.original.name}</span>
          </div>
        );
      },
    },
    {
      Headers: "Vaccines",
      accessor: "vaccine",
    },
    {
      Headers: "Date",
      accessor: "Time",
      Cell: ({ cell: { row } }) => {
        return (
          <div>
            <span style={{ fontSize: "13px" }}> {row.original.Date}</span>
            <br />
            {/* <span> {row.original.Time}</span> */}
          </div>
        );
      },
    },
    {
      Headers: "Remark",
      accessor: "Remark",
    },
  ];
  const columns = useMemo(() => COCA_COLA, []);
  const data = useMemo(() => dummyData, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    state,
    setGlobalFilter,
    prepareRow,
  } = useTable({ columns, data }, useGlobalFilter);

  const { globalFilter } = state;
  return (
    <div className="overview-container">
      <div className="visit-navigation">
        <div className="visit-header"></div>
        {/* /search component would be here  */}
        <div className="search">
          <CiSearch />
          <input
            type="text"
            value={globalFilter || ""}
            placeholder="search"
            onChange={(e) => setGlobalFilter(e.target.value)}
          />

          <BiFilter className="icon" />
        </div>
        <div className="select-folder">
          <select
            name="link"
            id="link-id"
            onChange={(e) => navigate(e.target.value)}
          >
            <option value="/Records/overview">overview</option>
            <option value="/Records/visit">visit</option>
            <option value="/Records/vaccine">vaccine</option>
            <option value="/Records/prescription">prescription</option>
            <option value="/Records/lab">lab</option>
          </select>
        </div>
      </div>
      <div className="table">
        <div className="table-display">
          <Table
            columns={columns}
            data={data}
            getTableProps={getTableProps}
            getTableBodyProps={getTableBodyProps}
            headerGroups={headerGroups}
            rows={rows}
            state={state}
            setGlobalFilter={setGlobalFilter}
            prepareRow={prepareRow}
          />
        </div>

        <div className="table2-display">
          {/* <div className='table-1-vaccine'>
             
             
             
            
            </div>
             */}
          {dummyData.map((items) => {
            return (
              <div className="table-2-vaccine">
                <ul>
                  <h4>Hospital/ healthprovider</h4>
                  <li>
                    {items.hosiptalName} <br />
                    {items.name}
                  </li>
                  <h4>Vaccines</h4>
                  <li>{items.vaccine}</li>
                  <h4>Date/Time </h4>
                  <li>
                    {items.Date}
                    <br />
                    {items.Time}
                  </li>
                  <h4>Remark</h4>
                  <li>{items.Remark}</li>
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
