import axios from "axios";
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Report = () => {
  const [report, setReport] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/report")
      .then((response) => {
        if (response.data.Status) {
          setReport(response.data.Result);
        } else {
          alert(response.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const downloadPDF = () => {
    const input = document.getElementById("report-table");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("full_report.pdf");
    });
  };

  return (
    <div
      className="px-5 mt-3"
      id="report-table"
      style={{ marginLeft: "250px" }}
    >
      <div className="d-flex justify-content-center">
        <h3>Full Report View</h3>
      </div>
      <button onClick={downloadPDF} className="btn btn-primary mb-3">
        Download PDF
      </button>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Player ID</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Age</th>
              <th>Total Score</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            {report.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.surname}</td>
                <td>{r.age}</td>
                <td>{r.total_score}</td>
                <td>{r.score_percentage} %</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;
