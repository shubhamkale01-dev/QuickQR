// Wait until the page and qrcode.js have loaded
document.addEventListener("DOMContentLoaded", function () {
  // Navigation tabs functionality
  const navTabs = document.querySelectorAll(".nav-tab");
  const tabContents = document.querySelectorAll(".tab-content");
  
  navTabs.forEach(tab => {
    tab.addEventListener("click", function() {
      const tabName = this.getAttribute("data-tab");
      
      navTabs.forEach(t => t.classList.remove("active"));
      this.classList.add("active");
      
      tabContents.forEach(content => content.classList.add("hidden"));
      document.getElementById(`tab-${tabName}`).classList.remove("hidden");
    });
  });
  /* Sliding Tab Indicator */

const indicator = document.querySelector(".tab-indicator");

function moveIndicator(el){
indicator.style.width = el.offsetWidth + "px";
indicator.style.left = el.offsetLeft + "px";
}

moveIndicator(document.querySelector(".nav-tab.active"));

navTabs.forEach(tab=>{
tab.addEventListener("click",()=>{
moveIndicator(tab);
});
});
  const websiteUrl = document.getElementById("website-url");
  const pdfFile = document.getElementById("pdf-file");
  const appStore = document.getElementById("app-store");
  const playStore = document.getElementById("play-store");
  const contactName = document.getElementById("contact-name");
  const contactPhone = document.getElementById("contact-phone");
  const contactEmail = document.getElementById("contact-email");
  const locationUrl = document.getElementById("location-url");
  const link1 = document.getElementById("link-1");
  const link2 = document.getElementById("link-2");
  const link3 = document.getElementById("link-3");
  const formTitle = document.getElementById("form-title");
  const formUrl = document.getElementById("form-url");
  const generateBtn = document.getElementById("generate-btn");
  const downloadBtn = document.getElementById("download-btn");
  const qrPreview = document.getElementById("qr-preview");
  const colorInput = document.getElementById("qr-color");
  const bgColorInput = document.getElementById("qr-bg-color");
  const sizeInput = document.getElementById("qr-size");
  const sizeValue = document.getElementById("qr-size-value");
  const logoInput = document.getElementById("qr-logo");
  const logoDrop = document.getElementById("logo-drop");
  const patternSelect = document.getElementById("qr-pattern");
  const eyesSelect = document.getElementById("qr-eyes");
  const gradientToggle = document.getElementById("qr-gradient-toggle");
  const gradientColorInput = document.getElementById("qr-gradient-color");
  const gradientLabel = document.getElementById("qr-gradient-label");
  const frameSelect = document.getElementById("qr-frame-style");
  const frameContainer = document.getElementById("qr-frame");
  const templateButtons = document.querySelectorAll(".template-btn");
  const ctaSelect = document.getElementById("qr-cta");
  const frameCaption = document.getElementById("qr-frame-caption");
  const downloadFormatSelect = document.getElementById("download-format");
  const scanStatusDot = document.getElementById("scan-status-dot");
  const scanStatusText = document.getElementById("scan-status-text");
  const saveLocalBtn = document.getElementById("save-local-btn");
  const localSavedList = document.getElementById("local-saved-list");
  const emailSignup = document.getElementById("email-signup");
  const updateLater = document.getElementById("update-later");
  const trackAnalytics = document.getElementById("track-analytics");
  const enableGps = document.getElementById("enable-gps");

  let qrCode = null; // will hold the QRCode instance
  let currentText = ""; // remember last text so we can live-update
  let logoImage = null; // holds the uploaded logo image

  function updateFrameCaption() {
    if (!frameCaption || !ctaSelect) return;
    const value = ctaSelect.value;
    if (value === "offer") {
      frameCaption.textContent = "Get Offer";
    } else if (value === "website") {
      frameCaption.textContent = "Open Website";
    } else {
      frameCaption.textContent = "Scan Me";
    }
  }

  function hexToRgb(hex) {
    if (!hex) return null;
    let clean = hex.replace("#", "");
    if (clean.length === 3) {
      clean =
        clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
    }
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  }

  function relativeLuminance(rgb) {
    const toLinear = (c) => {
      const v = c / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    const R = toLinear(rgb.r);
    const G = toLinear(rgb.g);
    const B = toLinear(rgb.b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }

  function updateScanStatus() {
    if (!scanStatusDot || !scanStatusText) return;

    scanStatusDot.classList.remove("status-idle", "status-good", "status-warn");

    if (!currentText) {
      scanStatusDot.classList.add("status-idle");
      scanStatusText.textContent = "Waiting for content";
      return;
    }

    const fgRgb = hexToRgb(colorInput.value || "#111827");
    const bgRgb = hexToRgb(bgColorInput.value || "#ffffff");
    if (!fgRgb || !bgRgb) {
      scanStatusDot.classList.add("status-good");
      scanStatusText.textContent = "Scannability OK";
      return;
    }

    const L1 = relativeLuminance(fgRgb);
    const L2 = relativeLuminance(bgRgb);
    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);
    const contrast = (lighter + 0.05) / (darker + 0.05);

    if (contrast >= 7) {
      scanStatusDot.classList.add("status-good");
      scanStatusText.textContent = "Excellent contrast";
    } else if (contrast >= 4.5) {
      scanStatusDot.classList.add("status-good");
      scanStatusText.textContent = "Good contrast";
    } else {
      scanStatusDot.classList.add("status-warn");
      scanStatusText.textContent = "Poor contrast – adjust colors";
    }
  }

  function buildQrContent(showAlerts) {
    const activeTab = document.querySelector(".nav-tab.active").getAttribute("data-tab");
    
    if (activeTab === "website") {
      const value = websiteUrl.value.trim();
      if (!value && showAlerts) {
        alert("Please enter a website URL.");
        websiteUrl.focus();
        return null;
      }
      return value;
    }
    
    if (activeTab === "pdf") {
      const file = pdfFile.files[0];
      if (!file && showAlerts) {
        alert("Please upload a PDF file.");
        return null;
      }
      return file ? `PDF: ${file.name}` : null;
    }
    
    if (activeTab === "app") {
      const app = appStore.value.trim();
      const play = playStore.value.trim();
      if (!app && !play && showAlerts) {
        alert("Please enter at least one app store URL.");
        return null;
      }
      return `App Store: ${app}\nPlay Store: ${play}`;
    }
    
    if (activeTab === "contact") {
      const name = contactName.value.trim();
      const phone = contactPhone.value.trim();
      const email = contactEmail.value.trim();
      if (!name && !phone && !email && showAlerts) {
        alert("Please enter contact information.");
        return null;
      }
      return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`;
    }
    
    if (activeTab === "location") {
      const value = locationUrl.value.trim();
      if (!value && showAlerts) {
        alert("Please enter a location URL.");
        locationUrl.focus();
        return null;
      }
      return value;
    }
    
    if (activeTab === "linkpage") {
      const l1 = link1.value.trim();
      const l2 = link2.value.trim();
      const l3 = link3.value.trim();
      if (!l1 && !l2 && !l3 && showAlerts) {
        alert("Please enter at least one link.");
        return null;
      }
      return [l1, l2, l3].filter(l => l).join("\n");
    }
    
    if (activeTab === "form") {
      const title = formTitle.value.trim();
      const url = formUrl.value.trim();
      if (!url && showAlerts) {
        alert("Please enter a form URL.");
        formUrl.focus();
        return null;
      }
      return url;
    }
    
    return null;
  }

  function createOrUpdateQR() {
    qrPreview.style.opacity = "0.5";
    if (!currentText) return;
    
    const size = parseInt(sizeInput.value, 10) || 200;
    const colorDark = colorInput.value || "#111827";
    const colorLight = bgColorInput.value || "#ffffff";

    // Clear the preview area
    qrPreview.innerHTML = "";

    // Create a new QRCode instance
    qrCode = new QRCode(qrPreview, {
      text: currentText,
      width: size,
      height: size,
      colorDark: colorDark,
      colorLight: colorLight,
      correctLevel: QRCode.CorrectLevel.H,
    });
    setTimeout(()=>{
qrPreview.style.opacity = "1";
},150)

    const canvas = qrPreview.querySelector("canvas");

    // If we have a logo, draw it at the center of the QR code
    if (logoImage && canvas) {
      const ctx = canvas.getContext("2d");
      const logoSize = size * 0.2; // logo is 20% of QR size for better scannability
      const x = (size - logoSize) / 2;
      const y = (size - logoSize) / 2;

      // Optional: draw a white square behind the logo for better contrast
      ctx.fillStyle = colorLight;
      ctx.fillRect(x, y, logoSize, logoSize);

      ctx.drawImage(logoImage, x, y, logoSize, logoSize);
    }

    // Apply advanced styling (pattern, eyes, gradient, frame)
    if (canvas) {
      const ctx = canvas.getContext("2d");

      // Gradient over QR code (simple linear gradient)
      if (gradientToggle.checked) {
        const grad = ctx.createLinearGradient(0, 0, size, size);
        grad.addColorStop(0, colorDark);
        grad.addColorStop(1, gradientColorInput.value || "#22c55e");

        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
        ctx.globalCompositeOperation = "source-over";
      }

      // Eye style: overlay rounded eyes
      if (eyesSelect.value === "rounded") {
        const r = size * 0.09;
        const margin = size * 0.14;
        ctx.strokeStyle = colorDark;
        ctx.lineWidth = r * 0.4;
        ctx.lineCap = "round";

        function drawEye(cx, cy) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        drawEye(margin, margin); // top-left
        drawEye(size - margin, margin); // top-right
        drawEye(margin, size - margin); // bottom-left
      }
    }

    // Frame style applied via container styles
    const pattern = patternSelect.value;
    if (pattern === "rounded") {
      qrPreview.style.borderRadius = "24px";
    } else if (pattern === "dots") {
      qrPreview.style.borderRadius = "999px";
    } else {
      qrPreview.style.borderRadius = "16px";
    }

    if (frameContainer && frameSelect) {
      frameContainer.classList.remove(
        "qr-frame-none",
        "qr-frame-card",
        "qr-frame-pill",
        "qr-frame-tag"
      );

      const frame = frameSelect.value;
      if (frame === "card") {
        frameContainer.classList.add("qr-frame-card");
      } else if (frame === "pill") {
        frameContainer.classList.add("qr-frame-pill");
      } else if (frame === "tag") {
        frameContainer.classList.add("qr-frame-tag");
      } else {
        frameContainer.classList.add("qr-frame-none");
      }
    }

    updateFrameCaption();
    updateScanStatus();

    downloadBtn.disabled = false;
  }

  const LOCAL_STORAGE_KEY = "qr_local_saved";

  function readLocalSaved() {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch {
      return [];
    }
  }

  function writeLocalSaved(items) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  }

  function renderLocalSaved() {
    if (!localSavedList) return;
    const items = readLocalSaved();
    if (!items.length) {
      localSavedList.innerHTML =
        '<p class="hint">No saved QR codes yet.</p>';
      return;
    }

    localSavedList.innerHTML = "";

    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "saved-item";

      const header = document.createElement("div");
      header.className = "saved-header";
      const title = document.createElement("div");
      title.className = "saved-title";
      title.textContent = item.label || "Untitled QR";
      const date = document.createElement("div");
      date.className = "saved-date";
      date.textContent = item.createdAt
        ? new Date(item.createdAt).toLocaleString()
        : "";
      header.appendChild(title);
      header.appendChild(date);

      const preview = document.createElement("div");
      preview.className = "saved-preview";
      const qrDiv = document.createElement("div");
      preview.appendChild(qrDiv);

      // Re-generate QR for preview
      const size = (item.options && item.options.size) || 160;
      const colorDark =
        (item.options && item.options.colorDark) || "#111827";
      const colorLight =
        (item.options && item.options.colorLight) || "#ffffff";
      new QRCode(qrDiv, {
        text: item.content,
        width: size,
        height: size,
        colorDark,
        colorLight,
        correctLevel: QRCode.CorrectLevel.H,
      });

      const actions = document.createElement("div");
      actions.className = "saved-actions";

      const downloadBtn = document.createElement("button");
      downloadBtn.className = "small-btn";
      downloadBtn.textContent = "Download PNG";
      downloadBtn.addEventListener("click", () => {
        const canvas = qrDiv.querySelector("canvas");
        if (!canvas) return;
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "qr-code.png";
        link.click();
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "small-btn danger";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => {
        const rest = readLocalSaved().filter((x) => x.id !== item.id);
        writeLocalSaved(rest);
        renderLocalSaved();
      });

      actions.appendChild(downloadBtn);
      actions.appendChild(deleteBtn);

      card.appendChild(header);
      card.appendChild(preview);
      card.appendChild(actions);

      localSavedList.appendChild(card);
    });
  }

  generateBtn.addEventListener("click", function () {
    const content = buildQrContent(true);
    if (!content) return;

    currentText = content;
    createOrUpdateQR();
  });

  // Auto-update QR when content-related fields change
  function handleContentChange() {
    const content = buildQrContent(false);
    if (!content) {
      currentText = "";
      qrPreview.innerHTML =
        '<div class="placeholder-text">Your QR code will appear here</div>';
      downloadBtn.disabled = false;
      return;
    }
    currentText = content;
    createOrUpdateQR();
  }

  // Live update when settings change, if we already have text
  colorInput.addEventListener("input", function () {
    handleContentChange();
  });

  bgColorInput.addEventListener("input", function () {
    handleContentChange();
  });

  sizeInput.addEventListener("input", function () {
    sizeValue.textContent = sizeInput.value + "px";
    handleContentChange();
  });

  // Advanced options live update
  patternSelect.addEventListener("change", function () {
    handleContentChange();
  });

  eyesSelect.addEventListener("change", function () {
    handleContentChange();
  });

  gradientToggle.addEventListener("change", function () {
    gradientLabel.textContent = gradientToggle.checked ? "Gradient" : "Solid";
    handleContentChange();
  });

  gradientColorInput.addEventListener("input", function () {
    handleContentChange();
  });

  frameSelect.addEventListener("change", function () {
    handleContentChange();
  });

  if (ctaSelect) {
    ctaSelect.addEventListener("change", function () {
      updateFrameCaption();
    });
  }

  // Auto-update when user edits main content fields
  websiteUrl.addEventListener("input", handleContentChange);
  appStore.addEventListener("input", handleContentChange);
  playStore.addEventListener("input", handleContentChange);
  contactName.addEventListener("input", handleContentChange);
  contactPhone.addEventListener("input", handleContentChange);
  contactEmail.addEventListener("input", handleContentChange);
  locationUrl.addEventListener("input", handleContentChange);
  link1.addEventListener("input", handleContentChange);
  link2.addEventListener("input", handleContentChange);
  link3.addEventListener("input", handleContentChange);
  formTitle.addEventListener("input", handleContentChange);
  formUrl.addEventListener("input", handleContentChange);

  function applyTemplate(name) {
    if (name === "classic") {
      colorInput.value = "#111827";
      bgColorInput.value = "#ffffff";
      gradientToggle.checked = false;
      gradientLabel.textContent = "Solid";
      patternSelect.value = "default";
      eyesSelect.value = "square";
      frameSelect.value = "none";
      if (ctaSelect) ctaSelect.value = "scan";
    } else if (name === "brand") {
      colorInput.value = "#4f46e5";
      bgColorInput.value = "#eef2ff";
      gradientToggle.checked = true;
      gradientColorInput.value = "#22c55e";
      gradientLabel.textContent = "Gradient";
      patternSelect.value = "rounded";
      eyesSelect.value = "rounded";
      frameSelect.value = "tag";
      if (ctaSelect) ctaSelect.value = "scan";
    } else if (name === "dark") {
      colorInput.value = "#f9fafb";
      bgColorInput.value = "#020617";
      gradientToggle.checked = false;
      gradientLabel.textContent = "Solid";
      patternSelect.value = "default";
      eyesSelect.value = "square";
      frameSelect.value = "card";
      if (ctaSelect) ctaSelect.value = "scan";
    }

    if (currentText) {
      createOrUpdateQR();
    }
  }

  templateButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {

    templateButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const name = btn.getAttribute("data-template");
    applyTemplate(name);

  });
});
const galleryTemplates = document.querySelectorAll(".template-item");

galleryTemplates.forEach(item => {

item.addEventListener("click", () => {

galleryTemplates.forEach(i=>i.classList.remove("active"));
item.classList.add("active");

const name = item.getAttribute("data-template");

applyTemplate(name);

});

});
const templateItems = document.querySelectorAll(".qr-template");

templateItems.forEach(item=>{
item.addEventListener("click",()=>{

const style = item.dataset.style;

if(style==="classic"){
patternSelect.value="default";
gradientToggle.checked=false;
}

if(style==="dots"){
patternSelect.value="dots";
}

if(style==="rounded"){
patternSelect.value="rounded";
}

if(style==="colorful"){
gradientToggle.checked=true;
gradientColorInput.value="#22c55e";
}

handleContentChange();

});
});

  if (saveLocalBtn) {
    saveLocalBtn.addEventListener("click", function () {
      const content = buildQrContent(true);
      if (!content) return;

      const size = parseInt(sizeInput.value, 10) || 200;
      const item = {
        id: Date.now().toString(),
        label: websiteUrl.value.trim() || "Untitled QR",
        content,
        options: {
          size,
          colorDark: colorInput.value || "#111827",
          colorLight: bgColorInput.value || "#ffffff",
        },
        createdAt: new Date().toISOString(),
      };

      const existing = readLocalSaved();
      existing.unshift(item);
      writeLocalSaved(existing);
      renderLocalSaved();
    });
  }

  // Render saved items on load
  renderLocalSaved();

  // Logo upload: load image and update preview
  logoInput.addEventListener("change", function (event) {
    const file = event.target.files && event.target.files[0];

    if (!file) {
      // If user cleared the file input, remove logo
      logoImage = null;
      if (currentText) {
        createOrUpdateQR();
      }
      return;
    }
/* Drag & Drop Logo */

logoDrop.addEventListener("dragover",(e)=>{
e.preventDefault();
logoDrop.style.borderColor="#667eea";
});

logoDrop.addEventListener("dragleave",()=>{
logoDrop.style.borderColor="#cbd5e1";
});

logoDrop.addEventListener("drop",(e)=>{
e.preventDefault();

const file = e.dataTransfer.files[0];

if(!file) return;

const reader = new FileReader();

reader.onload = function(event){

const img = new Image();

img.onload = function(){

logoImage = img;

if(currentText){
createOrUpdateQR();
}

};

img.src = event.target.result;

};

reader.readAsDataURL(file);

});
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        logoImage = img;
        if (currentText) {
          createOrUpdateQR();
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  downloadBtn.addEventListener("click", function () {
    if (!qrCode) return;

    const format = downloadFormatSelect
      ? downloadFormatSelect.value
      : "png";

    // qrcode.js draws on a canvas element inside qrPreview
    const canvas = qrPreview.querySelector("canvas");

    // Fallback: some versions use an <img>, so handle that too
    if (!canvas) {
      const img = qrPreview.querySelector("img");
      if (!img || !img.src) return;

      const link = document.createElement("a");
      link.href = img.src;
      link.download = "qr-code." + (format === "jpeg" ? "jpg" : format);
      link.click();
      return;
    }

    let dataUrl;
    let filename = "qr-code";

    if (format === "jpeg") {
      dataUrl = canvas.toDataURL("image/jpeg");
      filename += ".jpg";
    } else if (format === "svg") {
      // Create a simple SVG wrapper that embeds the raster image
      const pngDataUrl = canvas.toDataURL("image/png");
      const size = canvas.width;
      const svg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="' +
        size +
        '" height="' +
        size +
        '"><image href="' +
        pngDataUrl +
        '" width="100%" height="100%"/></svg>';
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      dataUrl = URL.createObjectURL(blob);
      filename += ".svg";

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      link.click();

      // Revoke after a short delay
      setTimeout(() => URL.revokeObjectURL(dataUrl), 1000);
      return;
    } else {
      // default PNG
      dataUrl = canvas.toDataURL("image/png");
      filename += ".png";
    }

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
  });
});

