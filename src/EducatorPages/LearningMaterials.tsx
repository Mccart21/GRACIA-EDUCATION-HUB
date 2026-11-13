
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  FileText,
  Upload,
  Info,
  ArrowRight,
  X,
} from "lucide-react";
import EducatorNavbar from "../EducatorComponents/EducatorNavbar";
import EducatorFooter from "../EducatorComponents/EducatorFooter";
import "./EducatorWorkspace.scss";

export default function LearningMaterials() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <div className="educator-workspace">
      <EducatorNavbar />

      <main className="educator-workspace__main">
        <div className="educator-workspace__breadcrumb">
          <Link to="/educator">Dashboard</Link>
          <span>/</span>
          <span>Learning Materials</span>
        </div>

        <section className="educator-workspace__heading">
          <div className="educator-workspace__heading-icon">
            <BookOpen size={26} />
          </div>
          <div>
            <p className="educator-workspace__eyebrow">
              TEACHING RESOURCES
            </p>
            <h1>Learning Materials</h1>
            <p className="educator-workspace__description">
              Prepare and organize lesson notes, documents, and resources
              for your assigned subjects or courses.
            </p>
          </div>
        </section>

        <section className="educator-workspace__panel">
          <div className="educator-workspace__panel-heading">
            <div>
              <h2>Prepare a learning resource</h2>
              <p>
                Choose a file to preview its name before the upload
                service is connected.
              </p>
            </div>
          </div>

          <label className="educator-workspace__upload">
            <span className="educator-workspace__upload-icon">
              <Upload size={28} />
            </span>
            <strong>Select a learning material</strong>
            <span>
              Choose a document from your device. It will not be uploaded
              yet.
            </span>
            <span className="educator-workspace__button">
              Browse Files
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
              onChange={(event) => {
                setSelectedFile(event.target.files?.[0] ?? null);
              }}
            />
          </label>

          {selectedFile && (
            <div className="educator-workspace__selected-file">
              <FileText size={22} />
              <div>
                <strong>{selectedFile.name}</strong>
                <span>
                  {(selectedFile.size / 1024).toFixed(1)} KB · Selected
                  locally, not uploaded
                </span>
              </div>
              <button
                type="button"
                className="educator-workspace__icon-button"
                onClick={() => setSelectedFile(null)}
                aria-label="Remove selected file"
              >
                <X size={19} />
              </button>
            </div>
          )}
        </section>

        <section className="educator-workspace__panel">
          <div className="educator-workspace__panel-heading">
            <div>
              <h2>My learning resources</h2>
              <p>
                Resources will appear here once material storage and
                course assignment are connected.
              </p>
            </div>
          </div>

          <div className="educator-workspace__empty">
            <div className="educator-workspace__empty-icon">
              <FileText size={30} />
            </div>
            <h3>No saved materials available</h3>
            <p>
              Your saved lesson notes and resources will be listed here
              after the backend upload and retrieval features are
              implemented.
            </p>
            <Link
              to="/educator/my-teaching"
              className="educator-workspace__button"
            >
              View My Teaching <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        <div className="educator-workspace__notice">
          <Info size={19} />
          <p>
            <strong>Moodle integration planned:</strong> Moodle can
            eventually manage course resources and learning activities.
            This page does not currently upload content to Moodle or
            Gracia's backend.
          </p>
        </div>
      </main>

      <EducatorFooter />
    </div>
  );
}
