const domains = [
  {
    id: "execution",
    name: "执行力",
    english: "Executing",
    color: "#6d3387",
    description: "懂得如何让事情有效向前，促进其正常发展",
  },
  {
    id: "influence",
    name: "影响力",
    english: "Influencing",
    color: "#e77721",
    description: "懂得如何掌控事局和影响他人，并且吸取意见",
  },
  {
    id: "relationship",
    name: "关系建立",
    english: "Relationship Building",
    color: "#2872a9",
    description: "具备构建牢固关系的能力，从而将团队凝聚起来发挥更大力量",
  },
  {
    id: "strategic",
    name: "战略思维",
    english: "Strategic Thinking",
    color: "#15977f",
    description: "长于获取并分析信息，从而帮助团队做出更好决策",
  },
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
const domainDescription = document.querySelector("#domainDescription");
const title = document.querySelector("#activeTitle");
const meta = document.querySelector("#activeMeta");
const pageStage = document.querySelector(".page-stage");
const image = document.querySelector("#pageImage");
const orderedPages = document.querySelector("#orderedPages");
const emptyState = document.querySelector("#emptyState");
const pdfLink = document.querySelector("#pdfLink");
const testStatus = document.querySelector("#testStatus");
const resultEntry = document.querySelector("#resultEntry");
const resultScope = document.querySelector("#resultScope");
const rankGrid = document.querySelector("#rankGrid");
const resultFileInput = document.querySelector("#resultFileInput");
const resultImportButton = document.querySelector("#resultImportButton");
const importStatus = document.querySelector("#importStatus");
const recordPanel = document.querySelector("#recordPanel");
const comboEntry = document.querySelector("#comboEntry");
const comboTalentA = document.querySelector("#comboTalentA");
const comboTalentB = document.querySelector("#comboTalentB");
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
const comboTalents = ["", ""];
let currentUser = "";

const storageKey = "gallupTalentToolUsers";
const lastUserKey = "gallupTalentToolLastUser";
const externalScripts = new Map();
const freeRecordLimit = 3;
const memberPrice = "¥29/月 或 ¥199/年";
let savedRecords = [];
let isMember = false;

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
    comboTalents: [...comboTalents],
    activeTalent: activeTalent?.name || "",
    savedRecords: [...savedRecords],
    isMember,
  };
}

function blankUserState() {
  return {
    testMode: "untested",
    resultCount: 5,
    rankedTalents: Array(10).fill(""),
    comboTalents: ["", ""],
    activeTalent: "战略",
    savedRecords: [],
    isMember: false,
  };
}

function applyUserState(state) {
  testMode = ["tested", "combination"].includes(state?.testMode) ? state.testMode : "untested";
  resultCount = Number(state?.resultCount) === 10 ? 10 : 5;
  rankedTalents.splice(0, rankedTalents.length, ...Array(10).fill(""));
  (state?.rankedTalents || []).slice(0, 10).forEach((talentName, index) => {
    rankedTalents[index] = talentName;
  });
  comboTalents.splice(0, comboTalents.length, "", "");
  (state?.comboTalents || []).slice(0, 2).forEach((talentName, index) => {
    comboTalents[index] = talentName;
  });
  savedRecords = Array.isArray(state?.savedRecords)
    ? state.savedRecords
        .filter((record) => Array.isArray(record?.talents))
        .slice(0, 50)
        .map((record, index) => ({
          id: record.id || `legacy-record-${index}`,
          name: record.name || defaultRecordName(index),
          talents: record.talents.slice(0, 10),
          createdAt: record.createdAt || new Date().toISOString(),
          updatedAt: record.updatedAt,
        }))
    : [];
  isMember = Boolean(state?.isMember);

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
    userStatus.textContent = "当前未登录，才干结果和记录不会存储。";
    return;
  }

  const filledCount = rankedTalents.filter((name) => Boolean(findTalent(name))).length;
  const memberLabel = isMember ? "会员" : `免费 ${savedRecords.length}/${freeRecordLimit} 组`;
  userStatus.textContent = `${currentUser} 已进入，当前录入 ${filledCount} 个才干，记录库：${memberLabel}。`;
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
  savedRecords = [];
  isMember = false;
  renderUserStatus();
  renderRecordPanel();
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

function topTenTalentEntries() {
  return rankedTalents.slice(0, 10).map((talentName, index) => ({ index, talent: findTalent(talentName) }));
}

function completedTopTenTalents() {
  const entries = topTenTalentEntries();
  if (entries.some((entry) => !entry.talent)) return [];
  return entries.map((entry) => entry.talent);
}

function talentSignature(talentNames) {
  return talentNames.map((name) => normalize(name)).join(">");
}

function currentTopTenSignature() {
  const talentsInOrder = completedTopTenTalents();
  return talentsInOrder.length === 10 ? talentSignature(talentsInOrder.map((talent) => talent.name)) : "";
}

function recordId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `record-${Date.now()}-${Math.round(Math.random() * 100000)}`;
}

function defaultRecordName(index) {
  return `前十记录 ${index + 1}`;
}

function displayDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" });
}

function saveTopTenRecord(recordName) {
  if (!currentUser) return;

  const talentsInOrder = completedTopTenTalents();
  if (talentsInOrder.length !== 10) return;

  const names = talentsInOrder.map((talent) => talent.name);
  const signature = talentSignature(names);
  const existingRecord = savedRecords.find((record) => talentSignature(record.talents || []) === signature);
  const trimmedName = recordName.trim();

  if (existingRecord) {
    if (trimmedName) existingRecord.name = trimmedName;
    existingRecord.updatedAt = new Date().toISOString();
    saveCurrentUser();
    renderRecordPanel();
    return;
  }

  if (!isMember && savedRecords.length >= freeRecordLimit) {
    renderRecordPanel();
    return;
  }

  savedRecords.push({
    id: recordId(),
    name: trimmedName || defaultRecordName(savedRecords.length),
    talents: names,
    createdAt: new Date().toISOString(),
  });
  saveCurrentUser();
  renderRecordPanel();
}

function loadTopTenRecord(recordIdValue) {
  const record = savedRecords.find((item) => item.id === recordIdValue);
  if (!record) return;

  testMode = "tested";
  resultCount = 10;
  rankedTalents.splice(0, rankedTalents.length, ...Array(10).fill(""));
  record.talents.slice(0, 10).forEach((talentName, index) => {
    rankedTalents[index] = talentName;
  });

  const firstTalent = findTalent(record.talents[0]);
  if (firstTalent) {
    activeTalent = firstTalent;
    activeDomain = firstTalent.domain;
    input.value = firstTalent.name;
  }

  saveCurrentUser();
  render();
}

function deleteTopTenRecord(recordIdValue) {
  savedRecords = savedRecords.filter((record) => record.id !== recordIdValue);
  saveCurrentUser();
  renderRecordPanel();
  renderUserStatus();
}

function comboTalentEntries() {
  return comboTalents
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

function normalizeScanText(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/[｜|]/g, "I")
    .replace(/[“”]/g, "\"")
    .replace(/[‘’]/g, "'");
}

function compactScanText(value) {
  return normalizeScanText(value)
    .toLowerCase()
    .replace(/self[\s-]*assurance/g, "selfassurance")
    .replace(/[\s·,，.。:：;；、()（）[\]【】"'“”‘’_\-—–]+/g, "");
}

function talentVariants() {
  return talents.flatMap((talent) => {
    const englishCompact = talent.english.replace(/[\s-]+/g, "");
    const values = [talent.name, talent.english, englishCompact, ...talent.aliases];
    return [...new Set(values)]
      .sort((a, b) => b.length - a.length)
      .map((value) => ({ talent, key: compactScanText(value) }))
      .filter((entry) => entry.key.length >= 2);
  });
}

function talentInText(text) {
  const compactText = compactScanText(text);
  return talentVariants()
    .map(({ talent, key }) => ({ talent, position: compactText.indexOf(key), length: key.length }))
    .filter((entry) => entry.position >= 0)
    .sort((a, b) => a.position - b.position || b.length - a.length)[0]?.talent || null;
}

function extractRankedTalentsFromText(rawText) {
  const text = normalizeScanText(rawText);
  const lines = text
    .replace(/\r/g, "\n")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const ranked = new Map();

  lines.forEach((line, index) => {
    const rankMatch = line.match(/(?:^|[^0-9])(?:第\s*)?(10|[1-9])\s*(?:[.\-、):：]|名|位)?/);
    if (!rankMatch) return;

    const rank = Number(rankMatch[1]);
    if (ranked.has(rank)) return;

    const talent = talentInText(line) || talentInText(lines.slice(index + 1, index + 3).join(" "));
    if (talent) ranked.set(rank, talent);
  });

  const rankedMatches = [...ranked.entries()]
    .filter(([rank]) => rank >= 1 && rank <= 10)
    .sort((a, b) => a[0] - b[0])
    .map(([, talent]) => talent);

  if (rankedMatches.length >= 5) return uniqueTalents(rankedMatches).slice(0, rankedMatches.length >= 10 ? 10 : 5);

  const compactText = compactScanText(text);
  const matches = [];
  talentVariants().forEach(({ talent, key }) => {
    const position = compactText.indexOf(key);
    if (position >= 0) matches.push({ talent, position, length: key.length });
  });

  return matches
    .sort((a, b) => a.position - b.position || b.length - a.length)
    .map((match) => match.talent)
    .filter((talent, index, array) => array.findIndex((item) => item.name === talent.name) === index)
    .slice(0, 10);
}

function uniqueTalents(items) {
  return items.filter((talent, index, array) => array.findIndex((item) => item.name === talent.name) === index);
}

function setImportStatus(message) {
  importStatus.textContent = message;
}

function setImportBusy(isBusy) {
  resultImportButton.disabled = isBusy;
  resultFileInput.disabled = isBusy;
}

function loadExternalScript(src, globalName) {
  if (window[globalName]) return Promise.resolve(window[globalName]);
  if (externalScripts.has(src)) return externalScripts.get(src);

  const promise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.addEventListener("load", () => resolve(window[globalName]));
    script.addEventListener("error", () => reject(new Error("识别库加载失败")));
    document.head.append(script);
  });

  externalScripts.set(src, promise);
  return promise;
}

async function ensurePdfJs() {
  setImportStatus("加载 PDF");
  return loadExternalScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js", "pdfjsLib");
}

async function ensureTesseract() {
  setImportStatus("加载 OCR");
  return loadExternalScript("https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js", "Tesseract");
}

function applyImportedTalents(importedTalents) {
  const recognized = uniqueTalents(importedTalents).slice(0, 10);
  if (recognized.length < 5) {
    setImportStatus(`识别到 ${recognized.length} 个`);
    return false;
  }

  testMode = "tested";
  resultCount = recognized.length >= 10 ? 10 : 5;
  rankedTalents.splice(0, rankedTalents.length, ...Array(10).fill(""));
  recognized.slice(0, resultCount).forEach((talent, index) => {
    rankedTalents[index] = talent.name;
  });

  activeTalent = recognized[0];
  activeDomain = activeTalent.domain;
  input.value = activeTalent.name;
  setImportStatus(`已识别 ${resultCount} 个`);
  saveCurrentUser();
  render();
  return true;
}

async function extractTextFromPdf(file) {
  const pdfjsLib = await ensurePdfJs();

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const pageLimit = Math.min(pdf.numPages, 12);
  const chunks = [];

  for (let pageNumber = 1; pageNumber <= pageLimit; pageNumber += 1) {
    setImportStatus(`PDF ${pageNumber}/${pageLimit}`);
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    chunks.push(content.items.map((item) => item.str).join("\n"));
  }

  return chunks.join("\n");
}

async function ocrImage(imageSource) {
  const Tesseract = await ensureTesseract();

  const result = await Tesseract.recognize(imageSource, "chi_sim+eng", {
    logger(event) {
      if (event.status === "recognizing text") {
        setImportStatus(`OCR ${Math.round(event.progress * 100)}%`);
      }
    },
  });

  return result.data.text || "";
}

async function ocrPdfPages(file) {
  const pdfjsLib = await ensurePdfJs();

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const pageLimit = Math.min(pdf.numPages, 3);
  const chunks = [];

  for (let pageNumber = 1; pageNumber <= pageLimit; pageNumber += 1) {
    setImportStatus(`扫描页 ${pageNumber}/${pageLimit}`);
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.8 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: context, viewport }).promise;
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (blob) chunks.push(await ocrImage(blob));
  }

  return chunks.join("\n");
}

async function readResultFile(file) {
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    const text = await extractTextFromPdf(file);
    if (extractRankedTalentsFromText(text).length >= 5) return text;
    return `${text}\n${await ocrPdfPages(file)}`;
  }

  if (file.type.startsWith("image/")) return ocrImage(file);

  throw new Error("仅支持 PDF 或图片");
}

async function importResultFile(file) {
  if (!file) return;

  setImportBusy(true);
  setImportStatus("读取中");

  try {
    const text = await readResultFile(file);
    const recognized = extractRankedTalentsFromText(text);
    if (!applyImportedTalents(recognized)) {
      setImportStatus("请手动确认");
    }
  } catch (error) {
    setImportStatus(error.message || "识别失败");
  } finally {
    setImportBusy(false);
    resultFileInput.value = "";
  }
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
    button.innerHTML = `<strong>${domain.name}</strong><span>${count} 个 · ${domain.description}</span>`;
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
      const isSelected = activeTalent?.name === talent.name || (testMode === "combination" && comboTalents.includes(talent.name));
      button.type = "button";
      button.className = `talent-button ${isSelected ? "is-active" : ""}`;
      button.style.setProperty("--domain", domain.color);
      button.innerHTML = `<strong>${talent.name}</strong><span>${talent.english}</span>`;
      button.addEventListener("click", () => {
        if (testMode === "combination") {
          const targetIndex = comboTalents[0] ? 1 : 0;
          setComboTalent(targetIndex, talent);
          return;
        }
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
      renderRecordPanel();
    });

    field.append(number, rankInput);
    rankGrid.append(field);
  }
}

function renderRecordPanel() {
  recordPanel.innerHTML = "";
  recordPanel.hidden = testMode !== "tested";
  if (recordPanel.hidden) return;

  const completeTalents = completedTopTenTalents();
  const signature = currentTopTenSignature();
  const existingRecord = signature
    ? savedRecords.find((record) => talentSignature(record.talents || []) === signature)
    : null;

  const saveBox = document.createElement("section");
  saveBox.className = "record-save";

  const saveTitle = document.createElement("strong");
  const saveText = document.createElement("p");

  if (resultCount !== 10) {
    saveTitle.textContent = "记录库保存前十才干";
    saveText.textContent = "切换到前十才干并录满 10 个才干后，可保存为一组记录。";
    saveBox.append(saveTitle, saveText);
    recordPanel.append(saveBox);
  } else if (completeTalents.length !== 10) {
    saveTitle.textContent = "录满前十后可保存";
    saveText.textContent = currentUser
      ? "登录用户可免费保存 3 组前十记录，留空会自动命名。"
      : "当前未登录，录入内容只会临时显示，不会存储为记录。";
    saveBox.append(saveTitle, saveText);
    recordPanel.append(saveBox);
  } else if (!currentUser) {
    saveBox.classList.add("is-locked");
    saveTitle.textContent = "是否保存这组前十？";
    saveText.textContent = "请先输入用户名注册 / 进入。未登录状态不会存储测评记录。";
    saveBox.append(saveTitle, saveText);
    recordPanel.append(saveBox);
  } else if (existingRecord) {
    saveTitle.textContent = "这组前十已保存";
    saveText.textContent = "可以继续给这条记录命名，或从下方记录库加载已保存内容。";
    saveBox.append(saveTitle, saveText, recordNameControls(existingRecord.name || "", "更新名称"));
    recordPanel.append(saveBox);
  } else if (!isMember && savedRecords.length >= freeRecordLimit) {
    saveBox.classList.add("is-locked");
    saveTitle.textContent = "免费记录已满";
    saveText.textContent = `免费用户可保存 ${freeRecordLimit} 组前十记录。要保存更多不同才干记录，需要开通会员。`;
    saveBox.append(saveTitle, saveText);
    recordPanel.append(saveBox);
  } else {
    saveTitle.textContent = "是否保存这组前十？";
    saveText.textContent = `可选命名；留空会自动命名。免费记录剩余 ${isMember ? "不限" : freeRecordLimit - savedRecords.length} 组。`;
    saveBox.append(saveTitle, saveText, recordNameControls("", "保存记录"));
    recordPanel.append(saveBox);
  }

  if (!isMember && currentUser) recordPanel.append(memberCard());
  if (currentUser && savedRecords.length) recordPanel.append(recordList());
}

function recordNameControls(value, buttonText) {
  const row = document.createElement("div");
  row.className = "record-name-row";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "可选：如 2026 职业规划";
  nameInput.value = value;

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.dataset.action = "save-record";
  saveButton.textContent = buttonText;

  row.append(nameInput, saveButton);
  return row;
}

function memberCard() {
  const card = document.createElement("section");
  card.className = "member-card";

  const titleRow = document.createElement("div");
  titleRow.className = "record-title-row";

  const titleText = document.createElement("strong");
  titleText.textContent = `会员方案 ${memberPrice}`;

  const badgeText = document.createElement("p");
  badgeText.textContent = "推荐价";

  titleRow.append(titleText, badgeText);

  const description = document.createElement("p");
  description.textContent =
    "适合需要持续保存多位客户、团队成员或不同阶段测评结果的用户。价格低于一次正式测评，价值集中在记录管理和才干应用。";

  const action = document.createElement("button");
  action.type = "button";
  action.dataset.action = "membership-info";
  action.textContent = "开通会员";

  card.append(titleRow, description, action);
  return card;
}

function recordList() {
  const wrapper = document.createElement("section");
  wrapper.className = "record-list";

  savedRecords.forEach((record, index) => {
    const card = document.createElement("article");
    card.className = "record-card";

    const titleRow = document.createElement("div");
    titleRow.className = "record-title-row";

    const titleText = document.createElement("strong");
    titleText.textContent = record.name || defaultRecordName(index);

    const dateText = document.createElement("p");
    dateText.textContent = displayDate(record.updatedAt || record.createdAt);

    titleRow.append(titleText, dateText);

    const talentList = document.createElement("ol");
    record.talents.slice(0, 10).forEach((talentName) => {
      const item = document.createElement("li");
      item.textContent = talentName;
      talentList.append(item);
    });

    const actions = document.createElement("div");
    actions.className = "record-actions";

    const loadButton = document.createElement("button");
    loadButton.type = "button";
    loadButton.dataset.action = "load-record";
    loadButton.dataset.recordId = record.id;
    loadButton.textContent = "加载";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete-record";
    deleteButton.dataset.recordId = record.id;
    deleteButton.textContent = "删除";

    actions.append(loadButton, deleteButton);
    card.append(titleRow, talentList, actions);
    wrapper.append(card);
  });

  return wrapper;
}

function renderComboInputs() {
  comboTalentA.value = comboTalents[0];
  comboTalentB.value = comboTalents[1];
}

function setComboTalent(index, talent) {
  comboTalents[index] = talent.name;
  activeTalent = talent;
  activeDomain = talent.domain;
  input.value = talent.name;
  renderComboInputs();
  renderTabs();
  renderTalentList();
  renderViewer();
  saveCurrentUser();
}

function setActiveTalent(talent) {
  activeTalent = talent;
  renderViewer();
  renderTalentList();
  saveCurrentUser();
}

function renderViewer() {
  const resultEntries = testMode === "tested" ? rankedTalentEntries() : [];
  const comboEntries = testMode === "combination" ? comboTalentEntries() : [];
  const isResultMode = testMode === "tested";
  const isComboMode = testMode === "combination";
  orderedPages.innerHTML = "";
  orderedPages.hidden = true;
  orderedPages.classList.toggle("is-top-five", isResultMode && resultCount === 5);
  orderedPages.classList.toggle("is-top-ten", isResultMode && resultCount === 10);
  orderedPages.classList.toggle("is-combo", isComboMode);
  image.hidden = false;
  pdfLink.hidden = false;
  viewer.classList.toggle("is-result-view", isResultMode || isComboMode);
  pageStage.classList.toggle("is-result-mode", (isResultMode && resultEntries.length > 0) || (isComboMode && comboEntries.length > 0));

  if (isResultMode) {
    viewer.style.setProperty("--domain", "#4b4741");
    badge.textContent = "测试结果";
    domainDescription.textContent = "按排名顺序展示已输入的才干页面";
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
      head.innerHTML = `<span>${index + 1}</span><strong>${talent.name}</strong><em>${domain.name}：${domain.description}</em>`;

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
    requestAnimationFrame(() => {
      pageStage.scrollTop = 0;
    });
    return;
  }

  if (isComboMode) {
    viewer.style.setProperty("--domain", "#4b4741");
    badge.textContent = "才干组合";
    domainDescription.textContent = "从 34 个才干中任选两个，查看它们的组合";
    title.textContent = "才干组合";
    meta.textContent = `已选择 ${comboEntries.length}/2 个才干`;
    image.hidden = true;
    pdfLink.hidden = true;

    if (!comboEntries.length) {
      viewer.classList.add("is-empty");
      emptyState.textContent = "请在左侧选择两个才干";
      return;
    }

    viewer.classList.remove("is-empty");
    orderedPages.hidden = false;
    comboEntries.forEach(({ index, talent }) => {
      const domain = domainById(talent.domain);
      const card = document.createElement("article");
      card.className = "ordered-page";
      card.style.setProperty("--rank-color", domain.color);

      const head = document.createElement("div");
      head.className = "ordered-page-head";
      head.innerHTML = `<span>${index + 1}</span><strong>${talent.name}</strong><em>${domain.name}：${domain.description}</em>`;

      const img = document.createElement("img");
      img.src = pagePath(talent.page, "png");
      img.alt = `组合才干 ${index + 1} ${talent.name} 解读卡`;
      img.addEventListener("error", () => {
        if (!img.src.endsWith(legacyImagePath(talent.page).replace("./", ""))) {
          img.src = legacyImagePath(talent.page);
        }
      });

      card.append(head, img);
      orderedPages.append(card);
    });
    requestAnimationFrame(() => {
      pageStage.scrollTop = 0;
    });
    return;
  }

  if (!activeTalent) {
    viewer.classList.add("is-empty");
    title.textContent = "";
    meta.textContent = "";
    badge.textContent = "";
    domainDescription.textContent = "";
    emptyState.textContent = "未找到匹配才干";
    return;
  }

  const domain = domainById(activeTalent.domain);
  viewer.classList.remove("is-empty");
  viewer.style.setProperty("--domain", domain.color);
  badge.textContent = domain.name;
  domainDescription.textContent = domain.description;
  title.textContent = activeTalent.name;
  meta.textContent = `${activeTalent.english} · 第 ${activeTalent.page} 页`;
  image.dataset.fallbackSrc = legacyImagePath(activeTalent.page);
  image.src = pagePath(activeTalent.page, "png");
  image.alt = `${activeTalent.name}才干解读卡`;
  pdfLink.href = pagePath(activeTalent.page, "pdf");
}

function render() {
  resultEntry.hidden = testMode !== "tested";
  comboEntry.hidden = testMode !== "combination";
  updateSegmentedButtons(testStatus, testMode, "status");
  updateSegmentedButtons(resultScope, resultCount, "count");
  if (testMode === "tested") renderRankInputs();
  if (testMode === "combination") renderComboInputs();
  renderRecordPanel();
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

resultImportButton.addEventListener("click", () => {
  resultFileInput.click();
});

resultFileInput.addEventListener("change", () => {
  importResultFile(resultFileInput.files[0]);
});

recordPanel.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  if (button.dataset.action === "save-record") {
    const nameInput = button.closest(".record-name-row")?.querySelector("input");
    saveTopTenRecord(nameInput?.value || "");
  }

  if (button.dataset.action === "load-record") {
    loadTopTenRecord(button.dataset.recordId);
  }

  if (button.dataset.action === "delete-record") {
    deleteTopTenRecord(button.dataset.recordId);
  }

  if (button.dataset.action === "membership-info") {
    importStatus.textContent = "会员支付待接入";
  }
});

comboTalentA.addEventListener("input", () => {
  comboTalents[0] = comboTalentA.value;
  const talent = findTalent(comboTalentA.value);
  if (talent) {
    comboTalents[0] = talent.name;
    comboTalentA.value = talent.name;
    activeTalent = talent;
    activeDomain = talent.domain;
    input.value = talent.name;
  }
  saveCurrentUser();
  renderTabs();
  renderTalentList();
  renderViewer();
});

comboTalentB.addEventListener("input", () => {
  comboTalents[1] = comboTalentB.value;
  const talent = findTalent(comboTalentB.value);
  if (talent) {
    comboTalents[1] = talent.name;
    comboTalentB.value = talent.name;
    activeTalent = talent;
    activeDomain = talent.domain;
    input.value = talent.name;
  }
  saveCurrentUser();
  renderTabs();
  renderTalentList();
  renderViewer();
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
