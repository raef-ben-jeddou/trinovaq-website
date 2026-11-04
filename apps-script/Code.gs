/**
 * TrinovaQ "Request a demo" receiver: Google Apps Script web app.
 *
 * The website's demo form POSTs JSON here. Each valid request is appended
 * as a row to the "demo_requests" tab of the Google Sheet this script is
 * bound to, and a notification email goes to NOTIFY_TO.
 *
 * Setup and redeploy steps: see "Demo-request submissions" in README.md.
 */

// Optional: ID of the Google Sheet to write to (the part between /d/ and /edit in its URL).
// Leave empty when this script was opened from the Sheet itself (Extensions > Apps Script).
// Set it when the script is a standalone project (created at script.google.com).
const SHEET_ID = "";
const SHEET_NAME = "demo_requests";
const NOTIFY_TO = "Contact@trinovaq.io";
const HEADERS = ["created_at", "name", "email", "company", "role", "message"];
const MAX_LEN = { name: 200, email: 320, company: 200, role: 200, message: 5000 };
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Run once by hand from the Apps Script editor: creates the tab and header row, and triggers authorization. */
function setup() {
  getSheet_();
}

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    // Honeypot: bots fill the hidden "website" field. Pretend success, store nothing.
    if (data.website) return json_({ ok: true });

    const req = {
      name: clean_(data.name, MAX_LEN.name),
      email: clean_(data.email, MAX_LEN.email),
      company: clean_(data.company, MAX_LEN.company),
      role: clean_(data.role, MAX_LEN.role),
      message: clean_(data.message, MAX_LEN.message),
    };
    if (!req.name || !EMAIL_RE.test(req.email)) return json_({ ok: false, error: "invalid" });

    const sheet = getSheet_();
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      sheet.appendRow([new Date(), req.name, req.email, req.company, req.role, req.message].map(cellSafe_));
    } finally {
      lock.releaseLock();
    }

    notify_(req, sheet);
    return json_({ ok: true });
  } catch (err) {
    console.error("doPost failed: " + (err && err.stack ? err.stack : err));
    return json_({ ok: false, error: "server" });
  }
}

/** Email the team. A mail failure (e.g. daily quota) is logged but does not fail the request: the row is already saved. */
function notify_(req, sheet) {
  try {
    const subject = "New demo request: " + req.name + (req.company ? " (" + req.company + ")" : "");
    const body = [
      "A new demo request was submitted on trinovaq.io.",
      "",
      "Name:    " + req.name,
      "Email:   " + req.email,
      "Company: " + (req.company || "-"),
      "Role:    " + (req.role || "-"),
      "",
      "Message:",
      req.message || "-",
      "",
      "All requests: " + sheet.getParent().getUrl(),
      "Reply to this email to answer " + req.name + " directly.",
    ].join("\n");
    MailApp.sendEmail({ to: NOTIFY_TO, replyTo: req.email, subject: subject, body: body });
  } catch (err) {
    console.error("Notification email failed: " + err);
  }
}

function getSheet_() {
  const ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function clean_(value, max) {
  return String(value == null ? "" : value).trim().slice(0, max);
}

/** Stop spreadsheet formula injection: text starting with = + - @ (or tab/CR) is stored as plain text. */
function cellSafe_(value) {
  return typeof value === "string" && /^[=+\-@\t\r]/.test(value) ? "'" + value : value;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
