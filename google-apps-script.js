/**
 * Google Apps Script - Shared Database Engine for IoT Club
 * 
 * INSTRUCTIONS FOR REDEPLOYMENT:
 * 1. Go to your Google Sheet: Extensions -> Apps Script.
 * 2. Delete the old code completely.
 * 3. Paste this updated code with String safety conversions and click Save.
 * 4. Click Deploy -> New Deployment (or Manage Deployments -> Edit).
 * 5. CRITICAL FOR CORS/API ACCESS:
 *    - Set "Execute as" to: "Me (your-email@gmail.com)"
 *    - Set "Who has access" to: "Anyone" (This is required to allow the frontend to fetch data without CORS blocks).
 * 6. Click Deploy.
 * 7. Copy the new Web App URL and paste it in `src/data/store.tsx` as `APPS_SCRIPT_URL`.
 */

const DRIVE_FOLDER_ID = ""; // Insert your Google Drive Folder ID if you want file uploads saved to Google Drive.

function doGet(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Fetch all records
    const members = getSheetData(spreadsheet.getSheetByName("Members"));
    const projects = getSheetData(spreadsheet.getSheetByName("Projects"));
    const achievements = getSheetData(spreadsheet.getSheetByName("Achievements"));
    const events = getSheetData(spreadsheet.getSheetByName("Events"));
    
    const responseData = {
      members: members,
      projects: projects,
      achievements: achievements,
      events: events
    };

    return ContentService.createTextOutput(JSON.stringify(responseData))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    if (action === "signup") {
      return handleSignUp(spreadsheet, postData.payload);
    } else if (action === "login") {
      return handleLogin(spreadsheet, postData.payload);
    } else if (action === "update_profile") {
      return handleUpdateProfile(spreadsheet, postData.payload);
    } else if (action === "admin_crud") {
      return handleAdminCrud(spreadsheet, postData.payload);
    } else {
      throw new Error("Invalid database action request.");
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Fetch spreadsheet data row columns mapped to headers
function getSheetData(sheet) {
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const records = [];
  
  for (let r = 1; r < data.length; r++) {
    const row = data[r];
    const record = {};
    for (let c = 0; c < headers.length; c++) {
      const header = headers[c];
      let value = row[c];
      
      // Parse array columns
      if (typeof value === "string" && (value.startsWith("[") || value.includes(","))) {
        try {
          if (value.startsWith("[")) {
            value = JSON.parse(value);
          } else {
            value = value.split(",").map(s => s.trim()).filter(Boolean);
          }
        } catch(e) {}
      }
      
      // Parse JSON objects (like socials)
      if (typeof value === "string" && value.startsWith("{")) {
        try {
          value = JSON.parse(value);
        } catch(e) {}
      }
      
      record[header] = value;
    }
    records.push(record);
  }
  return records;
}

// Handle Student Member Sign-Up
function handleSignUp(spreadsheet, payload) {
  const sheet = spreadsheet.getSheetByName("Members");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Find email column case-insensitively with String conversion safety
  const emailColIdx = headers.map(h => String(h).toLowerCase().trim()).indexOf("email");
  if (emailColIdx !== -1) {
    for (let r = 1; r < data.length; r++) {
      if (String(data[r][emailColIdx]).toLowerCase().trim() === String(payload.email).toLowerCase().trim()) {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Email is already registered." }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
  }

  // Create new user record
  const newRow = new Array(headers.length).fill("");
  
  // Save Base64 file to Google Drive if provided
  let photoUrl = payload.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300";
  if (payload.photoBase64 && DRIVE_FOLDER_ID) {
    photoUrl = uploadBase64File(payload.photoBase64, payload.photoName || "photo.jpg");
  }

  const id = "m_" + new Date().getTime();
  
  const getPayloadValue = (keys, defaultVal = "") => {
    const foundKey = Object.keys(payload).find(k => keys.includes(String(k).toLowerCase().trim()));
    if (foundKey && payload[foundKey] !== undefined) return payload[foundKey];
    if (payload.socials) {
      const socialKey = Object.keys(payload.socials).find(k => keys.includes(String(k).toLowerCase().trim()));
      if (socialKey && payload.socials[socialKey] !== undefined) return payload.socials[socialKey];
    }
    return defaultVal;
  };

  // Map payload fields
  for (let c = 0; c < headers.length; c++) {
    const header = String(headers[c]).toLowerCase().trim();
    if (header === "id") newRow[c] = id;
    else if (header === "email") newRow[c] = getPayloadValue(["email"]);
    else if (header === "password") newRow[c] = getPayloadValue(["password"]);
    else if (header === "name") newRow[c] = getPayloadValue(["name"]);
    else if (header === "year") newRow[c] = getPayloadValue(["year"]) || "SE";
    else if (header === "position") newRow[c] = getPayloadValue(["position"]) || "Member";
    else if (header === "photo") newRow[c] = photoUrl;
    else if (header === "bio") newRow[c] = getPayloadValue(["bio"]);
    else if (header === "linkedin") newRow[c] = getPayloadValue(["linkedin"]);
    else if (header === "github") newRow[c] = getPayloadValue(["github"]);
    else if (header === "portfolio") newRow[c] = getPayloadValue(["portfolio"]);
    else if (header === "phone") newRow[c] = getPayloadValue(["phone"]);
    else if (header === "skillstech") newRow[c] = JSON.stringify(getPayloadValue(["skillstech"]) || []);
    else if (header === "skillssoft") newRow[c] = JSON.stringify(getPayloadValue(["skillssoft"]) || []);
    else if (header === "education") newRow[c] = JSON.stringify(getPayloadValue(["education"]) || []);
    else if (header === "projects") newRow[c] = "[]";
    else if (header === "achievements") newRow[c] = "[]";
    else if (header === "certifications") newRow[c] = "[]";
  }

  sheet.appendRow(newRow);
  
  return ContentService.createTextOutput(JSON.stringify({ status: "success", memberId: id }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Handle Student Member Login
function handleLogin(spreadsheet, payload) {
  const sheet = spreadsheet.getSheetByName("Members");
  const data = sheet.getDataRange().getValues();
  const headers = data[0].map(h => String(h).toLowerCase().trim());
  
  const emailCol = headers.indexOf("email");
  const passCol = headers.indexOf("password");
  const idCol = headers.indexOf("id");
  const nameCol = headers.indexOf("name");
  
  for (let r = 1; r < data.length; r++) {
    if (String(data[r][emailCol]).toLowerCase().trim() === String(payload.email).toLowerCase().trim() && 
        String(data[r][passCol]) === String(payload.password)) {
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "success", 
        memberId: data[r][idCol],
        name: data[r][nameCol]
      }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Invalid email or password credentials." }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Handle Profile Updates for a Logged-In Student
function handleUpdateProfile(spreadsheet, payload) {
  const sheet = spreadsheet.getSheetByName("Members");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const idCol = headers.map(h => String(h).toLowerCase().trim()).indexOf("id");
  let foundRow = -1;
  
  for (let r = 1; r < data.length; r++) {
    if (data[r][idCol] === payload.id) {
      foundRow = r + 1; // 1-indexed row number
      break;
    }
  }

  if (foundRow === -1) {
    throw new Error("Student record not found in directory.");
  }

  // Handle Base64 file uploads if they are set
  let photoUrl = payload.photo;
  if (payload.photoBase64 && DRIVE_FOLDER_ID) {
    photoUrl = uploadBase64File(payload.photoBase64, payload.photoName || "photo.jpg");
  }

  let resumeUrl = payload.resumeUrl;
  if (payload.resumeBase64 && DRIVE_FOLDER_ID) {
    resumeUrl = uploadBase64File(payload.resumeBase64, payload.resumeName || "resume.pdf");
  }

  const getPayloadValue = (keys, defaultVal = undefined) => {
    // Check flat payload first
    let foundKey = Object.keys(payload).find(k => keys.includes(String(k).toLowerCase().trim()));
    if (foundKey && payload[foundKey] !== undefined) return payload[foundKey];
    
    // Check inside socials
    if (payload.socials) {
      foundKey = Object.keys(payload.socials).find(k => keys.includes(String(k).toLowerCase().trim()));
      if (foundKey && payload.socials[foundKey] !== undefined) return payload.socials[foundKey];
    }
    
    return defaultVal;
  };

  // Map values to update
  for (let c = 0; c < headers.length; c++) {
    const header = String(headers[c]).toLowerCase().trim();
    if (header === "id" || header === "password" || header === "email") continue;
    
    let val = undefined;
    if (header === "name") val = getPayloadValue(["name"]);
    else if (header === "position") val = getPayloadValue(["position"]);
    else if (header === "year") val = getPayloadValue(["year"]);
    else if (header === "bio") val = getPayloadValue(["bio"]);
    else if (header === "linkedin") val = getPayloadValue(["linkedin"]);
    else if (header === "github") val = getPayloadValue(["github"]);
    else if (header === "portfolio") val = getPayloadValue(["portfolio"]);
    else if (header === "phone") val = getPayloadValue(["phone"]);
    else if (header === "skillstech") val = getPayloadValue(["skillstech"]);
    else if (header === "skillssoft") val = getPayloadValue(["skillssoft"]);
    else if (header === "education") val = getPayloadValue(["education"]);
    else if (header === "projects") val = getPayloadValue(["projects"]);
    else if (header === "achievements") val = getPayloadValue(["achievements"]);
    else if (header === "certifications") val = getPayloadValue(["certifications"]);
    
    if (val !== undefined) {
      if (Array.isArray(val) || typeof val === "object") {
        val = JSON.stringify(val);
      }
      sheet.getRange(foundRow, c + 1).setValue(val);
    }
  }

  // Handle individual updates if photo/resume changed
  if (photoUrl) {
    const photoIdx = headers.map(h => String(h).toLowerCase().trim()).indexOf("photo");
    if (photoIdx !== -1) sheet.getRange(foundRow, photoIdx + 1).setValue(photoUrl);
  }
  if (resumeUrl) {
    const resumeIdx = headers.map(h => String(h).toLowerCase().trim()).indexOf("resumeurl");
    if (resumeIdx !== -1) sheet.getRange(foundRow, resumeIdx + 1).setValue(resumeUrl);
  }

  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Handle Admin CRUD modifications (Add, Edit, Delete)
function handleAdminCrud(spreadsheet, payload) {
  const targetSheetName = payload.sheet; // "Members", "Projects", "Achievements", "Events"
  const sheet = spreadsheet.getSheetByName(targetSheetName);
  if (!sheet) throw new Error("Catalog sheet not found.");
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.map(h => String(h).toLowerCase().trim()).indexOf("id");
  
  const operation = payload.operation; // "add", "edit", "delete"
  
  if (operation === "add") {
    const newRow = new Array(headers.length).fill("");
    const id = "c_" + new Date().getTime();
    payload.record.id = id;
    
    for (let c = 0; c < headers.length; c++) {
      const key = headers[c];
      let val = payload.record[key];
      if (val !== undefined) {
        if (Array.isArray(val) || typeof val === "object") val = JSON.stringify(val);
        newRow[c] = val;
      }
    }
    sheet.appendRow(newRow);
    return ContentService.createTextOutput(JSON.stringify({ status: "success", id: id }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } else {
    let foundRow = -1;
    for (let r = 1; r < data.length; r++) {
      if (data[r][idCol] === payload.id) {
        foundRow = r + 1;
        break;
      }
    }
    
    if (foundRow === -1) throw new Error("Entry not found.");
    
    if (operation === "edit") {
      for (let c = 0; c < headers.length; c++) {
        const key = headers[c];
        let val = payload.record[key];
        if (val !== undefined && key !== "id") {
          if (Array.isArray(val) || typeof val === "object") val = JSON.stringify(val);
          sheet.getRange(foundRow, c + 1).setValue(val);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
        .setMimeType(ContentService.MimeType.JSON);
        
    } else if (operation === "delete") {
      sheet.deleteRow(foundRow);
      return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
}

// Upload Base64 Files to Google Drive folder
function uploadBase64File(base64Data, filename) {
  try {
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const contentType = base64Data.substring(base64Data.indexOf(":") + 1, base64Data.indexOf(";"));
    const rawBase64 = base64Data.substring(base64Data.indexOf(",") + 1);
    const decoded = Utilities.base64Decode(rawBase64);
    const blob = Utilities.newBlob(decoded, contentType, filename);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
    return file.getUrl();
  } catch(e) {
    return ""; // Return empty string on configuration failure
  }
}
