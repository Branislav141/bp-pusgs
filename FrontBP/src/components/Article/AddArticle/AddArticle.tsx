import React, { useState } from "react";
import axios from "axios";
import AddArticleCSS from "../AddArticle/AddArticle.module.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useTokenStore } from "../../../store/useTokenStore";

interface ArticleModel {
  Name: string;
  Price: string;
  Quantity: string;
  Description: string;
  photoUrl: string;
}

const AddArticleForm: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const token = useTokenStore((state) => state.token);

  const [articleData, setArticleData] = useState<ArticleModel>({
    Name: "",
    Price: "",
    Quantity: "",
    Description: "",
    photoUrl: "",
  });

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setArticleData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/Article/AddArticle",
        articleData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Article added successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding article:", error);
    }
  };

  const goBack = () => {
    navigate("/dashboard");
  };

  async function handleUpload() {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await axios.post(
          "http://localhost:5000/api/Article/uploadPhoto",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setArticleData((prevFormData) => ({
          ...prevFormData,
          photoUrl: response.data,
        }));
        toast.success("Photo uploaded successfully!");
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Error uploading photo. Please try again.");
      }
    }
  }

  return (
    <div>
      <form className={AddArticleCSS["user-info"]} onSubmit={handleSubmit}>
        <h1 className={AddArticleCSS.title}>Add Article</h1>

        <input
          className={AddArticleCSS["form-input"]}
          type="text"
          name="Name"
          placeholder="Article Name"
          value={articleData.Name}
          onChange={handleChange}
        />
        <input
          className={AddArticleCSS["form-input"]}
          type="number"
          name="Price"
          placeholder="Price"
          value={articleData.Price}
          onChange={handleChange}
        />
        <input
          className={AddArticleCSS["form-input"]}
          type="number"
          name="Quantity"
          placeholder="Quantity"
          value={articleData.Quantity}
          onChange={handleChange}
        />
        <input
          className={AddArticleCSS["form-description"]}
          type="text"
          name="Description"
          placeholder="Description"
          value={articleData.Description}
          onChange={handleChange}
        />
        <div>
          <h3>Upload article picture</h3>
          <input type="file" onChange={handleFileChange} />
          <button type="button" onClick={handleUpload}>
            Upload
          </button>
        </div>
        <div className={AddArticleCSS["button-container"]}>
          <button className={AddArticleCSS["prodavac-button"]} type="submit">
            Add Article
          </button>
          <button
            className={AddArticleCSS["back-button"]}
            type="button"
            onClick={goBack}
          >
            Back
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddArticleForm;
