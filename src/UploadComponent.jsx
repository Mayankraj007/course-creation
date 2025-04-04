import React, { useState } from "react";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const UploadComponent = () => {
  const [subject, setSubject] = useState("Maths");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("pdf"); // Default file type
  const [uploading, setUploading] = useState(false);

  const subjects = ["Maths", "Physics", "Computer Science"];
  const fileTypes = {
    pdf: "application/pdf",
    video: "video/*",
    image: "image/*",
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    setUploading(true);
    const filePath = `${fileType}s/${subject}/${file.name}`;
    const storageRef = ref(storage, filePath);

    try {
      // Upload file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Store file details in Firestore
      await addDoc(collection(db, fileType + "s"), {
        subject,
        name: file.name,
        url: downloadURL,
        fileType,
        timestamp: serverTimestamp(),
      });

      alert(`${fileType.toUpperCase()} uploaded successfully!`);
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
    setUploading(false);
  };

  return (
    <div>
      <h2>Upload File</h2>
      <label>Choose Subject:</label>
      <select onChange={(e) => setSubject(e.target.value)} value={subject}>
        {subjects.map((sub) => (
          <option key={sub} value={sub}>
            {sub}
          </option>
        ))}
      </select>

      <label>Select File Type:</label>
      <select onChange={(e) => setFileType(e.target.value)} value={fileType}>
        {Object.keys(fileTypes).map((type) => (
          <option key={type} value={type}>
            {type.toUpperCase()}
          </option>
        ))}
      </select>

      <input
        type="file"
        accept={fileTypes[fileType]}
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default UploadComponent;
