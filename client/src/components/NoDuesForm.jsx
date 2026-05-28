import React, { useMemo } from "react";

const NoDuesForm = ({ prefillData = null }) => {
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

    // Use prefill data if available, otherwise empty strings
    const studentName = prefillData?.name || "";
    const rollNo = prefillData?.rollNumber || "";
    const branch = prefillData?.branch || "";
    const year = prefillData?.year || "";
    const approvedDate = prefillData?.approvedAt
        ? (() => {
            const d = new Date(prefillData.approvedAt);
            const dd = String(d.getDate()).padStart(2, "0");
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const yyyy = d.getFullYear();
            return `${dd}-${mm}-${yyyy}`;
        })()
        : formattedDate;

    const signatureSvgContent = prefillData?.signatureSvg || null;

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
                            <label>Name:</label>
                            {prefillData ? (
                                <span className="student-value">{studentName}</span>
                            ) : (
                                <input type="text" className="student-input" defaultValue={studentName} />
                            )}
                        </li>
                        <li className="student-field">
                            <label>Roll Number:</label>
                            {prefillData ? (
                                <span className="student-value">{rollNo}</span>
                            ) : (
                                <input type="text" className="student-input" defaultValue={rollNo} />
                            )}
                        </li>
                    </ul>

                    <ul>
                        <li className="student-field">
                            <label>Branch:</label>
                            {prefillData ? (
                                <span className="student-value">{branch}</span>
                            ) : (
                                <input type="text" className="student-input" defaultValue={branch} />
                            )}
                        </li>
                        <li className="student-field">
                            <label>Year:</label>
                            {prefillData ? (
                                <span className="student-value">{year}</span>
                            ) : (
                                <input type="text" className="student-input" defaultValue={year} />
                            )}
                        </li>
                    </ul>
                </div>

                <div className="info">
                    The Candidate has completed the formalities and submitted the required
                    documents / data.
                </div>

                <table>
                    <tbody>
                        <tr>
                            <th className="sn">SN</th>
                            <th className="activity">Activity</th>
                            <th className="status">Status<br />Yes/ No</th>
                            <th className="verify">To be verified by</th>
                            <th className="sign">Signature of Verifying authority</th>
                        </tr>

                        <tr>
                            <td className="sn">1</td>
                            <td>Submitted Hard Copies of the Project</td>
                            <td className="status">{prefillData?.projectStatus || ""}</td>
                            <td>Project Coordinator</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className="sn">2</td>
                            <td>Submitted the record of placement / Higher Study</td>
                            <td className="status">{prefillData?.placementRecordStatus || "Yes"}</td>
                            <td>Faculty Coordinator for Placement / Higher Study Record</td>
                            <td className="sign">
                                <div className="signature-box">
                                    {signatureSvgContent ? (
                                        <div
                                            className="signature-svg-wrapper"
                                            dangerouslySetInnerHTML={{ __html: signatureSvgContent }}
                                        />
                                    ) : (
                                        <svg
                                            className="signature-svg"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 714 440"
                                            preserveAspectRatio="xMidYMid meet"
                                        >
                                            {/* --- keep your original SVG paths here unchanged --- */}
                                            <path d="M452.1 116.4c-1.7 1.3-5.3 2.9-7.8 3.6-4.9 1.2-16.4 7.4-22.5 12.2-4.7 3.7-15.5 8.6-28.8 13.2-5.8 2-15 5.9-20.5 8.6-5.5 2.6-13.6 6.3-18 8s-9.4 4.3-11.2 5.6c-6.2 4.7-6.8 4.7-19.3-1.8-6.3-3.3-12.3-6.7-13.4-7.6-1-1-4.6-2.6-8-3.8-3.3-1.2-11-4.3-17.1-6.9-6-2.6-13.1-5-15.7-5.2-4.4-.5-4.8-.3-6.2 2.6-2.1 4-2 4.4 1 8 2.9 3.5 4.6 4 4.3 1.3-.3-3.7 0-4 4.4-3.1 2.3.4 6.3 1.7 9 2.8 2.6 1.1 4.7 1.8 4.7 1.6 0-.3 2.5.9 5.5 2.5 3.1 1.7 6.2 3 7.1 3 .8 0 2.6 1.1 3.9 2.5 2.2 2.1 2.5 3.3 2.5 9.7 0 13.3-.5 14.4-6.9 17.7-22.9 11.6-72.2 43.5-92.2 59.6-13.3 10.7-30.5 26.2-39.1 35.4-6.9 7.3-9.1 10.5-11.8 16.8-2.9 7.1-3.2 8.4-2.6 14.6.3 3.8 1.1 7.7 1.6 8.7 1.5 2.9 6.6 4 17.9 4 15.7 0 36-3.4 62.1-10.2 5.2-1.4 14-3.6 19.5-4.8 11.7-2.7 17.6-4.4 38.5-11.1 40.7-13.2 60.4-24.3 75.5-42.5 11.7-14 15.2-24.4 13.3-39.1-2.2-16.4-17.1-34.3-37.8-45.6l-3.4-1.8 4-2.4c2.1-1.4 4.6-2.5 5.4-2.5.9 0 3.1-1.1 5-2.4 2-1.3 8.7-4.7 15-7.6s12.9-5.8 14.5-6.6c4.9-2.2 17.9-7.4 18.7-7.4.3 0-.3 1.9-1.5 4.2-5.5 11 1.2 26.3 16.2 37.2 5.7 4.1 17.6 10.6 19.4 10.6.7 0 3.3 1 5.8 2.2 2.4 1.2 4.9 2.3 5.4 2.4.6.1 4.4 1.3 8.5 2.7 4.1 1.3 10.4 3.2 14 4.2 23.3 6.5 42.2 14.4 46 19.3 4 5.1 2 10.2-7.8 20-5.9 5.9-11.9 9.4-18.2 10.6-1.9.3-6.6 2-10.5 3.6-13.8 5.8-22.2 8.8-30.7 10.9-4.8 1.2-12.9 3.6-18 5.3s-12.2 3.6-15.8 4.3c-3.6.8-10.5 2.2-15.5 3.3-4.9 1.1-12.4 2.8-16.5 3.6-8.5 1.9-39.3 10.2-42.7 11.6-1.3.6-2.3 1.8-2.3 2.9 0 2.8 6.3 4 9.9 1.8 2.5-1.4 11.2-4.3 16.2-5.2 1.3-.3 3.5-.9 4.9-1.4 2.6-.9 7.1-2 26.5-6.6 6.1-1.4 12.6-3 14.5-3.5s8.9-2.3 15.5-3.9 14.7-3.9 18-5.1 9.8-3.2 14.5-4.5 13.9-4.4 20.5-7 14-5.4 16.5-6.3c5.5-1.9 18-11.1 23.1-17.2 2.1-2.6 4.3-6.6 5.1-9.3 1.2-4.5 1.1-5.1-1.2-9.5-1.6-3.1-3.9-5.4-6.5-6.9-4.8-2.7-17.8-7.9-22-8.9-1.6-.3-6.1-1.7-9.9-3-3.7-1.4-12.3-4-19-5.9-6.6-1.9-13-3.9-14.1-4.4s-5.4-2.4-9.5-4.2-11.9-6.2-17.3-9.8c-16.5-10.8-23.4-23.4-17.7-32.6 2.7-4.3 11.1-11.2 14.8-12.2 1.5-.3 4.1-1.6 5.7-2.8 1.7-1.3 7.3-4 12.5-6 15.7-6.2 24-11.3 24-14.7 0-2.8-7.7-2.5-11.9.6M327 175.7c0 1.2-9.5 6.1-13.1 6.8-1.5.3-1.9-.2-1.9-2.8 0-1.8-.3-5.5-.6-8.4l-.7-5.2 8.2 4.2c4.4 2.3 8.1 4.7 8.1 5.4m12.4 5.8c13.3 7.1 29 22.1 33.9 32.2 2.8 6.1 3.2 7.7 3.2 16.3 0 12.4-2.6 19.8-9.3 26.3-2.6 2.4-7.8 7.4-11.7 11.1-11.2 10.8-35.9 23.5-60 31-6.6 2.1-15.1 4.8-19 6.1-3.8 1.3-11 3.2-16 4.3-4.9 1.1-12.1 2.8-16 3.7-3.8 1-9.2 2.1-11.9 2.6-2.6.4-6.3 1.3-8.1 1.9s-6.8 1.7-11.1 2.4c-4.4.8-11.7 2.2-16.4 3.1-10.3 1.9-30.6 2.4-33.7.7-1.9-1.1-2.1-1.6-1.3-3.8.6-1.4 1-3.9 1-5.5 0-1.7.5-4 1.1-5.1.8-1.4.8-2.7.1-4.2-.8-1.7-.5-3.1 1.3-6 3.4-5.6 11.4-14.6 13-14.6.7 0 1.6-.9 2-1.9.3-1.2 1.2-1.8 2-1.5.8.4 1.9-.7 3-2.9.9-1.9 5.2-6.5 9.7-10.3s9.1-7.8 10.3-8.9c5.7-5.4 21.4-16.3 23-16.2 1.3.1 2-.4 2-1.7 0-1.2 2.1-3.2 5.7-5.5 3.1-2 10.3-6.7 16-10.5s12.1-8 14.3-9.4 6.5-4.2 9.6-6.3c3.1-2 7.8-4.8 10.5-6 2.7-1.3 5.1-2.5 5.4-2.9 1.2-1.3 6.1-4 7.4-4 .8 0 1.6-.6 1.9-1.3.7-1.9 2 0 2 3 0 1.6-.7 6.6-1.7 11.3-1.5 8-4.1 26.6-6.6 49.5-.6 5.5-1.8 12.5-2.7 15.5-2.5 9.3-.4 13.7 3.9 8 1.8-2.5 2.1-4.2 7.3-43.2.8-5.9 2.3-16.1 3.4-22.5 1.1-6.5 2.3-14.3 2.6-17.3 1.1-8.6 2.4-10.1 12.6-15.3 5.1-2.6 10-4.7 10.9-4.7s3.8 1.1 6.4 2.5" />
                                        </svg>
                                    )}
                                    <div className="sign-name">Deepanshu Singh Yadav</div>
                                    <div className="sign-date">{approvedDate}</div>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className="sn">3</td>
                            <td>Filled all the Central / Departmental Feedback forms</td>
                            <td className="status">{prefillData?.feedbackStatus || ""}</td>
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
  * { margin: 0; padding: 0; box-sizing: border-box; }

  .paper {
    width: 900px;
    background: white;
    padding: 40px 50px;
    color: #111;
    box-shadow: 0 0 10px rgba(0,0,0,0.15);
    border: 1px solid #ddd;
  }

  .dept { text-align: center; font-size: 20px; margin-bottom: 4px; }
  .college { text-align: center; font-size: 26px; font-weight: bold; margin-bottom: 18px; }
  .title { text-align: center; font-size: 28px; font-weight: bold; text-decoration: underline; margin-bottom: 10px; }
  .subtitle { text-align: center; font-size: 20px; margin-bottom: 25px; }

  .student-details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
    padding: 0 40px;
    gap: 40px;
  }

  .student-details ul { list-style: none; font-size: 18px; line-height: 2.3; width: 48%; }

  .student-field { display: flex; align-items: center; gap: 10px; }
  .student-field label { font-weight: bold; white-space: nowrap; min-width: 120px; }

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
  .student-input:focus { border-bottom: 2px solid #111; }

  .student-value {
    flex: 1;
    border-bottom: 1px solid #111;
    font-family: "Times New Roman", Times, serif;
    font-size: 18px;
    padding: 2px 4px;
    display: inline-block;
    min-width: 80px;
  }

  .info { font-size: 18px; margin-bottom: 10px; }

  table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 35px; }
  th, td { border: 1px solid #999; padding: 10px; vertical-align: middle; font-size: 16px; }
  th { text-align: left; font-weight: bold; }

  .sn { width: 7%; text-align: center; }
  .activity { width: 30%; }
  .status { width: 14%; text-align: center; }
  .verify { width: 25%; }
  .sign { width: 24%; text-align: center; }

  .signature-box { display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.2; }

  .signature-svg { width: 95px; height: auto; display: block; margin: 0 auto 2px; max-width: 100%; }
  .signature-svg-wrapper svg { width: 95px; height: auto; display: block; margin: 0 auto 2px; max-width: 100%; }

  .sign-name { font-size: 13px; font-weight: bold; margin-top: 2px; }
  .sign-date { font-size: 12px; margin-top: 2px; }

  .bottom { display: flex; justify-content: space-between; gap: 30px; margin-top: 10px; }
  .box { width: 48%; }
  .box-title { font-size: 18px; font-weight: bold; margin-bottom: 8px; }
  .box ul { padding-left: 25px; font-size: 16px; line-height: 1.7; }

  @media print {
  /* Hide everything outside the form */
  body > * { display: none !important; }

  /* Show only the paper */
  .paper {
    display: block !important;
    box-shadow: none !important;
    border: none !important;
    width: 100% !important;
    padding: 20px 30px !important;
    margin: 0 !important;
  }

  /* Force single page */
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  
  .dept { font-size: 14px !important; margin-bottom: 2px !important; }
  .college { font-size: 18px !important; margin-bottom: 10px !important; }
  .title { font-size: 18px !important; margin-bottom: 6px !important; }
  .subtitle { font-size: 14px !important; margin-bottom: 14px !important; }

  .student-details {
    margin-bottom: 14px !important;
    padding: 0 20px !important;
    gap: 20px !important;
  }
  .student-details ul { font-size: 13px !important; line-height: 1.9 !important; }
  .student-field label { min-width: 100px !important; }
  .student-input, .student-value { font-size: 13px !important; border-bottom: 1px solid #111 !important; }

  .info { font-size: 13px !important; margin-bottom: 6px !important; }

  table { margin-top: 6px !important; margin-bottom: 20px !important; }
  th, td { padding: 6px 8px !important; font-size: 12px !important; }

  .signature-svg, .signature-svg-wrapper svg {
    width: 70px !important;
  }
  .sign-name { font-size: 11px !important; }
  .sign-date { font-size: 10px !important; }

  .bottom { margin-top: 6px !important; gap: 20px !important; }
  .box-title { font-size: 13px !important; margin-bottom: 4px !important; }
  .box ul { font-size: 12px !important; line-height: 1.5 !important; }

  /* Contain everything to one page */
  .paper { page-break-after: avoid; page-break-inside: avoid; }
  @page { margin: 10mm; size: A4; }
}
`;

export default NoDuesForm;