import React, { useMemo, useState } from "react";

const NoDuesForm = () => {
  const [studentName, setStudentName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");

  const { sessionTitle, formattedDate } = useMemo(() => {
    const today = new Date();
    const yearValue = today.getFullYear();
    const nextYearShort = String((yearValue + 1) % 100).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const formatted = `${day}-${month}-${yearValue}`;

    return {
      sessionTitle: `CHECK LIST for issuance of No Dues Certificate, ${yearValue}-${nextYearShort}`,
      formattedDate: formatted,
    };
  }, []);

  return (
    <div style={styles.body}>
      <style>{css}</style>

      <div className="paper">
        <div className="dept">
          Department of Computer Science &amp; Engineering
        </div>

        <div className="college">
          Institute of Engineering &amp; Technology, Lucknow
        </div>

        <div className="title">{sessionTitle}</div>

        <div className="subtitle">
          (For B.Tech / MCA Final Year Students: Passing-Out Batch)
        </div>

        <div className="student-details">
          <ul>
            <li className="student-field">
              <label htmlFor="studentName">Name:</label>
              <input
                type="text"
                id="studentName"
                className="student-input"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </li>
            <li className="student-field">
              <label htmlFor="rollNo">Roll Number:</label>
              <input
                type="text"
                id="rollNo"
                className="student-input"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
              />
            </li>
          </ul>

          <ul>
            <li className="student-field">
              <label htmlFor="branch">Branch:</label>
              <input
                type="text"
                id="branch"
                className="student-input"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </li>
            <li className="student-field">
              <label htmlFor="year">Year:</label>
              <input
                type="text"
                id="year"
                className="student-input"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </li>
          </ul>
        </div>

        <div className="info">
          The Candidate has completed the formalaties and submitted the required
          documents / data.
        </div>

        <table>
          <tbody>
            <tr>
              <th className="sn">SN</th>
              <th className="activity">Activity</th>
              <th className="status">
                Status
                <br />
                Yes/ No
              </th>
              <th className="verify">To be verified by</th>
              <th className="sign">Signature of Verifying authority</th>
            </tr>

            <tr>
              <td className="sn">1</td>
              <td>Submitted Hard Copies of the Project</td>
              <td></td>
              <td>Project Coordinator</td>
              <td></td>
            </tr>

            <tr>
              <td className="sn">2</td>
              <td>Submitted the record of placement / Higher Study</td>
              <td className="status">Yes</td>
              <td>Faculty Coordinator for Placement / Higher Study Record</td>
              <td className="sign">
                <div className="signature-box">
                  <svg
                    className="signature-svg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 714 440"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path d="M452.1 116.4c-1.7 1.3-5.3 2.9-7.8 3.6-4.9 1.2-16.4 7.4-22.5 12.2-4.7 3.7-15.5 8.6-28.8 13.2-5.8 2-15 5.9-20.5 8.6-5.5 2.6-13.6 6.3-18 8s-9.4 4.3-11.2 5.6c-6.2 4.7-6.8 4.7-19.3-1.8-6.3-3.3-12.3-6.7-13.4-7.6-1-1-4.6-2.6-8-3.8-3.3-1.2-11-4.3-17.1-6.9-6-2.6-13.1-5-15.7-5.2-4.4-.5-4.8-.3-6.2 2.6-2.1 4-2 4.4 1 8 2.9 3.5 4.6 4 4.3 1.3-.3-3.7 0-4 4.4-3.1 2.3.4 6.3 1.7 9 2.8 2.6 1.1 4.7 1.8 4.7 1.6 0-.3 2.5.9 5.5 2.5 3.1 1.7 6.2 3 7.1 3 .8 0 2.6 1.1 3.9 2.5 2.2 2.1 2.5 3.3 2.5 9.7 0 13.3-.5 14.4-6.9 17.7-22.9 11.6-72.2 43.5-92.2 59.6-13.3 10.7-30.5 26.2-39.1 35.4-6.9 7.3-9.1 10.5-11.8 16.8-2.9 7.1-3.2 8.4-2.6 14.6.3 3.8 1.1 7.7 1.6 8.7 1.5 2.9 6.6 4 17.9 4 15.7 0 36-3.4 62.1-10.2 5.2-1.4 14-3.6 19.5-4.8 11.7-2.7 17.6-4.4 38.5-11.1 40.7-13.2 60.4-24.3 75.5-42.5 11.7-14 15.2-24.4 13.3-39.1-2.2-16.4-17.1-34.3-37.8-45.6l-3.4-1.8 4-2.4c2.1-1.4 4.6-2.5 5.4-2.5.9 0 3.1-1.1 5-2.4 2-1.3 8.7-4.7 15-7.6s12.9-5.8 14.5-6.6c4.9-2.2 17.9-7.4 18.7-7.4.3 0-.3 1.9-1.5 4.2-5.5 11 1.2 26.3 16.2 37.2 5.7 4.1 17.6 10.6 19.4 10.6.7 0 3.3 1 5.8 2.2 2.4 1.2 4.9 2.3 5.4 2.4.6.1 4.4 1.3 8.5 2.7 4.1 1.3 10.4 3.2 14 4.2 23.3 6.5 42.2 14.4 46 19.3 4 5.1 2 10.2-7.8 20-5.9 5.9-11.9 9.4-18.2 10.6-1.9.3-6.6 2-10.5 3.6-13.8 5.8-22.2 8.8-30.7 10.9-4.8 1.2-12.9 3.6-18 5.3s-12.2 3.6-15.8 4.3c-3.6.8-10.5 2.2-15.5 3.3-4.9 1.1-12.4 2.8-16.5 3.6-8.5 1.9-39.3 10.2-42.7 11.6-1.3.6-2.3 1.8-2.3 2.9 0 2.8 6.3 4 9.9 1.8 2.5-1.4 11.2-4.3 16.2-5.2 1.3-.3 3.5-.9 4.9-1.4 2.6-.9 7.1-2 26.5-6.6 6.1-1.4 12.6-3 14.5-3.5s8.9-2.3 15.5-3.9 14.7-3.9 18-5.1 9.8-3.2 14.5-4.5 13.9-4.4 20.5-7 14-5.4 16.5-6.3c5.5-1.9 18-11.1 23.1-17.2 2.1-2.6 4.3-6.6 5.1-9.3 1.2-4.5 1.1-5.1-1.2-9.5-1.6-3.1-3.9-5.4-6.5-6.9-4.8-2.7-17.8-7.9-22-8.9-1.6-.3-6.1-1.7-9.9-3-3.7-1.4-12.3-4-19-5.9-6.6-1.9-13-3.9-14.1-4.4s-5.4-2.4-9.5-4.2-11.9-6.2-17.3-9.8c-16.5-10.8-23.4-23.4-17.7-32.6 2.7-4.3 11.1-11.2 14.8-12.2 1.5-.3 4.1-1.6 5.7-2.8 1.7-1.3 7.3-4 12.5-6 15.7-6.2 24-11.3 24-14.7 0-2.8-7.7-2.5-11.9.6M327 175.7c0 1.2-9.5 6.1-13.1 6.8-1.5.3-1.9-.2-1.9-2.8 0-1.8-.3-5.5-.6-8.4l-.7-5.2 8.2 4.2c4.4 2.3 8.1 4.7 8.1 5.4m12.4 5.8c13.3 7.1 29 22.1 33.9 32.2 2.8 6.1 3.2 7.7 3.2 16.3 0 12.4-2.6 19.8-9.3 26.3-2.6 2.4-7.8 7.4-11.7 11.1-11.2 10.8-35.9 23.5-60 31-6.6 2.1-15.1 4.8-19 6.1-3.8 1.3-11 3.2-16 4.3-4.9 1.1-12.1 2.8-16 3.7-3.8 1-9.2 2.1-11.9 2.6-2.6.4-6.3 1.3-8.1 1.9s-6.8 1.7-11.1 2.4c-4.4.8-11.7 2.2-16.4 3.1-10.3 1.9-30.6 2.4-33.7.7-1.9-1.1-2.1-1.6-1.3-3.8.6-1.4 1-3.9 1-5.5 0-1.7.5-4 1.1-5.1.8-1.4.8-2.7.1-4.2-.8-1.7-.5-3.1 1.3-6 3.4-5.6 11.4-14.6 13-14.6.7 0 1.6-.9 2-1.9.3-1.2 1.2-1.8 2-1.5.8.4 1.9-.7 3-2.9.9-1.9 5.2-6.5 9.7-10.3s9.1-7.8 10.3-8.9c5.7-5.4 21.4-16.3 23-16.2 1.3.1 2-.4 2-1.7 0-1.2 2.1-3.2 5.7-5.5 3.1-2 10.3-6.7 16-10.5s12.1-8 14.3-9.4 6.5-4.2 9.6-6.3c3.1-2 7.8-4.8 10.5-6 2.7-1.3 5.1-2.5 5.4-2.9 1.2-1.3 6.1-4 7.4-4 .8 0 1.6-.6 1.9-1.3.7-1.9 2 0 2 3 0 1.6-.7 6.6-1.7 11.3-1.5 8-4.1 26.6-6.6 49.5-.6 5.5-1.8 12.5-2.7 15.5-2.5 9.3-.4 13.7 3.9 8 1.8-2.5 2.1-4.2 7.3-43.2.8-5.9 2.3-16.1 3.4-22.5 1.1-6.5 2.3-14.3 2.6-17.3 1.1-8.6 2.4-10.1 12.6-15.3 5.1-2.6 10-4.7 10.9-4.7s3.8 1.1 6.4 2.5" />
                    <path
                      fill="#550"
                      d="M424 139c-.9.6-1 1-.3 1 .6 0 1.5-.5 1.8-1 .8-1.2.4-1.2-1.5 0m72 124c-2.3.7-2.3.8-.3.9 1.2.1 2.5-.4 2.8-.9.3-.6.5-1 .3-.9s-1.4.5-2.8.9m-297.5 1c-.3.6.1.7.9.4 1.8-.7 2.1-1.4.7-1.4-.6 0-1.3.4-1.6 1m265.3 11.7c.6.2 1.8.2 2.5 0 .6-.3.1-.5-1.3-.5s-1.9.2-1.2.5M439 283c-.9.6-1 1-.3 1 .6 0 1.5-.5 1.8-1 .8-1.2.4-1.2-1.5 0m-67.2 16.7c.6.2 1.8.2 2.5 0 .6-.3.1-.5-1.3-.5s-1.9.2-1.2.5m-209.2 17.8c-.9 2.6-.7 3.2.5 1.2.6-1 .9-2.1.6-2.3-.2-.3-.7.2-1.1 1.1m81.2.2c.7.3 1.6.2 1.9-.1.4-.3-.2-.6-1.3-.5-1.1 0-1.4.3-.6.6m-6.3 1.3c-1.3.6-1.5.9-.5.9.8 0 2.2-.4 3-.9 1.8-1.2.2-1.2-2.5 0m-59.7 11.7c.6.2 1.8.2 2.5 0 .6-.3.1-.5-1.3-.5s-1.9.2-1.2.5"
                    />
                    <path
                      fill="#555"
                      d="M462.4 118.8c-1.7 1.5-5.5 4-8.4 5.5-2.9 1.6-5 3.1-4.7 3.4.8.8 12.2-5.6 14.8-8.3 3.2-3.4 2-3.8-1.7-.6m-23.9 12.3c-8.7 3.7-11.9 5.5-12.3 6.7-.2.6 1.8 0 4.5-1.4 2.6-1.3 7.7-3.7 11.3-5.4 8.4-3.9 5.6-3.8-3.5.1m-22.3 11.4c-5.5 3.7-11.2 10.6-11.1 13.4 0 1 .3.8.9-.7 1.4-3.2 10-11.6 13.8-13.3 1.7-.7 3.2-1.7 3.2-2.1 0-1.4-1.5-.8-6.8 2.7m-22.2 7.1c-6.7 2.5-13.1 5.6-12.6 6.1.1.1 3.8-1.3 8.2-3.2 4.3-1.9 8.9-3.5 10.2-3.5 1.2 0 2.2-.5 2.2-1 0-1.4-.6-1.3-8 1.6M269 151c-.1.8-.1 2.6 0 3.9.1 1.4-.2 2.1-.9 1.7-.6-.4-1.1-.3-1.1.3 0 .5.5 1.3 1 1.6 1.4.9 2.2-1.7 1.7-5.7-.2-1.8-.5-2.6-.7-1.8m95.2 12c-7.6 3.8-14.1 7-14.5 7-1 0-7.8 4.2-7.4 4.6.2.3 2.8-.7 5.8-2 8.7-3.9 32.5-16.6 31.2-16.6-.7 0-7.5 3.1-15.1 7m-74.2-5.6c0 .2.7.7 1.6 1 .8.3 1.2.2.9-.4-.6-1-2.5-1.4-2.5-.6m21.1 12.3c0 2.5.1 2.6.9.8 1.2-2.7 1.2-3.5 0-3.5-.5 0-1 1.2-.9 2.7m1.2 8.8c0 2.2.2 3 .4 1.7.2-1.2.2-3 0-4-.3-.9-.5.1-.4 2.3m13.2 3.5c-3.3 1.7-6.4 3.5-7 4.1-.5.6 1.9-.4 5.5-2.1 3.6-1.8 7.6-3.6 9-4.1 2.1-.6 2.2-.7.4-.8-1.1-.1-4.7 1.3-7.9 2.9m-14 9.2c-.8 1.8-2.4 9.8-3.5 17.8s-2.7 19-3.5 24.5c-.9 5.4-1.4 10.6-1.3 11.4.5 2.5 3.6-14.9 5.8-32.9 2.6-20.2 2.6-20.5 4.6-22.4.8-.9 1.1-1.6.5-1.6s-1.8 1.5-2.6 3.2m120.5-2.8c0 .3.9 1 2 1.6s2 .8 2 .6c0-.3-.9-1-2-1.6s-2-.8-2-.6m-68.5 2.6c1 1.1 2 2 2.2 2s-.1-.9-.7-2-1.6-2-2.2-2-.3.9.7 2m-62 4c-.3.5-.1 1 .4 1 .6 0 1.1-.5 1.1-1 0-.6-.2-1-.4-1-.3 0-.8.4-1.1 1m68.5 2.5c1.3 1.4 2.6 2.5 2.8 2.5.3 0-.5-1.1-1.8-2.5s-2.6-2.5-2.8-2.5c-.3 0 .5 1.1 1.8 2.5m-75.7 1c-1.8 1.4-5.2 3.4-7.6 4.5s-7.3 3.9-10.8 6.2c-3.6 2.4-9.8 6.3-13.8 8.8s-11.4 7.4-16.6 11c-5.1 3.6-10.7 7.3-12.4 8.2s-3.1 2.2-3.1 2.7c0 1.2 8.7-3.9 14.5-8.5 2.2-1.7 6.3-4.4 9-6 2.8-1.6 6.9-4.1 9-5.7 9.1-6.2 18.4-12.1 24.5-15.5 8.6-4.7 13.8-8.2 12-8.2-.8 0-2.9 1.2-4.7 2.5m143.7.5c.8.5 2 1 2.5 1 .6 0 .3-.5-.5-1s-1.9-1-2.5-1c-.5 0-.3.5.5 1m-60.3 10.5c1.5 3 2.9 5.3 3.1 5.1.4-.5-4.6-10.6-5.3-10.6-.3 0 .7 2.5 2.2 5.5m99.8 2.5c2.7 1.2 4.3 1.2 2.5 0-.8-.5-2.2-.9-3-.9-1 0-.8.3.5.9m8.3 2.7c.7.3 1.6.2 1.9-.1.4-.3-.2-.6-1.3-.5-1.1 0-1.4.3-.6.6m-104.7 3.9c0 1.1.3 1.4.6.6.3-.7.2-1.6-.1-1.9-.3-.4-.6.2-.5 1.3m114.3-.7c.3.5 1.6 1.1 2.8 1.4 2.2.6 2.2.5.4-.8-2.2-1.7-4-2-3.2-.6m8.6 3.5c0 .2.7.7 1.6 1 .8.3 1.2.2.9-.4-.6-1-2.5-1.4-2.5-.6m-121.7 6.1c0 8.7-1.2 14.3-4.3 20.5-4.2 8.3-15.8 21.4-24.5 28-8.1 6-25.1 15.4-34 18.6-2.7 1-5.9 2.4-7 3.1-4.4 3.1 4.1-.1 15.5-5.7 21.7-10.6 29.9-16.3 41.1-28.6 8.3-9 12.7-17.4 14-27 .8-5.3.8-9 .1-11.4-.9-3.3-1-3.1-.9 2.5m139.5-3c1 1.6 2.2 3.7 2.5 4.5.4 1.2.6 1.2.6-.2.1-.9-1.1-3-2.5-4.5l-2.6-2.8zm3.3 8.8c0 1.5-.7 4.3-1.5 6.1-2 4.8-11.9 14.9-19.3 19.7-6.8 4.5-8.6 6.5-2.5 2.8 16.6-10.1 25.5-20.7 23.9-28.9-.4-2.4-.4-2.4-.6.3m-303.4 12.4c-2.6 1.9-4.6 3.7-4.3 4 .5.6 10.5-6 10.5-7 .1-1.3-1.3-.6-6.2 3m80.4 4.9c0 1.1.3 1.4.6.6.3-.7.2-1.6-.1-1.9-.3-.4-.6.2-.5 1.3m-94.1 6c-3.6 3-6.7 6-6.9 6.7s1.2-.2 3-1.9c3.7-3.4 6.3-5.6 9.4-7.8 1.1-.8 1.8-1.7 1.5-2-.3-.2-3.5 2-7 5m93.3-.1c0 2.2.2 3 .4 1.7.2-1.2.2-3 0-4-.3-.9-.5.1-.4 2.3m-1.1 9c0 1.6.2 2.2.5 1.2.2-.9.2-2.3 0-3-.3-.6-.5.1-.5 1.8m-106.5 3.2c-5.2 4.7-9.3 9.2-8.5 9.6.1.1 3.7-3.1 7.8-7.1 8.4-8.1 8.9-9.7.7-2.5M492 265c-1.8 1.2-.2 1.2 2.5 0 1.3-.6 1.5-.9.5-.9-.8 0-2.2.4-3 .9m-13.5 4.9c-4.8 1.7-13.1 5.9-9 4.6 5.6-1.9 14.8-5.5 15.3-6 1-.9-1.2-.5-6.3 1.4m-179.8 4.9c-.9 7-3.5 10.7-6.8 9.9-2-.6-2.6.7-.8 1.9 3.7 2.3 9.3-6.8 8.7-14.2-.3-3.4-.4-3.2-1.1 2.4m162.1 1.9c.7.3 1.6.2 1.9-.1.4-.3-.2-.6-1.3-.5-1.1 0-1.4.3-.6.6m-7.8 1.8c-3.1 1.8-1.6 1.8 3 0 2.3-.9 2.8-1.4 1.5-1.4-1.1 0-3.1.6-4.5 1.4m-271.9 2.7c-.1 1-1.4 2.4-2.9 3.2-3 1.5-12.2 12.1-12.2 13.9 0 .6 1.1-.5 2.5-2.4s5.1-5.7 8.2-8.5c3.5-3.2 5.4-5.5 5-6.5q-.6-1.65-.6.3M428 286c-2 .6-2.1.8-.5.8 1.1 0 2.9-.3 4-.8 2.5-1.1-.1-1.1-3.5 0m-13 3c-2 .6-2.1.8-.5.8 1.1 0 3.4-.4 5-.8 2.7-.7 2.7-.8.5-.8-1.4 0-3.6.4-5 .8m-17.2 4.7c.6.2 1.8.2 2.5 0 .6-.3.1-.5-1.3-.5s-1.9.2-1.2.5m-92.8 6c-.8.3-2.8 1.1-4.5 1.8-1.6.7-4.7 1.9-6.8 2.5-2.1.7-3.6 1.4-3.3 1.7.5.6 16.5-4.3 18.6-5.7 1.2-.8 1.2-1-.5-.9-1.1 0-2.7.3-3.5.6m-141.3 1.8c-.4.8-.2 1.7.2 2 .5.2 1.1-.4 1.4-1.5.6-2.3-.8-2.7-1.6-.5m119.6 5.5c-3.2 1.3-2.9 2.1.5 1 5.6-1.8 5.8-1.8 3.7-1.9-1.1 0-3 .4-4.2.9m-119.8 5c-.4 1.7-.5 3.4-.2 3.6.3.3.8-.9 1.2-2.6s.5-3.4.2-3.6c-.3-.3-.8.9-1.2 2.6m104.1-.4c-8.1 2.5-11.6 4.2-5.9 3 5.5-1.2 17.9-5.4 15.8-5.4-1.1 0-5.6 1.1-9.9 2.4m-12.8 4.1c.7.3 1.6.2 1.9-.1.4-.3-.2-.6-1.3-.5-1.1 0-1.4.3-.6.6m-8 2c.7.3 1.6.2 1.9-.1.4-.3-.2-.6-1.3-.5-1.1 0-1.4.3-.6.6m-5 1c.6.2 1.8.2 2.5 0 .6-.3.1-.5-1.3-.5s-1.9.2-1.2.5m-10.7 1.9c-5.7 1.8-6.3 2.5-1.5 1.7 5.1-.8 8-1.8 6.8-2.5-.5-.3-2.9.1-5.3.8m-69.6.4c-.3.5-.1 1 .4 1 .6 0 1.1-.5 1.1-1 0-.6-.2-1-.4-1-.3 0-.8.4-1.1 1m60.3 2.7c.7.3 1.6.2 1.9-.1.4-.3-.2-.6-1.3-.5-1.1 0-1.4.3-.6.6m-7.3 1.3c-2.7.7-2.8.8-.5.8 1.4 0 3.4-.3 4.5-.8 2.5-1.1.2-1.1-4 0m-11 2-2 .9 2-.1c1.1 0 3.4-.4 5-.8l3-.8h-3c-1.6 0-3.9.3-5 .8m-33.7 3.7c1.2.2 3 .2 4 0 .9-.3-.1-.5-2.3-.4-2.2 0-3 .2-1.7.4"
                    />
                    <path
                      fill="#005"
                      d="M401.5 147c.4.6 1.1.8 1.6.5 1.4-.9 1.1-1.5-.7-1.5-.8 0-1.2.5-.9 1"
                    />
                  </svg>

                  <div className="sign-name">Deepanshu Singh Yadav</div>
                  <div className="sign-date">{formattedDate}</div>
                </div>
              </td>
            </tr>

            <tr>
              <td className="sn">3</td>
              <td>Filled all the Central / Departmental Feedback forms</td>
              <td></td>
              <td>Faculty Advisor</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <div className="bottom">
          <div className="box">
            <div className="box-title">Project/Thesis Coordinator:</div>
            <ul>
              <li>Dr Pawan Kumar Tiwari, B.Tech CSE-R</li>
              <li>Dr Manik Chandra, B.Tech CSE-AI</li>
              <li>Dr Natthan Singh, B.Tech CSE-SF</li>
              <li>Dr Upendra Kumar, MCA</li>
            </ul>
          </div>

          <div className="box">
            <div className="box-title">
              Faculty Coordinator for Placement / Higher Study Record:
            </div>
            <ul>
              <li>Er Deepanshu Singh Yadav</li>
              <li>Er Raghvendra Singh</li>
              <li>Ms Laxmi Yadav / Ms Renu (Supporting Scholar)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  body: {
    fontFamily: '"Times New Roman", Times, serif',
    background: "#f2f2f2",
    padding: "30px",
    display: "flex",
    justifyContent: "center",
    minHeight: "100vh",
  },
};

const css = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .paper {
    width: 900px;
    background: white;
    padding: 40px 50px;
    color: #111;
    box-shadow: 0 0 10px rgba(0,0,0,0.15);
    border: 1px solid #ddd;
  }

  .dept {
    text-align: center;
    font-size: 20px;
    margin-bottom: 4px;
  }

  .college {
    text-align: center;
    font-size: 26px;
    font-weight: bold;
    margin-bottom: 18px;
  }

  .title {
    text-align: center;
    font-size: 28px;
    font-weight: bold;
    text-decoration: underline;
    margin-bottom: 10px;
  }

  .subtitle {
    text-align: center;
    font-size: 20px;
    margin-bottom: 25px;
  }

  .student-details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
    padding: 0 40px;
    gap: 40px;
  }

  .student-details ul {
    list-style: none;
    font-size: 18px;
    line-height: 2.3;
    width: 48%;
  }

  .student-field {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .student-field label {
    font-weight: bold;
    white-space: nowrap;
    min-width: 120px;
  }

  .student-input {
    flex: 1;
    border: none;
    border-bottom: 1px solid #111;
    background: transparent;
    outline: none;
    font-family: "Times New Roman", Times, serif;
    font-size: 18px;
    padding: 2px 4px;
  }

  .student-input:focus {
    border-bottom: 2px solid #111;
  }

  .info {
    font-size: 18px;
    margin-bottom: 10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    margin-bottom: 35px;
  }

  th,
  td {
    border: 1px solid #999;
    padding: 10px;
    vertical-align: middle;
    font-size: 16px;
  }

  th {
    text-align: left;
    font-weight: bold;
  }

  .sn {
    width: 7%;
    text-align: center;
  }

  .activity {
    width: 30%;
  }

  .status {
    width: 14%;
    text-align: center;
  }

  .verify {
    width: 25%;
  }

  .sign {
    width: 24%;
    text-align: center;
  }

  .signature-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    line-height: 1.2;
  }

  .signature-svg {
    width: 95px;
    height: auto;
    display: block;
    margin: 0 auto 2px;
    max-width: 100%;
  }

  .sign-name {
    font-size: 13px;
    font-weight: bold;
    margin-top: 2px;
  }

  .sign-date {
    font-size: 12px;
    margin-top: 2px;
  }

  .bottom {
    display: flex;
    justify-content: space-between;
    gap: 30px;
    margin-top: 10px;
  }

  .box {
    width: 48%;
  }

  .box-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .box ul {
    padding-left: 25px;
    font-size: 16px;
    line-height: 1.7;
  }

  @media print {
    .paper {
      box-shadow: none;
      border: none;
    }

    .student-input {
      border-bottom: 1px solid #111;
    }
  }
`;

export default NoDuesForm;