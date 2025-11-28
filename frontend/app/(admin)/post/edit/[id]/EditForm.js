"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

export default function EditUserForm({ id }) {
  const { token, permissions } = useAuth();
  const router = useRouter();
  const title = "Post Edit";

  const [formData, setFormData] = useState({
    id,
    name: "",
    meta_title: "",
    meta_description: "",
    meta_keyword: "",
    categoryId: "",
    description_full: "",
    files: null,
    status: "",
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [postCategory, setPostCategorys] = useState([]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) payload.append(key, value);
    });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/posts/update`, {
        method: "POST",
        body: payload,
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Post updated successfully ✅");
        router.push("/post");
      } else if (data.errors) {
        toast.error(Object.values(data.errors).flat().join("\n"), {
          style: { whiteSpace: "pre-line" },
        });
        setErrors(data.errors);
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network or server error!");
    }
  };

  // Fetch post data
  const fetchPost = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/posts/postrow/${id}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const datarow = data?.data || {};
      const chkImg = data?.images || "";
      setFormData((prev) => ({
        ...prev,
        id: datarow.id ?? "",
        name: datarow.name ?? "",
        meta_title: datarow.meta_title ?? "",
        meta_description: datarow.meta_description ?? "",
        meta_keyword: datarow.meta_keyword ?? "",
        categoryId: datarow.categoryId ?? "",
        description_full: datarow.description_full ?? "",
        status: datarow.status ?? "",
        files: chkImg ?? "",
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id,token]); // only token

  // Fetch post categories
  const fetchCategories = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/posts/postCategorysearch`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setPostCategorys(data);
    } catch (err) {
      console.error(err);
    }
  }, [token]); // only token

  // Initial fetch
  useEffect(() => {
    fetchPost();
    fetchCategories();
  }, [fetchPost, fetchCategories]);

  // Set document title
  useEffect(() => {
    document.title = title;
  }, [title]);

  if (loading) return <p>Loading...</p>;

  if (!permissions.includes("edit posts")) {
    router.replace("/dashboard");
    return null;
  }

  return (
    <main className="app-main" id="main" tabIndex={-1}>
      <Toaster position="top-right" />

      {/* Header */}
      <div className="app-content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">{title}</h3>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-end">
                <li className="breadcrumb-item"><Link href="/dashboard">Home</Link></li>
                <li className="breadcrumb-item active">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      router.back();
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    ← Back
                  </a>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="app-content">
        <div className="container-fluid">
          <div className="row g-4">
            <div className="col-md-12">
              <div className="card card-primary card-outline mb-4">
                <form onSubmit={handleSubmit}>
                  <div className="card-body">
                    {/* Name */}
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
                    </div>

                    {/* Meta fields */}
                    <div className="mb-3">
                      <label className="form-label">Meta Title</label>
                      <input type="text" name="meta_title" className="form-control" value={formData.meta_title} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Meta Keyword</label>
                      <input type="text" name="meta_keyword" className="form-control" value={formData.meta_keyword} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Meta Description</label>
                      <textarea name="meta_description" className="form-control" rows={5} value={formData.meta_description} onChange={handleChange} />
                    </div>

                    {/* Category */}
                    <div className="mb-3">
                      <label className="form-label">Post Category</label>
                      <select
                        name="categoryId"
                        className={`form-control ${errors.categoryId ? "is-invalid" : ""}`}
                        value={formData.categoryId}
                        onChange={handleChange}
                      >
                        <option value="">-- Select --</option>
                        {postCategory.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Full description */}
                    <div className="mb-3">
                      <label className="form-label">Full Description</label>
                      <CKEditor
                        editor={ClassicEditor}
                        key={formData.id}
                        data={formData.description_full}
                        onChange={(event, editor) =>
                          setFormData((prev) => ({ ...prev, description_full: editor.getData() }))
                        }
                      />
                    </div>

                    {/* File upload */}
                    <div className="mb-3">
                      <label className="form-label">Upload Image</label>
                      <input type="file" name="files" accept="image/*" onChange={handleChange} className="form-control" />
                    </div>

                    {/* Preview */}
                    {formData.files && (
                      <div className="mb-3">
                        {typeof formData.files === "string" ? (
                          <Image src={formData.files} alt="Preview" width={150} height={150} className="img-thumbnail" />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={URL.createObjectURL(formData.files)} alt="Preview" className="img-thumbnail" style={{ maxHeight: 150 }} />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="card-footer text-end">
                    <button type="submit" className="btn btn-primary">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
