import React from "react";
import { BiFilter } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { useGlobalFilter } from "react-table";
import { useNavigate } from "react-router-dom";
import Table from "./table";
import { useTable } from "react-table";
import { useMemo } from "react";
import { Link } from "react-router-dom";

export default function Visit() {
  const navigate = useNavigate();

  const takeme = () => {
    return navigate("/visit/visiterReport");
  };

  let getFormattedRecords = JSON.parse(
    localStorage.getItem("getFormattedRecords")
  );
  console.log(getFormattedRecords);

  const dummyData = getFormattedRecords
    ? getFormattedRecords.map((item, index) => ({
        hospitalName: item.billing[3],
        name: item.billing[2],
        date: item.billing[0],
        time: "13:00 PM",
        complaint: item.treatmentDetails[0],
        Report: "view-report",
        index: index, // Add the index as a property
      }))
    : [];

  const link = "/visit/visiterReport";
  const CALA = [
    {
      Headers: "Hospital/healthprovider",
      accessor: "hospitalName",
      Cell: ({ cell: { row } }) => {
        return (
          <div>
            <span style={{ fontSize: "13px" }}>
              {" "}
              {row.original.hospitalName}
            </span>
            <br />
            <span> {row.original.name}</span>
          </div>
        );
      },
    },

    {
      Headers: "Date",
      accessor: "date",
      Cell: ({ cell: { row } }) => {
        return (
          <div>
            <span style={{ fontSize: "13px" }}> {row.original.date}</span>
            <br />
            <span> {row.original.Time}</span>
          </div>
        );
      },
    },
    {
      Headers: "Complaint",
      accessor: "complaint",
    },
    {
      Headers: "",
      accessor: "Report",
      Cell: ({ cell: { row } }) => (
        <>
          <div className="view-report-button">
            <Link
              to={`${link}/${row.original.index}`}
              style={{ color: "#fff", textDecoration: "none" }}
            >
              {row.original.Report}
            </Link>
          </div>
        </>
      ),
    },
  ];

  const columns = useMemo(() => CALA, []);
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
          {/* <div className='table-1'>
         
          
         
        </div> */}

          {dummyData.map((items) => {
            return (
              <div className="table-2-vaccine">
                <ul>
                  <h4>Hospital/ Attending</h4>
                  <li>
                    {items.hosiptalName}
                    <br />
                    {items.date}
                  </li>
                  <h4>Date/Time</h4>
                  <li>{items.Time}</li>
                  <h4>Complaint </h4>
                  <li>{items.complaint}</li>

                  <li>
                    <button onClick={takeme}>{items.Report}</button>
                  </li>
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
