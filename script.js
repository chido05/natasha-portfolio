const defaultCv = {
  fullName: "Natasha C Kanyungwe",
  title: "Computer Science Student",
  email: "natasha@example.com",
  phone: "+260 000 000 000",
  location: "Lusaka, Zambia",
  github: "https://github.com/",
  summary:
    "I am a computer science student passionate about software engineering, web development, and solving real-world problems through technology.",
  education:
    "BSc Computer Science (in progress)\nAdd your university, expected graduation year, and major achievements here.",
  skills: "HTML, CSS, JavaScript, Python, Git, SQL",
};

const defaultProjects = [
  {
    title: "Student Management Portal",
    description:
      "A web platform to manage student records, attendance, and report generation for a school department.",
    status: "Completed",
    tech: "HTML, CSS, JavaScript, PHP",
  },
  {
    title: "AI Study Assistant",
    description:
      "A planned productivity app that helps students summarize notes and generate study quizzes.",
    status: "Planned",
    tech: "Python, FastAPI, React",
  },
];

const cvForm = document.getElementById("cvForm");
const projectForm = document.getElementById("projectForm");
const projectList = document.getElementById("projectList");

const profileSummary = document.getElementById("profileSummary");
const skillsList = document.getElementById("skillsList");
const educationText = document.getElementById("educationText");
const footerName = document.getElementById("footerName");

function loadData(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function statusClass(status) {
  return status.toLowerCase().includes("completed") ? "completed" : "";
}

function renderCv(cv) {
  profileSummary.textContent = cv.summary;
  educationText.textContent = cv.education;
  footerName.textContent = cv.fullName;

  skillsList.innerHTML = "";
  cv.skills
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .forEach((skill) => {
      const li = document.createElement("li");
      li.textContent = skill;
      skillsList.appendChild(li);
    });

  for (const [key, value] of Object.entries(cv)) {
    const input = cvForm.elements.namedItem(key);
    if (input) input.value = value;
  }
}

function renderProjects(projects) {
  projectList.innerHTML = "";
  projects.forEach((project, index) => {
    const card = document.createElement("article");
    card.className = "project-card";
    card.innerHTML = `
      <span class="project-status ${statusClass(project.status)}">${project.status}</span>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <p class="project-tech">${project.tech || "No technologies listed yet."}</p>
      <button class="btn btn-ghost" data-index="${index}" type="button">Remove</button>
    `;
    projectList.appendChild(card);
  });
}

function getFormObject(form) {
  const fd = new FormData(form);
  return Object.fromEntries(fd.entries());
}

function init() {
  const cvData = loadData("natasha_cv", defaultCv);
  const projectData = loadData("natasha_projects", defaultProjects);

  renderCv(cvData);
  renderProjects(projectData);

  cvForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const payload = getFormObject(cvForm);
    saveData("natasha_cv", payload);
    renderCv(payload);
    alert("CV details saved.");
  });

  projectForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const payload = getFormObject(projectForm);
    const allProjects = loadData("natasha_projects", defaultProjects);
    allProjects.unshift(payload);
    saveData("natasha_projects", allProjects);
    renderProjects(allProjects);
    projectForm.reset();
  });

  projectList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const index = Number(target.dataset.index);
    if (Number.isNaN(index)) return;
    const allProjects = loadData("natasha_projects", defaultProjects);
    allProjects.splice(index, 1);
    saveData("natasha_projects", allProjects);
    renderProjects(allProjects);
  });
}

init();
