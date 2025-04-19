const DEFAULT_LANGUAGE = "en";
const SUPPORTED_LANGUAGES = {
  en: ["en", "en-us", "en-gb"],
  fr: ["fr", "fr-fr", "fr-ca"],
  de: ["de", "de-de", "de-at"],
  "zh-CN": ["zh", "zh-cn", "zh-hans"],
  it: ["it", "it-it"],
};
const preferredLanguage = getSystemLanguage() || DEFAULT_LANGUAGE;

const trigger = document.querySelector(".language-select-trigger");
const options = document.querySelector(".language-select-options");
const allOptions = document.querySelectorAll(".language-select-option");
const overlayMenu = document.querySelector(".overlay-menu");
const hamburgerIcon = document.querySelector(".top-bar .hamburger a");

function getGoogleTranslateTargetLang() {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("googtrans="));

  if (!cookie) return null;

  const value = cookie.split("=")[1]; // /en/fr
  const parts = value.split("/"); // ["", "en", "fr"]

  if (parts.length !== 3) return null;

  const sourceLang = parts[1];
  const targetLang = parts[2];

  if (targetLang && targetLang !== DEFAULT_LANGUAGE) {
    return targetLang;
  }

  return null;
}

function setSelectedOption(option) {
  const img = option.querySelector("img")?.src;
  const text = option.querySelector("span")?.textContent;
  const newLanguageValue = option.dataset?.value;

  trigger.innerHTML = `<img src="${img}" alt="${text}" data-value=${newLanguageValue} /><span>${text}</span>`;
}

function translatePageWithGoogle(option) {
  const googleSelect = document.querySelector(".goog-te-combo");
  const img = option.querySelector("img")?.src;
  const text = option.querySelector("span")?.textContent;
  const newLanguageValue = option.dataset?.value;

  if (!googleSelect || !img || !text || !newLanguageValue) {
    console.log("error, closing select: ", {
      googleSelect,
      img,
      text,
      newLanguageValue,
    });
    if (options?.style?.display) {
      options.style.display = "none";
    }
    return;
  }

  trigger.innerHTML = `<img src="${img}" alt="${text}" data-value=${newLanguageValue} /><span>${text}</span>`;
  options.style.display = "none";

  googleSelect.value = newLanguageValue;
  googleSelect.dispatchEvent(new Event("change"));
  googleSelect.dispatchEvent(new Event("change"));
}

// Initialize Google Translate
function googleTranslateElementInit() {
  const trigger = document.querySelector(".language-select-trigger");
  if (trigger) {
    trigger.style.display = "flex";
  }

  new google.translate.TranslateElement(
    {
      pageLanguage: "en",
      includedLanguages: "en,fr,de,zh-CN,it",
      autoDisplay: false,
    },
    "google_translate_element"
  );

  const translateLang = getGoogleTranslateTargetLang();

  if (translateLang) {
    const option = document.querySelector(
      `.language-select-options div[data-value="${translateLang}"]`
    );

     setSelectedOption(option);
  }
}

function getSystemLanguage() {
  const browserLangs = navigator.languages || [
    navigator.language || navigator.userLanguage,
  ];
  console.log("browserLangs:", browserLangs);
  const normalizedLangs = browserLangs.map((lang) => lang.toLowerCase());

  for (const [key, aliases] of Object.entries(SUPPORTED_LANGUAGES)) {
    if (normalizedLangs.some((l) => aliases.includes(l))) {
      console.log("system language identified:", key);
      return key;
    }
  }
}

hamburgerIcon.addEventListener("click", function (e) {
  e.preventDefault();
  overlayMenu.classList.toggle("open");
  const iconEl = hamburgerIcon.querySelector("i");
  if (overlayMenu.classList.contains("open")) {
    iconEl.classList.replace("fa-bars", "fa-times");
  } else {
    iconEl.classList.replace("fa-times", "fa-bars");
  }
});

trigger.addEventListener("click", () => {
  options.style.display = options.style.display === "block" ? "none" : "block";
});

allOptions.forEach((option) => {
  option.addEventListener("click", () => translatePageWithGoogle(option));
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".language-select-wrapper")) {
    options.style.display = "none";
  }
});

window.addEventListener("load", () => {
  if (document.getElementById("google-translate-script")) {
    document.getElementById("google-translate-script").remove();
  }

  const script = document.createElement("script");
  script.id = "google-translate-script";
  script.type = "text/javascript";
  script.src =
    "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.body.appendChild(script);
});
