import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFile,
  setImageFile,
  uploadedImageUrl,
  setUploadedImageUrl,
  imageLoadingState,
  setImageLoadingState,
  isEditMode = false,

  // ✅ OPTIONAL — seller/admin form
  formData,
  setFormData,
}) {
  const inputRef = useRef(null);

  /* ----------------------------- handlers ----------------------------- */

  function handleImageFileChange(e) {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setImageFile(file);
  }

  function handleRemoveImage() {
    setImageFile(null);
    setUploadedImageUrl("");

    // ✅ update form only if provided
    if (setFormData) {
      setFormData((prev) => ({ ...prev, image: "" }));
    }

    if (inputRef.current) inputRef.current.value = "";
  }

  /* ------------------------ cloudinary upload ------------------------- */

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);

    const form = new FormData();
    form.append("file", imageFile);
    form.append("upload_preset", "Ecommerce");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dcvqpxjsc/image/upload",
        {
          method: "POST",
          body: form,
        }
      );

      const data = await res.json();

      if (!data.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

      setUploadedImageUrl(data.secure_url);

      // ✅ sync with formData (edit + add)
      if (setFormData) {
        setFormData((prev) => ({
          ...prev,
          image: data.secure_url,
        }));
      }
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Image upload failed. Try again.");
    } finally {
      setImageLoadingState(false);
    }
  }

  /* ----------------------------- effects ------------------------------ */

  useEffect(() => {
    if (imageFile) uploadImageToCloudinary();
  }, [imageFile]);

  /* --------------------------- safe preview --------------------------- */

  const previewImage =
    formData?.image || uploadedImageUrl || "";

  /* ------------------------------ render ------------------------------ */

  return (
    <div className="w-full mt-4 max-w-md mx-auto">
      <Label className="text-lg font-semibold mb-2 block">
        Upload Highlights
      </Label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-lg p-4"
      >
        <Input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleImageFileChange}
        />

        {!imageFile ? (
          <Label
            className="flex flex-col items-center justify-center h-32 cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileIcon className="w-6 h-6 text-primary" />
              <p className="text-sm font-medium">{imageFile.name}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        )}

        {previewImage && !imageLoadingState && (
          <img
            src={previewImage}
            alt="Preview"
            className="mt-4 rounded-md max-h-40"
          />
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
