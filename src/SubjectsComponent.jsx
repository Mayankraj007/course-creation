import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const SubjectsComponent = () => {
  const [subjects] = useState(["Maths", "Physics", "Computer Science"]);
  const [pdfsBySubject, setPdfsBySubject] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPdfs();
  }, []);

  const fetchPdfs = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "pdfs"));

      // Organize PDFs by subject
      const pdfsGrouped = {};
      querySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const subject = data.subject;

        if (!pdfsGrouped[subject]) {
          pdfsGrouped[subject] = [];
        }
        pdfsGrouped[subject].push({
          id: doc.id,
          ...data,
        });
      });

      setPdfsBySubject(pdfsGrouped);
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Subjects and PDFs</h2>
      {loading ? <p>Loading...</p> : null}

      {subjects.map((subject) => (
        <div key={subject} style={{ marginBottom: "20px" }}>
          <h3>{subject}</h3>
          <ul>
            {pdfsBySubject[subject]?.length > 0 ? (
              pdfsBySubject[subject].map((pdf) => (
                <li key={pdf.id}>
                  📄 {pdf.name}
                  <a
                    href={pdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginLeft: "10px", color: "blue" }}
                  >
                    View
                  </a>
                  <a
                    href={pdf.url}
                    download={pdf.name}
                    style={{ marginLeft: "10px", color: "green" }}
                  >
                    Download
                  </a>
                </li>
              ))
            ) : (
              <p>No PDFs available.</p>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SubjectsComponent;
