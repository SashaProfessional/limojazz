const LANGUAGE_STORAGE_KEY = "LANGUAGE_STORAGE_KEY";
const DEFAULT_LANGUAGE = "en";
const SUPPORTED_LANGUAGES = {
  [DEFAULT_LANGUAGE]: [
    "en",
    "en-us",
    "en-gb",
    "en-au",
    "en-ca",
    "en-in",
    "en-ie",
    "en-nz",
    "en-za",
    "en-gb-oxendict",
    "en-gb",
  ],
  fr: ["fr", "fr-fr", "fr-ca", "fr-ch"],
  de: ["de", "de-de", "de-at", "de-li", "de-ch"],
  "zh-CN": ["zh", "zh-hk", "zh-cn", "zh-tw", "zh-hans"],
  it: ["it", "it-it", "it-ch"],
  ar: [
    "ar",
    "ar-sa",
    "ar-ae",
    "ar-kw",
    "ar-qa",
    "ar-bh",
    "ar-om",
    "ar-ye",
    "ar-jo",
    "ar-lb",
    "ar-sy",
    "ar-ma",
    "ar-tn",
    "ar-dz",
    "ar-ly",
    "ar-iq",
    "ar-eg",
  ],
};

function getPreviouslySelectedLanguage() {
  return localStorage.getItem(LANGUAGE_STORAGE_KEY) || null;
}

function setSelectedOption(option) {
  const img = option.querySelector("img")?.src;
  const text = option.querySelector("span")?.textContent;
  const trigger = document.querySelector(".language-select-trigger");
  const newLanguageValue = option.dataset?.value;

  trigger.dataset.value = newLanguageValue;
  trigger.innerHTML = `<img src="${img}" alt="${text}" /><span>${text}</span>`;
}

function translatePageWithGoogle(option) {
  const googleSelect = document.querySelector(".goog-te-combo");
  const trigger = document.querySelector(".language-select-trigger");
  const selectedValue = trigger.dataset?.value;
  const options = document.querySelector(".language-select-options");

  const newLanguageImg = option.querySelector("img")?.src;
  const newLanguageLabel = option.querySelector("span")?.textContent;
  const newLanguageValue = option.dataset?.value;

  if (
    !googleSelect ||
    !newLanguageImg ||
    !newLanguageLabel ||
    !newLanguageValue ||
    newLanguageValue === selectedValue
  ) {
    if (options?.style?.display) {
      options.style.display = "none";
    }

    return;
  }

  trigger.dataset.value = newLanguageValue;
  trigger.innerHTML = `<img src="${newLanguageImg}" alt="${newLanguageLabel}" /><span>${newLanguageLabel}</span>`;
  options.style.display = "none";

  googleSelect.value = newLanguageValue;
  googleSelect.dispatchEvent(new Event("change"));
  googleSelect.dispatchEvent(new Event("change"));

  localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguageValue);
}

function getSupportedSystemLanguage() {
  const browserLangs = navigator.languages || [
    navigator.language || navigator.userLanguage,
  ];
  const normalizedLangs = browserLangs.map((lang) => lang.toLowerCase());

  for (const lang of normalizedLangs) {
    for (const [key, aliases] of Object.entries(SUPPORTED_LANGUAGES)) {
      if (aliases.includes(lang)) {
        return key;
      }
    }
  }

  return null;
}

// Initialize Google Translate
function googleTranslateElementInit() {
  const trigger = document.querySelector(".language-select-trigger");
  if (trigger) {
    trigger.style.display = "flex";
  }

  new google.translate.TranslateElement(
    {
      pageLanguage: DEFAULT_LANGUAGE,
      includedLanguages: "en,fr,de,zh-CN,it,ru,pt,es,ar",
      autoDisplay: false,
    },
    "google_translate_element"
  );

  const previouslySelectedLanguage = getPreviouslySelectedLanguage();
  const supportedSystemLanguage = getSupportedSystemLanguage();

  if (previouslySelectedLanguage) {
    const option = document.querySelector(
      `.language-select-options div[data-value="${previouslySelectedLanguage}"]`
    );
    setSelectedOption(option);
  } else if (
    supportedSystemLanguage &&
    supportedSystemLanguage !== DEFAULT_LANGUAGE
  ) {
    const option = document.querySelector(
      `.language-select-options div[data-value="${supportedSystemLanguage}"]`
    );

    translatePageWithGoogle(option);
  }
}

const options = document.querySelector(".language-select-options");
const allLanguageOptions = document.querySelectorAll(".language-select-option");
const languageTrigger = document.querySelector(".language-select-trigger");

if (languageTrigger) {
  languageTrigger.addEventListener("click", () => {
    options.style.display =
      options.style.display === "block" ? "none" : "block";
  });
}

if (allLanguageOptions?.length) {
  allLanguageOptions.forEach((option) => {
    option.addEventListener("click", () => translatePageWithGoogle(option));
  });
}

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
