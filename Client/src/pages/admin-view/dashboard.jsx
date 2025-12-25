import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) {
      alert("Please upload an image first.");
      return;
    }

    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());

        // ✅ clear UI only (Option 1 – correct behavior)
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  function handleDeleteImage(id) {
    axios
      .delete(`http://localhost:5000/api/common/feature/${id}`)
      .then((res) => {
        if (res.data.success) {
          dispatch(getFeatureImages());
        } else {
          alert("Delete failed.");
        }
      })
      .catch((err) => {
        console.error("Delete error:", err.response?.data || err.message);
        alert("Delete failed.");
      });
  }

  return (
    <div className="p-4">
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        imageLoadingState={imageLoadingState}
        setImageLoadingState={setImageLoadingState}
        isCustomStyling={true}
      />

      <Button
        onClick={handleUploadFeatureImage}
        className="mt-5 w-full"
        disabled={imageLoadingState || !uploadedImageUrl}
      >
        Upload
      </Button>

      <div className="flex flex-col gap-4 mt-5">
        {featureImageList?.length > 0 ? (
          featureImageList.map((item) => (
            <div className="relative" key={item._id}>
              <img
                src={item.image}
                alt="Feature"
                className="w-full h-[300px] object-cover rounded-lg"
              />
              <Button
                onClick={() => handleDeleteImage(item._id)}
                className="absolute top-2 right-2 bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No images uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
