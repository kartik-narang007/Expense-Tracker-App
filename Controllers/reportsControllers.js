const path = require("path");

exports.getReportsPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "Frontend", "Reports", "index.html"));
};