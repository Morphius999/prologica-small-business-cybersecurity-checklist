const checklistData = [
  {
    category: "Passwords",
    items: [
      "Use unique passwords for every business account.",
      "Store passwords in a trusted password manager.",
      "Require passwords with at least 12 characters.",
      "Remove shared passwords where individual accounts are available."
    ]
  },
  {
    category: "Two-Factor Authentication",
    items: [
      "Enable two-factor authentication on email accounts.",
      "Enable two-factor authentication on banking and payment tools.",
      "Use authenticator apps or security keys where possible.",
      "Keep backup codes stored securely."
    ]
  },
  {
    category: "Email Security",
    items: [
      "Train staff to spot phishing and suspicious attachments.",
      "Verify payment or wiring requests through a second channel.",
      "Use spam and malware filtering for business email.",
      "Set up SPF, DKIM, and DMARC for the company domain."
    ]
  },
  {
    category: "Software Updates",
    items: [
      "Turn on automatic updates for operating systems.",
      "Keep browsers and business apps current.",
      "Remove software that is no longer used.",
      "Track critical systems that need manual updates."
    ]
  },
  {
    category: "Backups",
    items: [
      "Back up important files and business records regularly.",
      "Store at least one backup away from primary devices.",
      "Test restoring files from backup.",
      "Protect backups with encryption or strong access controls."
    ]
  },
  {
    category: "Device Security",
    items: [
      "Require screen locks on computers, phones, and tablets.",
      "Use full-disk encryption on laptops and portable devices.",
      "Install reputable endpoint protection where appropriate.",
      "Keep an inventory of business-owned devices."
    ]
  },
  {
    category: "Access Control",
    items: [
      "Give each person their own account.",
      "Grant access only to systems each person needs.",
      "Remove access immediately when staff or vendors leave.",
      "Review administrator accounts regularly."
    ]
  },
  {
    category: "Network Security",
    items: [
      "Use a strong password on business Wi-Fi.",
      "Separate guest Wi-Fi from business systems.",
      "Change default router and firewall passwords.",
      "Keep network equipment firmware updated."
    ]
  },
  {
    category: "Incident Response",
    items: [
      "Keep a written list of emergency technology contacts.",
      "Document what to do if email, payments, or files are compromised.",
      "Know how to disconnect affected devices from the network.",
      "Review cyber insurance and reporting requirements."
    ]
  }
];

const STORAGE_KEY = "prologicaCybersecurityChecklist";

const checklistEl = document.getElementById("checklist");
const progressPercentageEl = document.getElementById("progressPercentage");
const progressFillEl = document.getElementById("progressFill");
const riskLevelEl = document.getElementById("riskLevel");
const resetButton = document.getElementById("resetButton");

function getSavedState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getItemId(categoryIndex, itemIndex) {
  return `item-${categoryIndex}-${itemIndex}`;
}

function renderChecklist() {
  const savedState = getSavedState();

  checklistData.forEach((group, categoryIndex) => {
    const card = document.createElement("article");
    card.className = "category-card";

    const heading = document.createElement("h2");
    heading.textContent = group.category;

    const list = document.createElement("ul");
    list.className = "checklist-items";

    group.items.forEach((item, itemIndex) => {
      const itemId = getItemId(categoryIndex, itemIndex);
      const listItem = document.createElement("li");
      listItem.className = "checklist-item";

      const label = document.createElement("label");
      label.setAttribute("for", itemId);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = itemId;
      checkbox.checked = Boolean(savedState[itemId]);

      const labelText = document.createElement("span");
      labelText.textContent = item;

      label.append(checkbox, labelText);
      listItem.appendChild(label);
      list.appendChild(listItem);
    });

    card.append(heading, list);
    checklistEl.appendChild(card);
  });
}

function updateProgress() {
  const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
  const checkedCount = checkboxes.filter((checkbox) => checkbox.checked).length;
  const percentage = checkboxes.length ? Math.round((checkedCount / checkboxes.length) * 100) : 0;

  progressPercentageEl.textContent = `${percentage}%`;
  progressFillEl.style.width = `${percentage}%`;

  riskLevelEl.classList.remove("risk-high", "risk-moderate", "risk-prepared");

  if (percentage < 40) {
    riskLevelEl.textContent = "High Risk";
    riskLevelEl.classList.add("risk-high");
  } else if (percentage < 70) {
    riskLevelEl.textContent = "Moderate Risk";
    riskLevelEl.classList.add("risk-moderate");
  } else {
    riskLevelEl.textContent = "Better Prepared";
    riskLevelEl.classList.add("risk-prepared");
  }
}

function handleChecklistChange(event) {
  if (event.target.type !== "checkbox") {
    return;
  }

  const savedState = getSavedState();
  savedState[event.target.id] = event.target.checked;
  saveState(savedState);
  updateProgress();
}

function resetChecklist() {
  localStorage.removeItem(STORAGE_KEY);
  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = false;
  });
  updateProgress();
}

renderChecklist();
updateProgress();

checklistEl.addEventListener("change", handleChecklistChange);
resetButton.addEventListener("click", resetChecklist);
