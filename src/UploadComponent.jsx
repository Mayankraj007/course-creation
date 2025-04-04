import React, { useState } from "react";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const UploadComponent = () => {
  const [subject, setSubject] = useState("Maths"); // Default subject
  const [pdf, setPdf] = useState(null);
  const [uploading, setUploading] = useState(false);

  const subjects = ["Maths", "Physics", "Computer Science"];

  const handleUpload = async () => {
    if (!pdf) {
      alert("Please select a PDF file.");
      return;
    }

    setUploading(true);
    const storageRef = ref(storage, `pdfs/${subject}/${pdf.name}`);

    try {
      // Upload file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, pdf);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Store file details in Firestore
      await addDoc(collection(db, "pdfs"), {
        subject,
        name: pdf.name,
        url: downloadURL,
        timestamp: serverTimestamp(), // ✅ Use Firestore timestamp
      });

      alert("PDF uploaded successfully!");
      setPdf(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
    setUploading(false);
  };

  return (
    <div>
      <h2>Upload PDF</h2>
      <label>Choose Subject:</label>
      <select onChange={(e) => setSubject(e.target.value)} value={subject}>
        {subjects.map((sub) => (
          <option key={sub} value={sub}>
            {sub}
          </option>
        ))}
      </select>
      <input type="file" accept="application/pdf" onChange={(e) => setPdf(e.target.files[0])} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload PDF"}
      </button>
    </div>
  );
};

export default UploadComponent;
