/* =========================================
   CONTACT FORM
   Opens a pre-filled email draft
   ========================================= */

(() => {
  "use strict";

  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("contact-feedback");

  if (!form || !feedback) return;

  // Replace this with your real email address.
  const recipient = "YOUR_EMAIL@example.com";

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    if (recipient === "YOUR_EMAIL@example.com") {
      feedback.textContent =
        "Setup required: replace YOUR_EMAIL@example.com in contact.js with your email address.";
      feedback.style.color = "#FBBF24";
      return;
    }

    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const emailSubject = `Portfolio enquiry: ${subject}`;

    const emailBody = [
      `Name: ${name}`,
      `Reply email: ${email}`,
      `Topic: ${subject}`,
      "",
      "Message:",
      message
    ].join("\n");

    const mailto =
      `mailto:${recipient}` +
      `?subject=${encodeURIComponent(emailSubject)}` +
      `&body=${encodeURIComponent(emailBody)}`;

    feedback.style.color = "#A4E8D0";
    feedback.textContent =
      "Opening your email app with the message prepared…";

    window.location.href = mailto;
  });
})();