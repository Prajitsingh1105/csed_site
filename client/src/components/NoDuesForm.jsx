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
        <div style={styles.body} className="paper-wrapper">
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
                                    <div className="sign-name">Deepanshu Singh Yadav</div>
                                    <div className="sign-date" style={{ color: "#888", fontSize: 10 }}>[Signature generated in secure PDF]</div>
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
.paper-wrapper * { margin: 0; padding: 0; box-sizing: border-box; }

.paper-wrapper .paper {
    width: 900px;
    background: white;
    padding: 40px 50px;
    color: #111;
    box-shadow: 0 0 10px rgba(0,0,0,0.15);
    border: 1px solid #ddd;
  }

.paper-wrapper .dept { text-align: center; font-size: 20px; margin-bottom: 4px; }
.paper-wrapper .college { text-align: center; font-size: 26px; font-weight: bold; margin-bottom: 18px; }
.paper-wrapper .title { text-align: center; font-size: 28px; font-weight: bold; text-decoration: underline; margin-bottom: 10px; }
.paper-wrapper .subtitle { text-align: center; font-size: 20px; margin-bottom: 25px; }

.paper-wrapper .student-details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
    padding: 0 40px;
    gap: 40px;
  }

.paper-wrapper .student-details ul { list-style: none; font-size: 18px; line-height: 2.3; width: 48%; }

.paper-wrapper .student-field { display: flex; align-items: center; gap: 10px; }
.paper-wrapper .student-field label { font-weight: bold; white-space: nowrap; min-width: 120px; }

.paper-wrapper .student-input {
    flex: 1;
    border: none;
    border-bottom: 1px solid #111;
    background: transparent;
    outline: none;
    font-family: "Times New Roman", Times, serif;
    font-size: 18px;
    padding: 2px 4px;
  }
.paper-wrapper .student-input:focus { border-bottom: 2px solid #111; }

.paper-wrapper .student-value {
    flex: 1;
    border-bottom: 1px solid #111;
    font-family: "Times New Roman", Times, serif;
    font-size: 18px;
    padding: 2px 4px;
    display: inline-block;
    min-width: 80px;
  }

.paper-wrapper .info { font-size: 18px; margin-bottom: 10px; }

.paper-wrapper table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 35px; }
.paper-wrapper th, .paper-wrapper td { border: 1px solid #999; padding: 10px; vertical-align: middle; font-size: 16px; }
.paper-wrapper th { text-align: left; font-weight: bold; }

.paper-wrapper .sn { width: 7%; text-align: center; }
.paper-wrapper .activity { width: 30%; }
.paper-wrapper .status { width: 14%; text-align: center; }
.paper-wrapper .verify { width: 25%; }
.paper-wrapper .sign { width: 24%; text-align: center; }

.paper-wrapper .signature-box { display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.2; }

.paper-wrapper .signature-svg { width: 95px; height: auto; display: block; margin: 0 auto 2px; max-width: 100%; }
.paper-wrapper .signature-svg-wrapper svg { width: 95px; height: auto; display: block; margin: 0 auto 2px; max-width: 100%; }

.paper-wrapper .sign-name { font-size: 13px; font-weight: bold; margin-top: 2px; }
.paper-wrapper .sign-date { font-size: 12px; margin-top: 2px; }

.paper-wrapper .bottom { display: flex; justify-content: space-between; gap: 30px; margin-top: 10px; }
.paper-wrapper .box { width: 48%; }
.paper-wrapper .box-title { font-size: 18px; font-weight: bold; margin-bottom: 8px; }
.paper-wrapper .box ul { padding-left: 25px; font-size: 16px; line-height: 1.7; }

  @media print {
  /* Hide everything outside the form */
.paper-wrapper > * { display: none !important; }

  /* Show only the paper */
.paper-wrapper .paper {
    display: block !important;
    box-shadow: none !important;
    border: none !important;
    width: 100% !important;
    padding: 20px 30px !important;
    margin: 0 !important;
  }

  /* Force single page */
.paper-wrapper * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  
.paper-wrapper .dept { font-size: 14px !important; margin-bottom: 2px !important; }
.paper-wrapper .college { font-size: 18px !important; margin-bottom: 10px !important; }
.paper-wrapper .title { font-size: 18px !important; margin-bottom: 6px !important; }
.paper-wrapper .subtitle { font-size: 14px !important; margin-bottom: 14px !important; }

.paper-wrapper .student-details {
    margin-bottom: 14px !important;
    padding: 0 20px !important;
    gap: 20px !important;
  }
.paper-wrapper .student-details ul { font-size: 13px !important; line-height: 1.9 !important; }
.paper-wrapper .student-field label { min-width: 100px !important; }
.paper-wrapper .student-input, .paper-wrapper .student-value { font-size: 13px !important; border-bottom: 1px solid #111 !important; }

.paper-wrapper .info { font-size: 13px !important; margin-bottom: 6px !important; }

.paper-wrapper table { margin-top: 6px !important; margin-bottom: 20px !important; }
.paper-wrapper th, .paper-wrapper td { padding: 6px 8px !important; font-size: 12px !important; }

.paper-wrapper .signature-svg, .paper-wrapper .signature-svg-wrapper svg {
    width: 70px !important;
  }
.paper-wrapper .sign-name { font-size: 11px !important; }
.paper-wrapper .sign-date { font-size: 10px !important; }

.paper-wrapper .bottom { margin-top: 6px !important; gap: 20px !important; }
.paper-wrapper .box-title { font-size: 13px !important; margin-bottom: 4px !important; }
.paper-wrapper .box ul { font-size: 12px !important; line-height: 1.5 !important; }

  /* Contain everything to one page */
.paper-wrapper .paper { page-break-after: avoid; page-break-inside: avoid; }
  @page { margin: 10mm; size: A4; }
}
`;

export default NoDuesForm;