const app = require("./app");
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Student Registration API running at http://localhost:${PORT}`));
