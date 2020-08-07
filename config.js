exports.CLIENT_ORIGIN =
  process.env.NODE_ENV === "production"
    ? "https://react-image-upload.surge.sh"
    : "http://localhost:3000";

exports._IMAGES = "images";

exports._COMMENTS = "comments";

exports._APPROVED = "approved";

exports._REJECTED = "rejected";
