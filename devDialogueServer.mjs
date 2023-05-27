import express from "express";
import serveIndex from "serve-index";

const app = express();
const port = 3001;

const LOCAL_DIR = "/mnt/f/datamining-out/_keep/dialogue-project";

app.use(serveIndex(LOCAL_DIR, { icons: true }));
app.use(express.static(LOCAL_DIR));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
