import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const SubjectsComponent = () => {
  const [subjects] = useState(["Maths", "Physics", "Computer Science"]);
  const [filesBySubject, setFilesBySubject] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const fileTypes = ["pdfs", "videos", "images"];
      let allFiles = {};

      for (const fileType of fileTypes) {
        const querySnapshot = await getDocs(collection(db, fileType));
        querySnapshot.docs.forEach((doc) => {
          const data = doc.data();
          const subject = data.subject;

          if (!allFiles[subject]) {
            allFiles[subject] = { pdfs: [], videos: [], images: [] };
          }
          allFiles[subject][fileType].push({
            id: doc.id,
            ...data,
          });
        });
      }

      setFilesBySubject(allFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Subjects and Files</h2>
      {loading ? <p>Loading...</p> : null}

      {subjects.map((subject) => (
        <div key={subject} style={{ marginBottom: "20px" }}>
          <h3>{subject}</h3>

          {/* PDFs Section */}
          <h4>PDFs</h4>
          <ul>
            {filesBySubject[subject]?.pdfs?.length > 0 ? (
              filesBySubject[subject].pdfs.map((file) => (
                <li key={file.id}>
                  📄 {file.name}
                  <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "10px", color: "blue" }}>
                    View
                  </a>
                  <a href={file.url} download={file.name} style={{ marginLeft: "10px", color: "green" }}>
                    Download
                  </a>
                </li>
              ))
            ) : (
              <p>No PDFs available.</p>
            )}
          </ul>

          {/* Videos Section */}
          <h4>Videos</h4>
          <ul>
            {filesBySubject[subject]?.videos?.length > 0 ? (
              filesBySubject[subject].videos.map((file) => (
                <li key={file.id}>
                  🎥 {file.name}
                  <video width="200" controls>
                    <source src={file.url} type="video/mp4" />
                  </video>
                  <a href={file.url} download={file.name} style={{ marginLeft: "10px", color: "green" }}>
                    Download
                  </a>
                </li>
              ))
            ) : (
              <p>No Videos available.</p>
            )}
          </ul>

          {/* Images Section */}
          <h4>Images</h4>
          <ul>
            {filesBySubject[subject]?.images?.length > 0 ? (
              filesBySubject[subject].images.map((file) => (
                <li key={file.id}>
                  🖼 {file.name}
                  <img src={file.url} alt={file.name} width="150" style={{ display: "block", marginTop: "10px" }} />
                  <a href={file.url} download={file.name} style={{ marginLeft: "10px", color: "green" }}>
                    Download
                  </a>
                </li>
              ))
            ) : (
              <p>No Images available.</p>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SubjectsComponent;
