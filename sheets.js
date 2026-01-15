const { google } = require("googleapis");

async function addJobsToSheet(jobs) {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const rows = jobs.map((job) => [
    new Date().toISOString().split("T")[0],
    job.platform,
    job.company,
    job.title,
    job.link,
    "",
  ]);

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: "Sheet1!A:F",
    valueInputOption: "RAW",
    resource: { values: rows },
  });
}

module.exports = addJobsToSheet;
