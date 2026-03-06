document.addEventListener("DOMContentLoaded", () => {
  const listEl = document.getElementById("saved-list");
  const subtitle = document.getElementById("dash-subtitle");

  async function loadUser() {
    try {
      const res = await apiRequest("/auth/me");
      if (subtitle && res.user) {
        subtitle.textContent = `Logged in as ${res.user.name}`;
      }
    } catch {
      // If token invalid, go back to login
      window.location.href = "login.html";
    }
  }

  async function loadQrs() {
    if (!listEl) return;
    listEl.innerHTML = "<p class=\"hint\">Loading...</p>";
    try {
      const res = await apiRequest("/qrs");
      const items = res.items || [];
      if (!items.length) {
        listEl.innerHTML = "<p class=\"hint\">No saved QR codes yet.</p>";
        return;
      }

      listEl.innerHTML = "";
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
        date.textContent = new Date(item.createdAt).toLocaleString();
        header.appendChild(title);
        header.appendChild(date);

        const preview = document.createElement("div");
        preview.className = "saved-preview";
        const qrDiv = document.createElement("div");
        preview.appendChild(qrDiv);

        // Re-generate a simple QR preview based on saved content/options
        const size = (item.options && item.options.size) || 160;
        const colorDark = (item.options && item.options.colorDark) || "#111827";
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
        deleteBtn.addEventListener("click", async () => {
          if (!confirm("Delete this QR code?")) return;
          try {
            await apiRequest(`/qrs/${item._id}`, { method: "DELETE" });
            await loadQrs();
          } catch (err) {
            alert(err.message);
          }
        });

        actions.appendChild(downloadBtn);
        actions.appendChild(deleteBtn);

        card.appendChild(header);
        card.appendChild(preview);
        card.appendChild(actions);
        listEl.appendChild(card);
      });
    } catch (err) {
      listEl.innerHTML =
        "<p class=\"hint\">Failed to load saved QR codes. Try again.</p>";
    }
  }

  loadUser();
  loadQrs();
});

