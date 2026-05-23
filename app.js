const domains = [
  { id: "execution", name: "执行力", english: "Executing", color: "#6d3387" },
  { id: "influence", name: "影响力", english: "Influencing", color: "#e77721" },
  { id: "relationship", name: "关系建立", english: "Relationship Building", color: "#2872a9" },
  { id: "strategic", name: "战略思维", english: "Strategic Thinking", color: "#15977f" },
];

const talents = [
  { name: "成就", english: "Achiever", domain: "execution", page: 13, aliases: ["成就感"] },
  { name: "统筹", english: "Arranger", domain: "execution", page: 14, aliases: ["安排"] },
  { name: "信仰", english: "Belief", domain: "execution", page: 15, aliases: ["信念"] },
  { name: "审慎", english: "Deliberative", domain: "execution", page: 16, aliases: ["慎重"] },
  { name: "纪律", english: "Discipline", domain: "execution", page: 17, aliases: ["规范性"] },
  { name: "公平", english: "Consistency", domain: "execution", page: 18, aliases: ["一致性"] },
  { name: "专注", english: "Focus", domain: "execution", page: 19, aliases: ["目标志向"] },
  { name: "责任", english: "Responsibility", domain: "execution", page: 20, aliases: ["责任感"] },
  { name: "排难", english: "Restorative", domain: "execution", page: 21, aliases: ["修复"] },

  { name: "沟通", english: "Communication", domain: "influence", page: 33, aliases: ["沟通力"] },
  { name: "竞争", english: "Competition", domain: "influence", page: 34, aliases: ["竞争性"] },
  { name: "行动", english: "Activator", domain: "influence", page: 35, aliases: ["行动力"] },
  { name: "完美", english: "Maximizer", domain: "influence", page: 36, aliases: ["追求卓越"] },
  { name: "自信", english: "Self-Assurance", domain: "influence", page: 37, aliases: ["自我确信"] },
  { name: "追求", english: "Significance", domain: "influence", page: 38, aliases: ["重要性"] },
  { name: "取悦", english: "Woo", domain: "influence", page: 39, aliases: ["社交"] },
  { name: "统率", english: "Command", domain: "influence", page: 40, aliases: ["命令"] },

  { name: "适应", english: "Adaptability", domain: "relationship", page: 23, aliases: ["适应性"] },
  { name: "关联", english: "Connectedness", domain: "relationship", page: 24, aliases: ["连结"] },
  { name: "伯乐", english: "Developer", domain: "relationship", page: 25, aliases: ["发展他人"] },
  { name: "体谅", english: "Empathy", domain: "relationship", page: 26, aliases: ["共情"] },
  { name: "和谐", english: "Harmony", domain: "relationship", page: 27, aliases: ["调停"] },
  { name: "包容", english: "Inclusiveness", domain: "relationship", page: 28, aliases: ["包容性"] },
  { name: "个别", english: "Individualization", domain: "relationship", page: 29, aliases: ["个别化"] },
  { name: "积极", english: "Positivity", domain: "relationship", page: 30, aliases: ["积极性"] },
  { name: "交往", english: "Relator", domain: "relationship", page: 31, aliases: ["亲密"] },

  { name: "战略", english: "Strategic", domain: "strategic", page: 4, aliases: ["战略性"] },
  { name: "分析", english: "Analytical", domain: "strategic", page: 5, aliases: ["分析思维"] },
  { name: "回顾", english: "Context", domain: "strategic", page: 6, aliases: ["原点思考"] },
  { name: "前瞻", english: "Futuristic", domain: "strategic", page: 7, aliases: ["未来志向"] },
  { name: "理念", english: "Ideation", domain: "strategic", page: 8, aliases: ["奇想"] },
  { name: "搜集", english: "Input", domain: "strategic", page: 9, aliases: ["收集"] },
  { name: "思维", english: "Intellection", domain: "strategic", page: 10, aliases: ["内省"] },
  { name: "学习", english: "Learner", domain: "strategic", page: 11, aliases: ["学习欲"] },
];

const input = document.querySelector("#talentInput");
const datalist = document.querySelector("#talentList");
const tabs = document.querySelector("#domainTabs");
const list = document.querySelector("#talentListView");
const viewer = document.querySelector(".viewer");
const badge = document.querySelector("#domainBadge");
const title = document.querySelector("#activeTitle");
const meta = document.querySelector("#activeMeta");
const image = document.querySelector("#pageImage");
const orderedPages = document.querySelector("#orderedPages");
const emptyState = document.querySelector("#emptyState");
const pdfLink = document.querySelector("#pdfLink");
const testStatus = document.querySelector("#testStatus");
const resultEntry = document.querySelector("#resultEntry");
const resultScope = document.querySelector("#resultScope");
const rankGrid = document.querySelector("#rankGrid");
const usernameInput = document.querySelector("#usernameInput");
const userList = document.querySelector("#userList");
const userLoginButton = document.querySelector("#userLoginButton");
const userClearButton = document.querySelector("#userClearButton");
const userStatus = document.querySelector("#userStatus");

let activeTalent = talents.find((talent) => talent.name === "战略");
let activeDomain = activeTalent.domain;
let testMode = "untested";
let resultCount = 5;
const rankedTalents = Array(10).fill("");
let currentUser = "";

const storageKey = "gallupTalentToolUsers";
const lastUserKey = "gallupTalentToolLastUser";

function normalize(value) {
  return value.toLowerCase().replace(/\s+/g, "");
}

function normalizeUsername(value) {
  return value.trim().replace(/\s+/g, " ");
}

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

function writeUsers(users) {
  localStorage.setItem(storageKey, JSON.stringify(users));
}

function userState() {
  return {
    testMode,
    resultCount,
    rankedTalents: [...rankedTalents],
    activeTalent: activeTalent?.name || "",
  };
}

function blankUserState() {
  return {
    testMode: "untested",
    resultCount: 5,
    rankedTalents: Array(10).fill(""),
    activeTalent: "战略",
  };
}

function applyUserState(state) {
  testMode = state?.testMode === "tested" ? "tested" : "untested";
  resultCount = Number(state?.resultCount) === 10 ? 10 : 5;
  rankedTalents.splice(0, rankedTalents.length, ...Array(10).fill(""));
  (state?.rankedTalents || []).slice(0, 10).forEach((talentName, index) => {
    rankedTalents[index] = talentName;
  });

  const savedTalent = findTalent(state?.activeTalent || rankedTalents.find(Boolean) || "");
  if (savedTalent) {
    activeTalent = savedTalent;
    activeDomain = savedTalent.domain;
    input.value = savedTalent.name;
  }
}

function saveCurrentUser() {
  if (!currentUser) return;
  const users = readUsers();
  users[currentUser] = userState();
  writeUsers(users);
  localStorage.setItem(lastUserKey, currentUser);
  renderUserList();
  renderUserStatus();
}

function renderUserList() {
  userList.innerHTML = "";
  Object.keys(readUsers())
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"))
    .forEach((username) => {
      const option = document.createElement("option");
      option.value = username;
      userList.append(option);
    });
}

function renderUserStatus() {
  if (!currentUser) {
    userStatus.textContent = "当前未登录，输入用户名后会自动记住才干结果。";
    return;
  }

  const filledCount = rankedTalents.filter((name) => Boolean(findTalent(name))).length;
  userStatus.textContent = `${currentUser} 已进入，已保存 ${filledCount} 个才干。`;
}

function loginUser(name) {
  const username = normalizeUsername(name);
  if (!username) {
    userStatus.textContent = "请输入用户名。";
    return;
  }

  if (currentUser && currentUser !== username) saveCurrentUser();

  const users = readUsers();
  currentUser = username;
  usernameInput.value = username;
  if (users[username]) {
    applyUserState(users[username]);
  } else {
    users[username] = blankUserState();
    writeUsers(users);
    applyUserState(users[username]);
  }
  localStorage.setItem(lastUserKey, username);
  renderUserList();
  render();
}

function logoutUser() {
  saveCurrentUser();
  currentUser = "";
  usernameInput.value = "";
  localStorage.removeItem(lastUserKey);
  renderUserStatus();
}

function pagePath(page, ext) {
  const number = String(page).padStart(2, "0");
  return ext === "pdf"
    ? `./assets/page-pdfs/page-${number}.pdf`
    : `./assets/page-images/page-${number}.png`;
}

function legacyImagePath(page) {
  const number = String(page).padStart(2, "0");
  return `./assets/page-images/page-${number}.pdf.png`;
}

function rankedTalentEntries() {
  return rankedTalents
    .slice(0, resultCount)
    .map((talentName, index) => ({ index, talent: findTalent(talentName) }))
    .filter((entry) => entry.talent);
}

function domainById(id) {
  return domains.find((domain) => domain.id === id);
}

function talentMatches(talent, query) {
  const needle = normalize(query);
  if (!needle) return false;
  const values = [talent.name, talent.english, ...talent.aliases].map(normalize);
  return values.some((value) => value.includes(needle) || needle.includes(value));
}

function findTalent(query) {
  const exact = talents.find((talent) => normalize(talent.name) === normalize(query));
  return exact || talents.find((talent) => talentMatches(talent, query));
}

function renderDatalist() {
  talents.forEach((talent) => {
    const option = document.createElement("option");
    option.value = talent.name;
    option.label = `${talent.name} ${talent.english}`;
    datalist.append(option);
  });
}

function renderTabs() {
  tabs.innerHTML = "";
  const allButton = document.createElement("button");
  allButton.className = `domain-tab ${activeDomain === "all" ? "is-active" : ""}`;
  allButton.style.setProperty("--domain", "#4b4741");
  allButton.type = "button";
  allButton.innerHTML = "<strong>全部才干</strong><span>34 个</span>";
  allButton.addEventListener("click", () => {
    activeDomain = "all";
    render();
  });
  tabs.append(allButton);

  domains.forEach((domain) => {
    const button = document.createElement("button");
    const count = talents.filter((talent) => talent.domain === domain.id).length;
    button.className = `domain-tab ${activeDomain === domain.id ? "is-active" : ""}`;
    button.style.setProperty("--domain", domain.color);
    button.type = "button";
    button.innerHTML = `<strong>${domain.name}</strong><span>${count} 个 · ${domain.english}</span>`;
    button.addEventListener("click", () => {
      activeDomain = domain.id;
      render();
    });
    tabs.append(button);
  });
}

function renderTalentList() {
  list.innerHTML = "";
  talents
    .filter((talent) => activeDomain === "all" || talent.domain === activeDomain)
    .forEach((talent) => {
      const domain = domainById(talent.domain);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `talent-button ${activeTalent?.name === talent.name ? "is-active" : ""}`;
      button.style.setProperty("--domain", domain.color);
      button.innerHTML = `<strong>${talent.name}</strong><span>${talent.english}</span>`;
      button.addEventListener("click", () => {
        input.value = talent.name;
        setActiveTalent(talent);
      });
      list.append(button);
    });
}

function updateSegmentedButtons(container, activeValue, dataName) {
  container.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset[dataName] === String(activeValue));
  });
}

function renderRankInputs() {
  rankGrid.innerHTML = "";

  for (let index = 0; index < resultCount; index += 1) {
    const talent = findTalent(rankedTalents[index]);
    const domain = talent ? domainById(talent.domain) : null;
    const field = document.createElement("label");
    field.className = `rank-field ${talent ? "has-talent" : ""}`;
    if (domain) field.style.setProperty("--rank-color", domain.color);

    const number = document.createElement("span");
    number.className = "rank-number";
    number.textContent = String(index + 1);

    const rankInput = document.createElement("input");
    rankInput.setAttribute("list", "talentList");
    rankInput.autocomplete = "off";
    rankInput.placeholder = `第 ${index + 1} 才干`;
    rankInput.value = rankedTalents[index];
    rankInput.addEventListener("input", () => {
      rankedTalents[index] = rankInput.value;
      const matchedTalent = findTalent(rankInput.value);
      if (matchedTalent) {
        rankedTalents[index] = matchedTalent.name;
        const matchedDomain = domainById(matchedTalent.domain);
        field.classList.add("has-talent");
        field.style.setProperty("--rank-color", matchedDomain.color);
        input.value = matchedTalent.name;
        activeDomain = matchedTalent.domain;
        setActiveTalent(matchedTalent);
        renderTabs();
      } else {
        field.classList.remove("has-talent");
        field.style.removeProperty("--rank-color");
      }
      saveCurrentUser();
    });

    field.append(number, rankInput);
    rankGrid.append(field);
  }
}

function setActiveTalent(talent) {
  activeTalent = talent;
  renderViewer();
  renderTalentList();
  saveCurrentUser();
}

function renderViewer() {
  const resultEntries = testMode === "tested" ? rankedTalentEntries() : [];
  const isResultMode = testMode === "tested";
  orderedPages.innerHTML = "";
  orderedPages.hidden = true;
  image.hidden = false;
  pdfLink.hidden = false;
  document.querySelector(".page-stage").classList.toggle("is-result-mode", isResultMode && resultEntries.length > 0);

  if (isResultMode) {
    viewer.style.setProperty("--domain", "#4b4741");
    badge.textContent = "测试结果";
    title.textContent = resultCount === 5 ? "前五才干" : "前十才干";
    meta.textContent = `已录入 ${resultEntries.length}/${resultCount} 个才干，按排名顺序展示`;
    image.hidden = true;
    pdfLink.hidden = true;

    if (!resultEntries.length) {
      viewer.classList.add("is-empty");
      emptyState.textContent = `请在左侧输入${resultCount === 5 ? "前五" : "前十"}才干`;
      return;
    }

    viewer.classList.remove("is-empty");
    orderedPages.hidden = false;
    resultEntries.forEach(({ index, talent }) => {
      const domain = domainById(talent.domain);
      const card = document.createElement("article");
      card.className = "ordered-page";
      card.style.setProperty("--rank-color", domain.color);

      const head = document.createElement("div");
      head.className = "ordered-page-head";
      head.innerHTML = `<span>${index + 1}</span><strong>${talent.name}</strong><em>${talent.english} · ${domain.name}</em>`;

      const img = document.createElement("img");
      img.src = pagePath(talent.page, "png");
      img.alt = `第 ${index + 1} 才干 ${talent.name} 解读卡`;
      img.addEventListener("error", () => {
        if (!img.src.endsWith(legacyImagePath(talent.page).replace("./", ""))) {
          img.src = legacyImagePath(talent.page);
        }
      });

      card.append(head, img);
      orderedPages.append(card);
    });
    return;
  }

  if (!activeTalent) {
    viewer.classList.add("is-empty");
    title.textContent = "";
    meta.textContent = "";
    badge.textContent = "";
    emptyState.textContent = "未找到匹配才干";
    return;
  }

  const domain = domainById(activeTalent.domain);
  viewer.classList.remove("is-empty");
  viewer.style.setProperty("--domain", domain.color);
  badge.textContent = domain.name;
  title.textContent = activeTalent.name;
  meta.textContent = `${activeTalent.english} · 第 ${activeTalent.page} 页`;
  image.dataset.fallbackSrc = legacyImagePath(activeTalent.page);
  image.src = pagePath(activeTalent.page, "png");
  image.alt = `${activeTalent.name}才干解读卡`;
  pdfLink.href = pagePath(activeTalent.page, "pdf");
}

function render() {
  resultEntry.hidden = testMode !== "tested";
  updateSegmentedButtons(testStatus, testMode, "status");
  updateSegmentedButtons(resultScope, resultCount, "count");
  if (testMode === "tested") renderRankInputs();
  renderTabs();
  renderTalentList();
  renderViewer();
  renderUserStatus();
}

input.addEventListener("input", () => {
  const talent = findTalent(input.value);
  if (talent) {
    activeDomain = talent.domain;
    setActiveTalent(talent);
    renderTabs();
    return;
  }
  activeTalent = null;
  renderViewer();
  renderTalentList();
});

image.addEventListener("error", () => {
  if (image.dataset.fallbackSrc && !image.src.endsWith(image.dataset.fallbackSrc.replace("./", ""))) {
    image.src = image.dataset.fallbackSrc;
    return;
  }
  viewer.classList.add("is-empty");
});

image.addEventListener("load", () => {
  if (activeTalent) viewer.classList.remove("is-empty");
});

testStatus.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-status]");
  if (!button) return;
  testMode = button.dataset.status;
  saveCurrentUser();
  render();
});

resultScope.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-count]");
  if (!button) return;
  resultCount = Number(button.dataset.count);
  saveCurrentUser();
  render();
});

userLoginButton.addEventListener("click", () => {
  loginUser(usernameInput.value);
});

usernameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") loginUser(usernameInput.value);
});

userClearButton.addEventListener("click", () => {
  logoutUser();
});

renderDatalist();
renderUserList();
const lastUser = localStorage.getItem(lastUserKey);
if (lastUser && readUsers()[lastUser]) loginUser(lastUser);
input.value = activeTalent.name;
render();
