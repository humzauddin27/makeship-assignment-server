exports.CLIENT_ORIGIN =
  process.env.NODE_ENV === "production"
    ? "https://humzas-image-viewer.herokuapp.com/"
    : "http://localhost:3000";

exports._IMAGES = "images";

exports._COMMENTS = "comments";

exports._APPROVED = "approved";

exports._REJECTED = "rejected";
