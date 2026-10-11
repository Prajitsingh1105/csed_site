import puppeteer from 'puppeteer';
import QRCode from 'qrcode';
import NoDuesRequest from '../models/NoDuesRequest.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

export const downloadNoDuesPdf = async (req, res) => {
    try {
        const { userId } = req.auth;
        const noDuesRequest = await NoDuesRequest.findOne({ userId });

        if (!noDuesRequest || noDuesRequest.status !== 'Approved') {
            return res.status(403).json({ success: false, message: 'No Dues not approved yet.' });
        }

        const studentName = noDuesRequest.name;
        const rollNo = noDuesRequest.rollNumber;
        const branch = noDuesRequest.branch;
        const year = noDuesRequest.year;
        
        // Generate QR Code data URI
        const verificationUrl = `https://csed.ietlucknow.ac.in/verify/no-dues/${noDuesRequest._id}`;
        const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);

        // Fetch signature from ENV
        const signatureSvg = process.env.FACULTY_SIGNATURE_SVG || '';

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>No Dues Certificate</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: "Times New Roman", Times, serif; background: white; padding: 30px 40px; color: #111; }
                .dept { text-align: center; font-size: 16px; margin-bottom: 4px; }
                .college { text-align: center; font-size: 22px; font-weight: bold; margin-bottom: 15px; }
                .title { text-align: center; font-size: 22px; font-weight: bold; text-decoration: underline; margin-bottom: 10px; }
                .subtitle { text-align: center; font-size: 16px; margin-bottom: 25px; }
                
                .student-details { display: flex; justify-content: space-between; margin-bottom: 25px; padding: 0 10px; gap: 40px; }
                .student-details ul { list-style: none; font-size: 16px; line-height: 2; width: 48%; }
                .student-field { display: flex; align-items: center; gap: 10px; }
                .student-field label { font-weight: bold; white-space: nowrap; min-width: 100px; }
                .student-value { flex: 1; border-bottom: 1px solid #111; font-family: "Times New Roman", Times, serif; font-size: 16px; padding: 2px 4px; display: inline-block; min-width: 80px; }
                
                .info { font-size: 15px; margin-bottom: 10px; }
                
                table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 30px; }
                th, td { border: 1px solid #999; padding: 8px 10px; vertical-align: middle; font-size: 14px; }
                th { text-align: left; font-weight: bold; }
                .sn { width: 7%; text-align: center; }
                .activity { width: 30%; }
                .status { width: 14%; text-align: center; }
                .verify { width: 25%; }
                .sign { width: 24%; text-align: center; }
                
                .signature-box { display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.2; }
                .signature-svg-wrapper svg { width: 80px; height: auto; display: block; margin: 0 auto 2px; }
                .sign-name { font-size: 11px; font-weight: bold; margin-top: 2px; }
                .sign-date { font-size: 10px; margin-top: 2px; }
                
                .bottom { display: flex; justify-content: space-between; gap: 30px; margin-top: 10px; }
                .box { width: 48%; }
                .box-title { font-size: 14px; font-weight: bold; margin-bottom: 8px; }
                .box ul { padding-left: 20px; font-size: 13px; line-height: 1.5; }
                
                .header-wrapper { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; position: relative; }
                .header-center { flex: 1; text-align: center; }
                .header-right { width: 80px; text-align: center; position: absolute; right: 0; top: 0; }
                
                .header-right img { width: 70px; height: 70px; display: block; margin: 0 auto; }
                .header-right p { font-size: 9px; margin-top: 2px; font-weight: bold; }
                
                .cert-id { font-size: 10px; position: absolute; bottom: 20px; right: 40px; color: #777; font-family: monospace; }
                
                .signature-svg-wrapper svg { width: 70px; height: auto; display: block; margin: 0 auto 2px; }
            </style>
        </head>
        <body>
            <div class="header-wrapper">
                <div class="header-center">
                    <div class="dept">Department of Computer Science &amp; Engineering</div>
                    <div class="college">Institute of Engineering &amp; Technology, Lucknow</div>
                </div>
                <div class="header-right">
                    <img src="${qrCodeDataUrl}" alt="Verification QR Code" />
                    <p>Scan to Verify</p>
                </div>
            </div>
            
            <div class="title">CHECK LIST for issuance of No Dues Certificate, 2026-27</div>
            <div class="subtitle">(For B.Tech / MCA Final Year Students: Passing-Out Batch)</div>
            
            <div class="student-details">
                <ul>
                    <li class="student-field"><label>Name:</label><span class="student-value">${studentName}</span></li>
                    <li class="student-field"><label>Roll Number:</label><span class="student-value">${rollNo}</span></li>
                </ul>
                <ul>
                    <li class="student-field"><label>Branch:</label><span class="student-value">${branch}</span></li>
                    <li class="student-field"><label>Year:</label><span class="student-value">${year}</span></li>
                </ul>
            </div>
            
            <div class="info">The Candidate has completed the formalities and submitted the required documents / data.</div>
            
            <table>
                <tbody>
                    <tr>
                        <th class="sn">SN</th>
                        <th class="activity">Activity</th>
                        <th class="status">Status<br />Yes/ No</th>
                        <th class="verify">To be verified by</th>
                        <th class="sign">Signature of Verifying authority</th>
                    </tr>
                    <tr>
                        <td class="sn">1</td>
                        <td>Submitted Hard Copies of the Project</td>
                        <td class="status">Yes</td>
                        <td>Project Coordinator</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td class="sn">2</td>
                        <td>Submitted the record of placement / Higher Study</td>
                        <td class="status">Yes</td>
                        <td>Faculty Coordinator for Placement / Higher Study Record</td>
                        <td class="sign">
                            <div class="signature-box">
                                ${signatureSvg ? `<div class="signature-svg-wrapper">${signatureSvg}</div>` : ''}
                                <div class="sign-name">Deepanshu Singh Yadav</div>
                                <div class="sign-date">${new Date(noDuesRequest.approvedAt || Date.now()).toLocaleDateString('en-GB')}</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="sn">3</td>
                        <td>Filled all the Central / Departmental Feedback forms</td>
                        <td class="status">Yes</td>
                        <td>Faculty Advisor</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            
            <div class="bottom">
                <div class="box">
                    <div class="box-title">Project/Thesis Coordinator:</div>
                    <ul>
                        <li>Dr Pawan Kumar Tiwari, B.Tech CSE-R</li>
                        <li>Dr Manik Chandra, B.Tech CSE-AI</li>
                        <li>Dr Natthan Singh, B.Tech CSE-SF</li>
                        <li>Dr Upendra Kumar, MCA</li>
                    </ul>
                </div>
                <div class="box">
                    <div class="box-title">Faculty Coordinator for Placement / Higher Study Record:</div>
                    <ul>
                        <li>Er Deepanshu Singh Yadav</li>
                        <li>Er Raghvendra Singh</li>
                        <li>Ms Laxmi Yadav / Ms Renu (Supporting Scholar)</li>
                    </ul>
                </div>
            </div>
            
            <div class="cert-id">Certificate ID: ${noDuesRequest._id}</div>
        </body>
        </html>
        `;

        const browser = await puppeteer.launch({ 
            headless: 'new', 
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] 
        });
        
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
        });
        
        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=No_Dues_${rollNo}.pdf`,
            'Content-Length': pdfBuffer.length
        });
        
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ success: false, message: 'Failed to generate PDF.' });
    }
};

export const verifyNoDues = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await NoDuesRequest.findById(id);
        
        if (!request || request.status !== 'Approved') {
            return res.status(404).json({ success: false, message: 'Invalid or Unapproved Certificate' });
        }
        
        return res.status(200).json({
            success: true,
            data: {
                name: request.name,
                rollNumber: request.rollNumber,
                branch: request.branch,
                approvedAt: request.approvedAt,
                status: request.status
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Verification error' });
    }
};
