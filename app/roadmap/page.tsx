"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import TranslateOrb from "../../components/TranslateOrb";

type Stage = "planning" | "just_arrived" | "settling" | "established";

interface RoadmapItem {
  id: string;
  title: string;
  category: "documents" | "money" | "health" | "housing" | "transport" | "admin";
  phase: "first_week" | "first_month" | "first_3_months" | "first_year";
  stages: Stage[];
  origins: string[];
  time: string;
  office: string;
  address?: string;
  phone?: string;
  hours?: string;
  bring: string[];
  details: string;
  tip?: string;
  link?: string;
}

const STAGE_OPTIONS = [
  { value: "planning",     label: "Still planning",     desc: "Haven't made Aliyah yet" },
  { value: "just_arrived", label: "Just arrived",        desc: "Less than 3 months in Israel" },
  { value: "settling",     label: "Settling in",         desc: "3–12 months in Israel" },
  { value: "established",  label: "Been here a while",   desc: "Over a year in Israel" },
];

const ORIGIN_OPTIONS = [
  { value: "us_ca",        label: "USA or Canada" },
  { value: "uk",           label: "United Kingdom" },
  { value: "france",       label: "France" },
  { value: "russia_cis",   label: "Russia or CIS" },
  { value: "south_america",label: "South America" },
  { value: "south_africa", label: "South Africa" },
  { value: "other",        label: "Somewhere else" },
];

const categoryMeta: Record<string, { label: string; color: string; bg: string }> = {
  documents: { label: "Documents",  color: "text-purple-700", bg: "bg-purple-50" },
  money:      { label: "Money",     color: "text-green-700",  bg: "bg-green-50"  },
  health:     { label: "Health",    color: "text-red-600",    bg: "bg-red-50"    },
  housing:    { label: "Housing",   color: "text-amber-700",  bg: "bg-amber-50"  },
  transport:  { label: "Transport", color: "text-blue-700",   bg: "bg-blue-50"   },
  admin:      { label: "Admin",     color: "text-gray-600",   bg: "bg-gray-100"  },
};

const PHASE_META_DEFAULT: Record<string, { label: string; sub: string }> = {
  first_week:     { label: "First week",     sub: "The most urgent steps right after landing" },
  first_month:    { label: "First month",    sub: "Get your essentials sorted within 30 days" },
  first_3_months: { label: "First 3 months", sub: "Build your life in Israel properly" },
  first_year:     { label: "First year",     sub: "Long-term steps to feel fully settled" },
};

const PHASE_META_PLANNING: Record<string, { label: string; sub: string }> = {
  first_week:  { label: "Start here", sub: "Register with key organisations before you do anything else" },
  first_month: { label: "Prepare",    sub: "Plan your finances, learn Hebrew, and build your community" },
  first_3_months: { label: "First 3 months", sub: "Build your life in Israel properly" },
  first_year:     { label: "First year",     sub: "Long-term steps to feel fully settled" },
};

function getPhaseMeta(phase: string, stage: Stage): { label: string; sub: string } {
  const meta = stage === "planning" ? PHASE_META_PLANNING : PHASE_META_DEFAULT;
  return meta[phase] ?? PHASE_META_DEFAULT[phase] ?? { label: "Steps", sub: "" };
}

const ALL_ITEMS: RoadmapItem[] = [
  {
    id: "teudat_zehut",
    title: "Get your Teudat Zehut (Israeli ID)",
    category: "documents",
    phase: "first_week",
    origins: ["all"],
    stages: ["just_arrived", "settling"],
    time: "1–2 hours",
    office: "Misrad Hapnim (Ministry of Interior)",
    address: "Visit your nearest branch — find it at gov.il",
    phone: "*3450",
    hours: "Sun–Thu 8:00–13:00 (varies by branch)",
    bring: ["Teudat Oleh (immigration certificate)", "Passport", "2 passport photos", "Completed form (available at office)"],
    details: "The Teudat Zehut (ת.ז.) is your Israeli national ID card — a small laminated card with your photo, ID number, and address. You cannot open a bank account, register for health insurance, sign a lease, get a SIM card, or do almost anything official without it. The ID number on it (Mispar Zehut) becomes your permanent Israeli identifier for life — you'll use it on every form, every website, every government interaction forever. Processing takes about 2 weeks after your appointment. In the meantime you'll receive a temporary document (Teudat Zehut Zmanit) which is accepted in most places. Your Teudat Zehut also serves as your address record — update it when you move.",
    tip: "Book online at gov.il/he/departments/ministry_of_interior — walk-ins at busy branches can wait 3–5 hours. The Mispar Zehut (ID number) on your card is more important than the card itself — memorise it.",
    link: "https://www.gov.il/en/departments/ministry_of_interior",
  },
  {
    id: "teudat_oleh",
    title: "Register your Teudat Oleh with the Jewish Agency",
    category: "documents",
    phase: "first_week",
    origins: ["all"],
    stages: ["planning", "just_arrived"],
    time: "2–3 hours",
    office: "Jewish Agency / Nefesh B'Nefesh",
    bring: ["Valid passport", "Birth certificate (apostilled)", "Jewish documentation if applicable", "Photos"],
    details: "Your Teudat Oleh is your official immigration certificate issued when you make Aliyah. If you came through Nefesh B'Nefesh, much of this is handled before landing. If not, you'll need to register at the Jewish Agency. This document unlocks Sal Klita, tax benefits, and reduced fees on many services.",
    tip: "Keep multiple copies of your Teudat Oleh — you'll need it constantly in your first year.",
  },
  {
    id: "sal_klita",
    title: "Claim your Sal Klita (Absorption Basket)",
    category: "money",
    phase: "first_week",
    origins: ["all"],
    stages: ["just_arrived"],
    time: "1 hour",
    office: "Misrad HaKlita (Ministry of Aliyah & Integration)",
    phone: "*3450",
    hours: "Sun–Thu 8:30–12:30",
    bring: ["Teudat Oleh", "Teudat Zehut", "Israeli bank account details", "Passport"],
    details: "Sal Klita (literally 'absorption basket') is a series of monthly cash payments from the Israeli government to help new Olim cover living costs during their first year. The amounts (approximate, 2024): single person ₪16,500 total over 12 months; married couple ₪26,000; each child adds roughly ₪3,000. Payments are front-loaded — you receive more in months 1–3 and less later. You must apply at Misrad HaKlita within 3 months of Aliyah to receive the full amount — missing this window means forfeiting payments. You also receive a one-time grant (Matak) upon arrival and discounts on flights, arnona, and other services. The full Sal Klita package is significantly more valuable than most new Olim realise.",
    tip: "Ask Misrad HaKlita for a full breakdown of ALL Oleh benefits at your first appointment — many people only claim the cash payments and miss housing grants, car import benefits, and education discounts.",
    link: "https://www.gov.il/en/departments/ministry_of_aliyah_and_integration",
  },
  {
    id: "kupat_holim",
    title: "Register with a Kupat Holim (health fund)",
    category: "health",
    phase: "first_week",
    origins: ["all"],
    stages: ["just_arrived", "settling"],
    time: "30–60 minutes",
    office: "Any Kupat Holim branch (Clalit, Maccabi, Meuhedet, Leumit)",
    bring: ["Teudat Zehut", "Teudat Oleh", "Bituach Leumi registration proof"],
    details: "Israel has four public health funds (Kupot Holim) — you must register with exactly one. Clalit is the largest with the most clinics but tends to have the longest waiting times. Maccabi is the second largest, has an excellent English-language app, English-speaking doctors in most cities, and is consistently the top choice for Anglo immigrants. Meuhedet is smaller but well-regarded in Jerusalem and the north. Leumit is the smallest. All four cover the same government-mandated basket of healthcare services (Sal Briut) — the differences are in supplemental insurance plans, specialist access, clinic locations, and service quality. The monthly premium is income-based and collected via Bituach Leumi — you don't pay the Kupah directly. You can switch Kupah once a year in January.",
    tip: "Maccabi's app (Maccabi Online) is fully in English, lets you book appointments, view test results, and message your doctor. For Anglo immigrants this alone makes Maccabi the default choice.",
  },
  {
    id: "bituach_leumi",
    title: "Register with Bituach Leumi (National Insurance)",
    category: "money",
    phase: "first_week",
    origins: ["all"],
    stages: ["just_arrived", "settling"],
    time: "1–2 hours",
    office: "Bituach Leumi (National Insurance Institute)",
    address: "Visit your nearest branch — find it at btl.gov.il",
    phone: "*6050",
    hours: "Sun–Thu 8:00–13:00",
    bring: ["Teudat Zehut", "Teudat Oleh", "Passport", "Bank account details"],
    details: "Bituach Leumi is Israel's national social security system — think of it as a combination of the NHS, social security, and unemployment insurance all in one. You must register within 30 days of arriving. As a new Oleh you pay a reduced rate of roughly 0.4% of your income for the first 12 months instead of the standard rate. Registration unlocks child allowances (Kitzva Yeladim), unemployment benefits, maternity pay (Dmei Leda), and disability support. Walk-ins are accepted but expect a wait — bring every document you have. If you miss the 30-day window, you'll owe backdated payments from your arrival date.",
    tip: "If employed, your employer registers you automatically and deducts contributions from your salary. If self-employed or unemployed, you must register yourself — this is the most commonly missed step for new Olim.",
    link: "https://www.btl.gov.il",
  },
  {
    id: "bank_account",
    title: "Open an Israeli bank account",
    category: "money",
    phase: "first_week",
    origins: ["all"],
    stages: ["just_arrived", "settling"],
    time: "1–3 hours",
    office: "Any Israeli bank (Discount, Hapoalim, Leumi, Mizrahi, One Zero)",
    bring: ["Teudat Zehut", "Teudat Oleh", "Passport", "Proof of address (even temporary)", "Initial deposit (varies)"],
    details: "Getting an Israeli bank account is notoriously frustrating for new immigrants — expect multiple visits and extensive paperwork. The four main options: Bank Discount (Discount) has a dedicated Olim desk and is the most immigrant-friendly, often waiving fees for the first year. Bank Hapoalim is the largest bank with the most branches. Bank Leumi is solid but less immigrant-focused. One Zero is a fully digital bank with an excellent English app and no branches to visit — popular with tech workers and Anglo immigrants. Mizrahi-Tefahot is strong if you're buying property. Bring every document you have — they will ask for things you didn't expect. Some branches require appointments; call ahead.",
    tip: "Bank Discount's Olim desk (Shulchan Olim) is specifically trained for new immigrants and often speaks English. Ask for it by name when you walk in.",
  },
  {
    id: "rent_contract",
    title: "Sign and understand your rental contract",
    category: "housing",
    phase: "first_month",
    origins: ["all"],
    stages: ["just_arrived", "settling"],
    time: "Varies",
    office: "With your landlord — optionally with a lawyer",
    bring: ["Teudat Zehut", "Bank details for standing order", "Guarantor details if required", "1–3 months deposit (typical)"],
    details: "Israeli rental contracts (Heskam Skhirut) are usually 1-year agreements with an automatic renewal option. Landlords typically ask for post-dated checks or a standing order. Many require a guarantor (Arev). Read every clause carefully. Upload your contract to Kol Tov if you want us to explain any clause in plain language.",
    tip: "Never sign a contract you don't fully understand. Upload it here and we'll explain every clause.",
  },
  {
    id: "ulpan",
    title: "Enrol in Ulpan (Hebrew language school)",
    category: "admin",
    phase: "first_month",
    origins: ["all"],
    stages: ["just_arrived", "settling", "planning"],
    time: "Enrolment: 1 hour. Course: 5 months",
    office: "Misrad HaKlita or private Ulpan providers",
    bring: ["Teudat Oleh", "Teudat Zehut"],
    details: "As a new Oleh you're entitled to 500 hours of subsidised Hebrew lessons (Ulpan Aleph through Gimel). This is one of the most valuable benefits available. Even basic Hebrew transforms your daily life. Ulpan Etzion in Jerusalem and Gordon Ulpan in Tel Aviv are highly regarded.",
    tip: "Your 500 subsidised hours must be used within 3.5 years of Aliyah. Don't waste them.",
  },
  {
    id: "drivers_license",
    title: "Convert your foreign driver's licence",
    category: "transport",
    phase: "first_3_months",
    origins: ["all"],
    stages: ["just_arrived", "settling", "established"],
    time: "2–4 hours across multiple visits",
    office: "Misrad Harishui (Licensing Authority)",
    phone: "*5678",
    bring: ["Foreign licence (original)", "Teudat Zehut", "Teudat Oleh", "Medical form (Tofes 17) from a doctor", "Passport photos", "Payment"],
    details: "Israel has reciprocal licence conversion agreements with the USA, UK, Canada, France, Germany, Australia, Netherlands, Sweden, Japan, and several other countries. If your country is on the list, you skip the driving test entirely and just need: a medical form (Tofes 17) completed by any licensed doctor (costs around ₪150–200), an eye test at the licensing office, and your original foreign licence. The process requires 2–3 visits to Misrad Harishui. Your foreign licence is physically surrendered and replaced with an Israeli one. If your country is NOT on the reciprocal list (South America, most of Africa, Russia/CIS), you must take a full Israeli driving test which requires lessons with a licensed Israeli instructor and can cost ₪3,000–8,000. You have 3 years from your Aliyah date to convert under Oleh benefits — after that, standard fees apply.",
    tip: "South Africans: South Africa is NOT on the reciprocal list — you will need to take the full Israeli driving test. Budget for 15–30 lessons with a licensed instructor.",
    link: "https://www.gov.il/en/departments/ministry_of_transport_and_road_safety",
  },
  {
    id: "tax_residency",
    title: "Establish your tax residency status",
    category: "money",
    phase: "first_3_months",
    origins: ["all"],
    stages: ["just_arrived", "settling"],
    time: "1–2 hours",
    office: "Israel Tax Authority (Mas Hachnasa)",
    phone: "*4954",
    bring: ["Teudat Zehut", "Teudat Oleh", "Employment contract or self-employment details", "Foreign income documentation"],
    details: "New Olim receive a 10-year tax exemption on all foreign-sourced income and assets — this is one of the most financially significant benefits of making Aliyah and is essentially unique in the world. It means rental income from a foreign property, dividends from foreign investments, foreign pension income, and foreign business income are all exempt from Israeli income tax for 10 years. You also have reduced reporting obligations on foreign assets during this period. However, this exemption is not automatic — you must establish your Israeli tax residency with the Tax Authority and properly document your foreign assets before the exemption period begins. Doing this incorrectly or late can forfeit significant tax savings. Hire an Israeli accountant (Ro'eh Heshbon) who specialises in new immigrants.",
    tip: "The 10-year exemption clock starts from your first year of Aliyah regardless of when you register — do not delay establishing your tax residency status.",
  },
  {
    id: "arnona",
    title: "Apply for Arnona (municipal tax) discount",
    category: "money",
    phase: "first_3_months",
    origins: ["all"],
    stages: ["just_arrived", "settling"],
    time: "1 hour",
    office: "Your local municipality (Iriya)",
    bring: ["Teudat Zehut", "Teudat Oleh", "Rental contract or property ownership proof", "Proof of address"],
    details: "New Olim are entitled to a discount on Arnona (Israeli municipal tax) for the first year. The exact discount varies by municipality — some cities offer 90% off, others less. Apply at your local Iriya office as soon as you have a permanent address.",
    tip: "Some municipalities offer the discount online. Check your city's website before making the trip.",
  },
  {
    id: "social_security_foreign",
    title: "Handle your home country social security / pension",
    category: "money",
    phase: "first_year",
    origins: ["all"],
    stages: ["just_arrived", "settling", "established"],
    time: "Varies",
    office: "Your home country's consulate or online portal",
    bring: ["Passport", "Social security / NI number", "Proof of Israeli residency"],
    details: "If you paid into a pension or social security system in your home country, you may be entitled to continue contributing or to receive benefits. The USA, UK, and several other countries have social security treaties with Israel.",
    tip: "UK citizens can pay voluntary NI contributions from Israel to protect their State Pension entitlement.",
  },
  // ─── Planning stage items ──────────────────────────────────────────────────
  {
    id: "nbn_registration",
    title: "Register with Nefesh B'Nefesh",
    category: "admin",
    phase: "first_week",
    origins: ["us_ca", "uk"],
    stages: ["planning"],
    time: "1–2 hours (online)",
    office: "Nefesh B'Nefesh (online)",
    bring: ["Valid passport", "Jewish documentation", "Personal statement of intent"],
    details: "Nefesh B'Nefesh is the leading Aliyah facilitation organization for North American and UK immigrants. Registering with them early significantly streamlines the entire Aliyah process — they coordinate with the Jewish Agency, Israeli consulates, and government ministries on your behalf. Their support staff speak English and guide you through every step before and after landing.",
    tip: "Nefesh B'Nefesh flights to Israel are heavily subsidised — check their flight program as soon as you register.",
    link: "https://www.nbn.org.il",
  },
  {
    id: "telfed_registration",
    title: "Register with Telfed",
    category: "admin",
    phase: "first_week",
    origins: ["south_africa"],
    stages: ["planning"],
    time: "1 hour (online)",
    office: "Telfed — South African Zionist Federation in Israel",
    bring: ["South African passport", "Proof of Jewish identity if applicable"],
    details: "Telfed is the dedicated support organization for South African immigrants to Israel. They provide practical assistance with Aliyah paperwork, host orientation events, run social and community programs, and connect you with the large and active South African community in Israel. If you're coming from South Africa, Telfed is your first call — they understand your specific documents, processes, and community needs.",
    tip: "Telfed runs popular social events and WhatsApp communities that help South African Olim connect quickly after arriving.",
    link: "https://www.telfed.org.il",
  },
  {
    id: "jfna_resources",
    title: "Connect with Jewish Federations (JFNA)",
    category: "admin",
    phase: "first_week",
    origins: ["us_ca"],
    stages: ["planning"],
    time: "30 minutes (online)",
    office: "Jewish Federations of North America (online)",
    bring: [],
    details: "The Jewish Federations of North America (JFNA) funds and coordinates a wide range of Aliyah support services across North America. Your local Federation can connect you with pre-Aliyah counsellors, financial assistance programs, community Aliyah missions, and peer support networks of people who have already made the move. They work closely with Nefesh B'Nefesh and the Jewish Agency.",
    tip: "Many local Federations offer one-on-one Aliyah counselling sessions — book a call before you commit to anything.",
    link: "https://www.jewishfederations.org",
  },
  {
    id: "jewish_agency_registration",
    title: "Start your Aliyah application with the Jewish Agency",
    category: "documents",
    phase: "first_week",
    origins: ["all"],
    stages: ["planning"],
    time: "2–4 hours (online + in person)",
    office: "Jewish Agency for Israel (your local shlichut office)",
    bring: ["Valid passport", "Birth certificate", "Jewish documentation (marriage certificate, bar/bat mitzvah certificate, synagogue letter, etc.)", "Passport photos"],
    details: "The Jewish Agency for Israel (Sochnut) is the official body that processes Aliyah applications. You'll meet with a shaliach (emissary) at your local office, submit your documentation proving Jewish identity, and begin the formal application. The process typically takes 3–12 months depending on your documentation. Starting early gives you time to gather any missing paperwork.",
    tip: "Gather every piece of Jewish documentation you can find before your first meeting — the more you bring, the smoother the process.",
    link: "https://www.jewishagency.org",
  },
  {
    id: "pre_aliyah_finances",
    title: "Plan your finances for the move",
    category: "money",
    phase: "first_month",
    origins: ["all"],
    stages: ["planning"],
    time: "Several weeks of planning",
    office: "Your bank and a financial adviser familiar with Aliyah",
    bring: ["Bank statements", "Pension details", "Investment account information", "Property ownership documents if applicable"],
    details: "Financial planning before Aliyah is critical and often overlooked. You need to understand: how to transfer money to Israel cost-effectively, what to do with foreign pensions and investments, the Israeli tax implications of your assets, and how to build a 3–6 month emergency fund in Israel. The 10-year foreign income tax exemption for new Olim is one of the most significant financial benefits available anywhere — planning around it properly can save you a significant amount.",
    tip: "Use a specialist Aliyah financial adviser, not just a general accountant. The tax treaty and exemption rules are highly specific.",
  },
  {
    id: "pre_aliyah_hebrew",
    title: "Start learning Hebrew before you arrive",
    category: "admin",
    phase: "first_month",
    origins: ["all"],
    stages: ["planning"],
    time: "Ongoing — even 30 min/day makes a difference",
    office: "Online (Duolingo, Pimsleur, Memrise, or private tutor)",
    bring: [],
    details: "You don't need to be fluent before arriving — but even basic Hebrew makes the first months dramatically less overwhelming. Knowing numbers, days of the week, common signs, and basic phrases for offices and shops gives you confidence and reduces anxiety. The Hebrew Ulpan you'll attend after Aliyah moves faster if you arrive with some foundation.",
    tip: "Focus on reading the alphabet first — once you can sound out Hebrew letters, everything else gets much easier.",
  },
  {
    id: "pre_aliyah_community",
    title: "Connect with your future community before arriving",
    category: "admin",
    phase: "first_month",
    origins: ["all"],
    stages: ["planning"],
    time: "Ongoing",
    office: "Online — Facebook groups, WhatsApp communities, local Anglo communities",
    bring: [],
    details: "The Anglo immigrant community in Israel is exceptionally active and welcoming. Before you arrive, join Facebook groups like 'Anglo Aliyah' and city-specific groups ('English Speakers in Tel Aviv', 'Ra'anana Anglo Community' etc.), find WhatsApp groups through Nefesh B'Nefesh, and if possible visit Israel on a pilot trip to explore neighbourhoods. Knowing people before you land makes the transition far smoother.",
    tip: "Ra'anana, Modi'in, Tel Aviv, Jerusalem, and Beit Shemesh have large, active Anglo communities with strong support networks.",
  },
  // ─── USA / Canada specific ────────────────────────────────────────────────
  {
    id: "us_social_security",
    title: "Understand your US Social Security entitlement",
    category: "money",
    phase: "first_3_months",
    origins: ["us_ca"],
    stages: ["just_arrived", "settling", "established", "planning"],
    time: "1–2 hours research + optional adviser call",
    office: "US Social Security Administration (online) or US Embassy Tel Aviv",
    bring: ["US passport", "Social Security card or number", "Proof of Israeli residency"],
    details: "The USA and Israel have a totalization agreement meaning you won't be double-taxed on Social Security. If you've worked in the US, your contributions count toward your Israeli pension entitlement and vice versa. US citizens living in Israel can still receive Social Security benefits — notify the SSA of your address change and set up direct deposit to an Israeli bank account.",
    tip: "US citizens are still required to file US tax returns every year even while living in Israel. Use a CPA familiar with expat tax law.",
    link: "https://www.ssa.gov/international/Agreement_Pamphlets/israel.html",
  },
  {
    id: "us_fbar",
    title: "File your FBAR and understand FATCA obligations",
    category: "money",
    phase: "first_3_months",
    origins: ["us_ca"],
    stages: ["just_arrived", "settling", "planning"],
    time: "Ongoing annual obligation",
    office: "FinCEN (online) — due April 15 annually",
    bring: ["All Israeli bank account details", "Account balances", "US tax returns"],
    details: "US citizens with foreign bank accounts over $10,000 must file an FBAR (Foreign Bank Account Report) annually. Additionally, FATCA requires Israeli banks to report US account holders to the IRS. This catches many new Olim by surprise. Non-compliance carries severe penalties. Set up a relationship with a US-Israeli tax accountant as soon as you open your Israeli bank account.",
    tip: "Many Israeli banks now ask if you are a US citizen when opening an account specifically because of FATCA reporting requirements.",
  },
  {
    id: "canada_pension",
    title: "Understand your Canadian pension and OAS entitlement",
    category: "money",
    phase: "first_3_months",
    origins: ["us_ca"],
    stages: ["just_arrived", "settling", "established", "planning"],
    time: "1–2 hours research",
    office: "Service Canada (online)",
    bring: ["Canadian passport", "SIN number", "Proof of Israeli residency"],
    details: "Canada and Israel have a social security agreement. Canadian Olim who have contributed to CPP can receive their CPP pension from Israel. OAS (Old Age Security) can also be received abroad after sufficient years of Canadian residency. Notify Service Canada of your move and set up direct deposit. Canadian citizens do not have the same ongoing tax filing obligations as Americans — you typically stop filing Canadian returns once you establish Israeli tax residency.",
    tip: "Unlike Americans, Canadians generally do not need to file Canadian tax returns after establishing residency elsewhere. Confirm this with a Canadian-Israeli tax adviser.",
    link: "https://www.canada.ca/en/services/benefits/publicpensions.html",
  },
  // ─── UK specific ─────────────────────────────────────────────────────────
  {
    id: "uk_ni_contributions",
    title: "Protect your UK State Pension with voluntary NI contributions",
    category: "money",
    phase: "first_3_months",
    origins: ["uk"],
    stages: ["just_arrived", "settling", "established", "planning"],
    time: "1–2 hours (online)",
    office: "HMRC (online) — gov.uk/voluntary-national-insurance-contributions",
    bring: ["UK National Insurance number", "UK passport or proof of citizenship"],
    details: "UK citizens who move to Israel can continue paying voluntary Class 2 or Class 3 NI contributions to protect their UK State Pension entitlement. You typically need 35 qualifying years for a full State Pension. If you leave the UK before hitting that threshold, paying voluntary contributions from Israel is often excellent value. The deadline to pay back years has been extended several times — check the current deadline on gov.uk.",
    tip: "Class 2 contributions (if you're self-employed) are significantly cheaper than Class 3. Check which you qualify for before paying.",
    link: "https://www.gov.uk/voluntary-national-insurance-contributions",
  },
  {
    id: "uk_hmrc_non_resident",
    title: "Notify HMRC of your non-resident status",
    category: "admin",
    phase: "first_month",
    origins: ["uk"],
    stages: ["just_arrived", "planning"],
    time: "1–2 hours (online)",
    office: "HMRC (online) — complete form P85",
    bring: ["National Insurance number", "Last UK employer details", "Israeli address"],
    details: "When you leave the UK permanently, you should notify HMRC using form P85 (leaving the UK). This establishes your non-resident status for UK tax purposes, which affects how your UK income (rental, pension, investments) is taxed. The UK-Israel double tax treaty prevents you being taxed twice on the same income. Getting this right early avoids complications later.",
    tip: "If you have a UK property you're renting out, you'll need to register with HMRC's Non-Resident Landlord scheme.",
    link: "https://www.gov.uk/government/publications/income-tax-leaving-the-uk-getting-your-tax-right-p85",
  },
  {
    id: "uk_nbn",
    title: "Register with Nefesh B'Nefesh UK",
    category: "admin",
    phase: "first_week",
    origins: ["uk"],
    stages: ["planning"],
    time: "1 hour (online)",
    office: "Nefesh B'Nefesh UK (online)",
    bring: ["UK passport", "Jewish documentation"],
    details: "Nefesh B'Nefesh has a dedicated UK program that helps British Jews make Aliyah. They run group Aliyah flights from the UK, provide pre-Aliyah counselling, and coordinate with the Jewish Agency and Israeli government on your behalf. The UK program is slightly different from the North American one so make sure you register through the UK portal specifically.",
    tip: "NBN UK runs regular webinars and info sessions — attend one early in your planning process.",
    link: "https://www.nbn.org.il/uk",
  },
  // ─── France specific ──────────────────────────────────────────────────────
  {
    id: "france_fsju",
    title: "Connect with FSJU before making Aliyah",
    category: "admin",
    phase: "first_week",
    origins: ["france"],
    stages: ["planning"],
    time: "1 hour (online or in person)",
    office: "FSJU — Fonds Social Juif Unifié (Paris and regional offices)",
    bring: ["French passport", "Proof of Jewish identity if required"],
    details: "The FSJU (Fonds Social Juif Unifié) is the main French Jewish social and welfare organization and provides extensive Aliyah preparation support for French Jews. They work alongside the Jewish Agency and can help with documentation, preparation, and connecting you with the large and established French-speaking community already in Israel. The French Aliyah community in Israel is one of the largest and most active.",
    tip: "Israel has a large French-speaking community, especially in cities like Netanya, Ashdod, and Tel Aviv. FSJU can connect you with them before you arrive.",
    link: "https://www.fsju.org",
  },
  {
    id: "france_pension",
    title: "Understand your French pension entitlement from Israel",
    category: "money",
    phase: "first_3_months",
    origins: ["france"],
    stages: ["just_arrived", "settling", "planning"],
    time: "2–3 hours research + adviser call",
    office: "Caisse Nationale d'Assurance Vieillesse (CNAV) — online",
    bring: ["French passport", "Social security number (numéro de sécurité sociale)", "Proof of Israeli residency"],
    details: "France and Israel have a bilateral social security agreement. If you've contributed to the French pension system (retraite), you can receive your French pension while living in Israel. Contact CNAV to notify them of your change of address and arrange international payment. French tax law also has specific rules for non-residents — consult a Franco-Israeli tax specialist.",
    tip: "The Franco-Israeli tax treaty means your French pension may be taxed in France, not Israel, depending on your specific situation.",
  },
  // ─── Russia / CIS specific ────────────────────────────────────────────────
  {
    id: "russia_sochnut",
    title: "Register with the Jewish Agency CIS office",
    category: "admin",
    phase: "first_week",
    origins: ["russia_cis"],
    stages: ["planning"],
    time: "2–3 hours",
    office: "Jewish Agency CIS regional office (Moscow, St. Petersburg, Kyiv, or nearest office)",
    bring: ["Passport", "Jewish documentation (birth certificate showing Jewish parent/grandparent, Jewish marriage certificate, etc.)", "Photos"],
    details: "The Jewish Agency has dedicated offices across Russia and CIS countries that handle Aliyah applications. The documentation requirements and process can differ from Western countries — Jewish lineage through a grandparent is sufficient under the Law of Return. Staff speak Russian and are familiar with the specific challenges CIS immigrants face, including document authentication and translation requirements.",
    tip: "Russian-speaking immigrants are one of the largest communities in Israel — you'll find Russian speakers in virtually every city and town.",
  },
  {
    id: "russia_document_auth",
    title: "Apostille and authenticate your documents",
    category: "documents",
    phase: "first_week",
    origins: ["russia_cis"],
    stages: ["planning"],
    time: "Several weeks — start early",
    office: "Ministry of Justice or notary in your country",
    bring: ["Original documents (birth certificate, marriage certificate, education diplomas)", "Translation requirements vary by document"],
    details: "Documents from Russia and CIS countries require apostille certification and certified Russian-to-Hebrew or Russian-to-English translation before they'll be accepted by Israeli authorities. This process can take weeks or months. Start gathering and authenticating your documents as early as possible — birth certificates, marriage certificates, divorce decrees, education diplomas, and military service records may all be needed.",
    tip: "Use an official certified translator — unofficial translations are rejected by Israeli government offices.",
  },
  // ─── South Africa specific ────────────────────────────────────────────────
  {
    id: "sa_passport_renewal",
    title: "Renew your South African passport before arriving",
    category: "documents",
    phase: "first_week",
    origins: ["south_africa"],
    stages: ["planning"],
    time: "6–12 weeks (apply early)",
    office: "South African Department of Home Affairs or SA Embassy",
    bring: ["Current passport", "ID document", "Application form", "Fees"],
    details: "South African passports can take 6–12 weeks to renew, and this is frequently longer during busy periods. Make sure your passport has at least 2 years validity before you make Aliyah — Israeli authorities and airlines require this. Renewing from Israel is possible through the South African Embassy in Tel Aviv but is more complex and slower than doing it before you leave.",
    tip: "South African citizens can hold dual Israeli-South African citizenship. You do not need to give up your SA citizenship when making Aliyah.",
    link: "https://www.dha.gov.za",
  },
  {
    id: "sa_pension_preservation",
    title: "Handle your South African pension and retirement annuity",
    category: "money",
    phase: "first_month",
    origins: ["south_africa"],
    stages: ["just_arrived", "planning"],
    time: "Several weeks — consult a specialist",
    office: "Your pension fund administrator and a SA-Israeli financial adviser",
    bring: ["Pension fund statements", "Retirement annuity policy documents", "Tax clearance certificate"],
    details: "South Africans emigrating to Israel need to carefully manage their pension funds and retirement annuities. You can access your pension fund upon emigration — but tax implications are significant. Retirement annuities can be transferred or cashed in under specific conditions. South Africa's SARS requires a tax clearance for foreign investment approval. This is complex and requires specialist advice from a financial adviser who understands both SA and Israeli tax law.",
    tip: "South Africa has exchange controls — you'll need a tax clearance certificate and to follow SARB (South African Reserve Bank) procedures to move money to Israel legally.",
  },
  {
  id: "community_groups",
  title: "Join your local English-speaking community groups",
  category: "admin",
  phase: "first_week",
  origins: ["all"],
  stages: ["planning", "just_arrived", "settling", "established"],
  time: "15–30 minutes",
  office: "Online — Facebook & WhatsApp",
  bring: [],
  details: "The Anglo immigrant community in Israel is one of the most active anywhere. These Facebook groups are where people find apartments, recommend doctors, warn about scams, and share job leads.\n\nNATIONAL GROUPS:\n• Anglo Olim — https://www.facebook.com/groups/angloaliyah\n• Nefesh B'Nefesh Communities — https://www.facebook.com/groups/NBNcommunities\n• Keep Olim in Israel — search on Facebook\n• Jobs for Olim in Israel — search on Facebook\n\nSECRET CITY GROUPS:\n• Secret Tel Aviv (430k members) — https://www.facebook.com/groups/secrettelaviv\n• Secret Jerusalem — https://www.facebook.com/groups/secretjerusalem\n• Secret Herzliya — https://www.facebook.com/groups/798872930144668\n• Secret Haifa — search 'Secret Haifa' on Facebook\n• Secret Netanya — search 'Secret Netanya' on Facebook\n• Secret Ra'anana — search 'Secret Ra'anana' on Facebook\n• Secret Modi'in — search 'Secret Modi'in' on Facebook\n• Secret Ashdod — search 'Secret Ashdod' on Facebook\n\nORIGIN-SPECIFIC:\n• Proudly South African Olim — search on Facebook\n• Americans in Israel — search on Facebook\n• British Olim — search on Facebook\n• Olim Francophones — search on Facebook",
  tip: "Post in these groups before you arrive. Ask for landlord recommendations, doctor referrals, and neighbourhood advice. People respond within minutes.",
  link: "https://www.facebook.com/groups/secrettelaviv",
},
{
  id: "sim_card",
  title: "Get an Israeli SIM card",
  category: "admin",
  phase: "first_week",
  origins: ["all"],
  stages: ["just_arrived"],
  time: "30 minutes",
  office: "Any phone carrier — HOT Mobile, Partner, Cellcom, 012 Mobile",
  bring: ["Teudat Zehut or Teudat Oleh + Passport", "Credit or debit card"],
  details: "Get an Israeli number on day one — every government office, Kupat Holim, bank, and landlord needs it. HOT Mobile and 012 Mobile offer plans from around ₪30/month with unlimited data. You can get a SIM at the airport arrivals hall. If your Teudat Zehut hasn't arrived yet, most carriers accept your Teudat Oleh with passport.",
  tip: "HOT Mobile's ₪30/month unlimited plan is the best value for new Olim. Don't wait for the perfect plan — just get a number on day one.",
},
{
  id: "rav_kav",
  title: "Get a Rav Kav (public transport card)",
  category: "transport",
  phase: "first_week",
  origins: ["all"],
  stages: ["just_arrived", "settling"],
  time: "20 minutes",
  office: "Any train station, post office, or major bus terminal",
  bring: ["Teudat Zehut", "Payment"],
  details: "The Rav Kav is Israel's national smart card for buses, trains, and light rail. Without one you pay cash which is more expensive and slower. The card costs ₪5. Download the Moovit app — it's more accurate than Google Maps for Israeli public transport and shows real-time delays.",
  tip: "Download Moovit before you land. Ask at the train station counter about the discounted Oleh Rav Kav.",
  link: "https://www.rail.co.il/en",
},
{
    id: "buy_apartment",
    title: "Buy an apartment in Israel",
    category: "housing",
    phase: "first_year",
    origins: ["all"],
    stages: ["established"],
    time: "3–6 months process",
    office: "Real estate lawyer (orech din) + bank mortgage department",
    bring: ["Teudat Zehut", "Teudat Oleh", "Proof of income", "Bank statements (3–6 months)", "Tax residency confirmation"],
    details: "Buying property in Israel as an Oleh comes with a significant financial benefit: a reduced purchase tax (mas rechisha). As of 2024, Olim pay zero tax on the first ~1.98 million NIS of the purchase price, then reduced rates up to ~5.28 million NIS. This benefit is usable once and must be claimed within 7 years of Aliyah.\n\nThe buying process:\n1. Find a property and agree on a price\n2. Hire a licensed Israeli lawyer (orech din) — non-negotiable. Fee: 0.5–1% of purchase price\n3. Lawyer checks title registration (tabu), outstanding liens, building violations, and planning permissions\n4. Sign a preliminary contract (zichron devarim) — this is not fully binding but is the convention\n5. Sign the full purchase contract\n6. Obtain a mortgage (mashkanta) if needed — Israeli banks lend up to 70% for investment property, 75% for primary residence\n7. Complete land registration (tabu) — the final step that makes you the legal owner\n\nMortgage (mashkanta): Use a mortgage broker (yoetz mashkanta) — they're often free (paid by the bank) and can save you significant money on your rate. Mizrahi-Tefahot and Bank Hapoalim are strongest for mortgages.",
    tip: "Always use a lawyer for property transactions — never go directly between buyer and seller without one. The lawyer fee is the best money you'll spend in the process.",
  },
  {
    id: "renew_teudat_zehut",
    title: "Renew your Teudat Zehut",
    category: "documents",
    phase: "first_year",
    origins: ["all"],
    stages: ["established"],
    time: "1 hour",
    office: "Misrad HaPnim (Ministry of Interior)",
    address: "Book online at gov.il — walk-ins not recommended",
    phone: "*3450",
    hours: "Sun–Thu 8:00–13:00 (varies by branch)",
    bring: ["Current Teudat Zehut", "Biometric photo (taken at the office)", "Payment (~₪32)"],
    details: "Israeli ID cards expire every 10 years. If yours is expiring — or if your address has changed and you haven't updated it — you need to visit Misrad HaPnim. The renewal is now biometric: fingerprints and photo are taken at the office. You'll receive a temporary paper ID on the same day and the new card within a few weeks. Your Teudat Zehut is also your official address record — if you've moved, update it at the same appointment.",
    tip: "Update your address on your Teudat Zehut every time you move. Many services (Bituach Leumi, Kupat Holim, Mas Hachnasa) use this address for official correspondence.",
    link: "https://www.gov.il/en/departments/ministry_of_interior",
  },
  {
    id: "register_children_abroad",
    title: "Register children born abroad as Israeli citizens",
    category: "documents",
    phase: "first_year",
    origins: ["all"],
    stages: ["established", "settling"],
    time: "1–2 hours",
    office: "Misrad HaPnim (Ministry of Interior)",
    bring: ["Both parents' Teudat Zehut", "Child's birth certificate (apostilled)", "Parents' marriage certificate (apostilled)", "Child's passport", "Passport photos of the child"],
    details: "Children born abroad to Israeli citizens are entitled to Israeli citizenship but must be formally registered. The process is done at Misrad HaPnim and is straightforward but document-heavy. Both parents should attend if possible. The child will receive a Teudat Zehut number and can then receive an Israeli passport. If one parent is not Israeli, additional documentation may be required — call the office in advance.",
    tip: "Register children born abroad as soon as possible — Israeli citizenship from birth has significant benefits including education, Bituach Leumi, and future army service considerations.",
  },
  {
    id: "pension_consolidation",
    title: "Consolidate your Israeli pension funds",
    category: "money",
    phase: "first_year",
    origins: ["all"],
    stages: ["established"],
    time: "2–3 hours research + adviser call",
    office: "Your pension funds + pensiyanet.co.il",
    bring: ["Teudat Zehut", "Employment history details", "Previous payslips if available"],
    details: "Most Olim who have worked for several Israeli employers accumulate multiple small pension funds (karnot pensia) — one per employer. These are often sitting with different providers, charging separate management fees, and losing money through fragmentation. After a few years in Israel, consolidating them into a single fund can save significant management fees and simplify your retirement planning.\n\nUse pensiyanet.co.il — the Israeli government's official pension tracking system — to locate all your pension funds using your Teudat Zehut. This often reveals funds people had forgotten about entirely.\n\nKeren Hishtalmut maturity: If you've been contributing to a Keren Hishtalmut (training fund) for 6 years, the funds become accessible completely tax-free. This is a significant financial milestone — the money can be withdrawn or reinvested.",
    tip: "Use pensiyanet.co.il with your Teudat Zehut to find every pension fund in your name. Many Olim discover they have funds they'd forgotten about.",
    link: "https://www.pensiyanet.co.il",
  },
  {
    id: "understand_payslip",
    title: "Understand your Israeli payslip (tlaush maskoret)",
    category: "money",
    phase: "first_month",
    origins: ["all"],
    stages: ["just_arrived", "settling"],
    time: "1 hour",
    office: "Your employer's HR department or a local accountant",
    bring: ["Your payslip", "Employment contract"],
    details: "Israeli payslips are dense and confusing for new immigrants. Here's what the main deductions mean:\n\n• Mas Hachnasa (מס הכנסה): Israeli income tax. Progressive rates from 10% to 47%. New Olim get tax credits (nekudot zikui) that reduce this significantly in the first years.\n• Bituach Leumi (ביטוח לאומי): National Insurance contributions (employee share). Covers disability, unemployment, maternity, and old-age pension. New Olim pay a reduced rate for the first 12 months (~0.4% vs standard ~3.5%).\n• Bituach Briut (ביטוח בריאות): Health insurance tax — goes to the government to fund the national health system, not directly to your Kupat Holim.\n• Keren Pensia (קרן פנסיה): Pension fund contribution. Mandatory by law. Both employer and employee contribute. Verify your employer is actually depositing — check your pension fund statements quarterly.\n• Keren Hishtalmut (קרן השתלמות): Training fund. Employer and employee contributions up to a tax-free ceiling. After 6 years, accessible completely tax-free. Always negotiate this into your employment package — it's one of the most valuable benefits in Israel.\n• Dmei Havra'ah (דמי הבראה): Recuperation pay — a statutory annual payment, typically equivalent to 1–2 days' salary per year of service. Paid once a year, usually in summer.",
    tip: "If your payslip shows Keren Hishtalmut contributions — great, your employer is offering one of Israel's best financial benefits. If it's missing, negotiate to add it. The tax savings over 6 years are substantial.",
  },
  {
    id: "self_employment",
    title: "Register as self-employed (osek patur or osek murshe)",
    category: "money",
    phase: "first_3_months",
    origins: ["all"],
    stages: ["just_arrived", "settling", "established"],
    time: "1–2 hours",
    office: "Israel Tax Authority (Mas Hachnasa) + Bituach Leumi",
    phone: "*4954",
    bring: ["Teudat Zehut", "Teudat Oleh", "Bank account details", "Description of your business activity"],
    details: "If you're freelancing, consulting, or running a business in Israel, you must register as self-employed with both the Tax Authority and Bituach Leumi. There are two tiers:\n\n• Osek Patur (exempt dealer): For annual turnover under ~₪120,000 (indexed). Simplified — you don't charge VAT to clients and file a simplified annual report. The easiest option for freelancers just starting out.\n• Osek Murshe (licensed dealer): Required above the threshold. You must charge VAT (17%) on invoices, file quarterly VAT returns, and keep formal accounting records.\n\nRegardless of tier, you must register with Bituach Leumi as self-employed and make monthly contributions. As a new Oleh you pay reduced Bituach Leumi for the first 12 months.\n\nInvoicing: Issue a reshet (receipt) or heshbonit (invoice) for every payment received. There are affordable Israeli accounting apps — Hashavshevet, חשבית (Hashavit), and Priority are popular.",
    tip: "Register as osek patur first if your income will be under ₪120,000/year. It's much simpler administratively. You can upgrade to osek murshe later if your turnover grows.",
  },
  {
    id: "profession_recognition",
    title: "Get your foreign profession recognised in Israel",
    category: "admin",
    phase: "first_3_months",
    origins: ["all"],
    stages: ["just_arrived", "settling"],
    time: "6 months–3 years depending on profession",
    office: "Relevant Israeli ministry (Health, Justice, Infrastructure, etc.)",
    bring: ["Foreign degree certificates (apostilled)", "Transcripts", "Professional licence from home country", "Proof of work experience", "Hebrew translations of all documents"],
    details: "Regulated professions in Israel require a licence recognition process (hakhara) before you can practise. The most common ones for Anglo immigrants:\n\n• Doctors (Rofeh): Apply to the Ministry of Health. Requires passing Hebrew medical exams and often a supervised internship period. Process: 1–3 years.\n• Nurses: Ministry of Health. Often faster than doctors, especially for specialised nurses.\n• Lawyers (Orech Din): Israel Bar Association. Foreign lawyers typically must pass Israeli Bar exams. Hebrew proficiency required.\n• Engineers/Architects: Ministry of National Infrastructure. Relatively streamlined for Western-qualified engineers.\n• Teachers: Ministry of Education. Recognition varies significantly by subject and qualification level.\n• Accountants: Institute of CPAs in Israel.\n\nDo not practise a regulated profession in Israel without a licence — penalties are serious. Start the recognition process immediately on arrival, as it can take years.",
    tip: "Contact the relevant professional association in Israel before you make Aliyah to understand exactly what's required — some recognitions can be started before you land.",
  },
  {
    id: "english_speaking_gp",
    title: "Find an English-speaking doctor (GP) in your Kupat Holim",
    category: "health",
    phase: "first_month",
    origins: ["all"],
    stages: ["just_arrived", "settling"],
    time: "30 minutes (online or app)",
    office: "Your Kupat Holim branch or app",
    bring: ["Kupat Holim membership card", "Teudat Zehut"],
    details: "One of the most important things to sort in your first month is finding a regular English-speaking GP (Rofeh Mishpacha — family doctor) within your Kupat Holim. Without a registered GP, you'll be assigned one — often Hebrew-only. Maccabi makes this easiest through their app — you can filter for English-speaking doctors and see their available appointment slots. Clalit requires a branch visit. Meuhedet and Leumit vary by area.\n\nAnglo Facebook groups (Secret Tel Aviv, Ra'anana Anglo, etc.) are the best source for personal recommendations of English-speaking doctors, dentists, and specialists in your area.",
    tip: "Ask in local Anglo Facebook groups for doctor recommendations in your city — personal referrals are far more reliable than the Kupat Holim directory.",
  },
  {
    id: "tipat_chalav",
    title: "Register newborns at Tipat Chalav (well-baby clinic)",
    category: "health",
    phase: "first_week",
    origins: ["all"],
    stages: ["just_arrived", "settling", "established"],
    time: "1 hour",
    office: "Your local Tipat Chalav clinic (run by the municipality)",
    bring: ["Baby's birth certificate", "Parents' Teudat Zehut", "Teudat Oleh"],
    details: "Tipat Chalav (literally 'drop of milk') is Israel's free national well-baby clinic system, run by municipalities. Every baby born in Israel — or immigrant babies under a certain age — is entitled to free care including vaccinations, developmental checks, nutritional guidance, and nurse home visits after birth. It is one of the best healthcare benefits in Israel and is completely free regardless of Kupat Holim membership. Register your newborn within the first few days of returning home from hospital. The clinic nurse will often come to your home for the first check.",
    tip: "Tipat Chalav nurses often speak some English, especially in Anglo-heavy cities like Ra'anana. Ask at your first visit — they're an excellent resource for new immigrant parents.",
  },
];


// ─── Document checklist data ─────────────────────────────────────────────────
const DOC_GROUPS = [
  { id: "before_leaving", label: "Before you leave" },
  { id: "at_airport",     label: "At the airport" },
  { id: "first_week",     label: "First week" },
  { id: "ongoing",        label: "Ongoing" },
];

interface DocItem {
  id: string;
  name: string;
  note?: string;
  group: string;
  origins: string[];
}

const DOC_ITEMS: DocItem[] = [
  // Before leaving
  { id: "passport",         name: "Passport (2+ years validity)",        note: "Airlines and Israeli authorities require this.",             group: "before_leaving", origins: ["all"] },
  { id: "birth_cert",       name: "Birth certificate (apostilled)",       note: "Must be officially apostilled in your home country.",        group: "before_leaving", origins: ["all"] },
  { id: "jewish_docs",      name: "Jewish documentation",                 note: "Synagogue letter, bar/bat mitzvah cert, parent/grandparent birth cert.", group: "before_leaving", origins: ["all"] },
  { id: "marriage_cert",    name: "Marriage certificate (if applicable)", note: "Apostilled copy required.",                                 group: "before_leaving", origins: ["all"] },
  { id: "divorce_decree",   name: "Divorce decree (if applicable)",       note: "Apostilled copy required.",                                 group: "before_leaving", origins: ["all"] },
  { id: "passport_photos",  name: "Passport photos (bring 10+)",          note: "You will use them at every office. 35mm biometric format.", group: "before_leaving", origins: ["all"] },
  { id: "bank_statements",  name: "Last 3 months bank statements",        note: "Some offices and landlords request these.",                 group: "before_leaving", origins: ["all"] },
  { id: "ni_number",        name: "National Insurance number (NI)",       note: "Needed for voluntary NI contributions from Israel.",        group: "before_leaving", origins: ["uk"] },
  { id: "ss_card",          name: "Social Security card / number",        note: "Needed for SSA notifications and FBAR filing.",             group: "before_leaving", origins: ["us_ca"] },
  { id: "sin_number",       name: "SIN (Social Insurance Number)",        note: "Needed for CPP and OAS notifications.",                    group: "before_leaving", origins: ["us_ca"] },
  { id: "sa_id_document",   name: "South African ID document (green book / smart card)", note: "Required by Telfed and Home Affairs.",        group: "before_leaving", origins: ["south_africa"] },
  { id: "tax_clearance",    name: "SA tax clearance certificate (SARS)",  note: "Required to move money out of South Africa legally.",      group: "before_leaving", origins: ["south_africa"] },
  { id: "diplomas",         name: "Education diplomas / transcripts",     note: "May be required for employment or university registration.", group: "before_leaving", origins: ["all"] },
  // At the airport
  { id: "teudat_oleh",      name: "Teudat Oleh",                          note: "Issued at the airport on arrival — your Aliyah certificate.", group: "at_airport",   origins: ["all"] },
  { id: "matak",            name: "Matak grant paperwork",                note: "One-time arrival grant — ask at the airport desk.",          group: "at_airport",   origins: ["all"] },
  // First week
  { id: "teudat_zehut",     name: "Teudat Zehut (Israeli ID)",            note: "Applied for at Misrad Hapnim — takes ~2 weeks to arrive.",  group: "first_week",   origins: ["all"] },
  { id: "temp_id",          name: "Temporary ID (Zmanit)",                note: "Issued immediately at Misrad Hapnim while you wait.",        group: "first_week",   origins: ["all"] },
  { id: "bituach_confirm",  name: "Bituach Leumi registration confirmation", note: "Proof you've registered for National Insurance.",         group: "first_week",   origins: ["all"] },
  { id: "kupah_card",       name: "Kupat Holim membership card",          note: "Your health fund membership — carry it always.",            group: "first_week",   origins: ["all"] },
  { id: "bank_card",        name: "Israeli bank card and account details", note: "Needed for Sal Klita payments and rent.",                  group: "first_week",   origins: ["all"] },
  // Ongoing
  { id: "lease",            name: "Signed rental contract",               note: "Keep a copy — needed for Arnona discount and municipality.", group: "ongoing",     origins: ["all"] },
  { id: "tax_residency",    name: "Tax residency confirmation",           note: "From Mas Hachnasa — establishes your 10-year exemption.",   group: "ongoing",     origins: ["all"] },
  { id: "foreign_licence",  name: "Foreign driver's licence (original)",  note: "Surrender at Misrad Harishui when converting.",             group: "ongoing",     origins: ["all"] },
  { id: "p85_confirmation", name: "HMRC P85 confirmation",                note: "Proof you've notified HMRC of non-resident status.",        group: "ongoing",     origins: ["uk"] },
  { id: "fbar_receipt",     name: "FBAR filing confirmation",             note: "Annual filing — keep receipts for every year.",             group: "ongoing",     origins: ["us_ca"] },
];

function renderDetailsWithLinks(text: string) {
  return text.split(/(https?:\/\/[^\s\n]+)/g).map((part, i) =>
    part.startsWith("http") ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer"
         className="text-blue-600 hover:underline break-all">
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function RoadmapPage() {
  const [onboarding, setOnboarding] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return { stage: "just_arrived", origin: "us_ca", language: "en" };
    const ob = localStorage.getItem("koltov_onboarding");
    if (!ob) return { stage: "just_arrived", origin: "us_ca", language: "en" };
    const parsed = JSON.parse(ob);
    return {
      stage:    parsed.stage    ?? "just_arrived",
      origin:   parsed.origin   ?? "us_ca",
      language: parsed.language ?? "en",
    };
  });
  const [completed, setCompleted] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const comp = localStorage.getItem("koltov_completed");
    return comp ? JSON.parse(comp) : [];
  });
  const stage = (onboarding.stage ?? "just_arrived") as Stage;

  const [openItem, setOpenItem] = useState<RoadmapItem | null>(null);
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [docCompleted, setDocCompleted] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const d = localStorage.getItem("koltov_docs");
    return d ? JSON.parse(d) : [];
  });
  const settingsRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useLayoutEffect(() => { setMounted(true); }, []);

  // Close settings dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function saveOnboarding(updated: Record<string, string>) {
    setOnboarding(updated);
    localStorage.setItem("koltov_onboarding", JSON.stringify(updated));
  }

  function toggleComplete(id: string) {
    const updated = completed.includes(id)
      ? completed.filter((c) => c !== id)
      : [...completed, id];
    setCompleted(updated);
    localStorage.setItem("koltov_completed", JSON.stringify(updated));
  }

  function toggleDoc(id: string) {
    const updated = docCompleted.includes(id)
      ? docCompleted.filter((c) => c !== id)
      : [...docCompleted, id];
    setDocCompleted(updated);
    localStorage.setItem("koltov_docs", JSON.stringify(updated));
  }

  const origin = onboarding.origin ?? "us_ca";
  const filteredItems = ALL_ITEMS.filter((item) =>
    item.stages.includes(stage) &&
    (item.origins.includes("all") || item.origins.includes(origin))
  );
  const phases = ["first_week", "first_month", "first_3_months", "first_year"];
  const visiblePhases = phases.filter((p) => filteredItems.some((i) => i.phase === p));
  const totalItems = filteredItems.length;
  const completedCount = filteredItems.filter((i) => completed.includes(i.id)).length;
  const progressPct = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const cat = categoryMeta;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600&display=swap');`}</style>

      {/* Nav */}
<nav className="flex items-center justify-between px-4 md:px-6 py-3 sticky top-3 z-50 max-w-4xl mx-auto w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] bg-white/90 backdrop-blur-sm border border-gray-200 rounded-4xl">
  <div className="flex items-center gap-2">
    <Link href="/" className="text-xl font-semibold tracking-tight text-black">
      Kol <span className="text-blue-600">Tov</span>
    </Link>
    <span className="hidden sm:inline text-sm text-gray-400">כל טוב</span>
  </div>
  <div className="flex items-center gap-1.5">
    <Link href="/chat" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
      <span className="hidden sm:inline">Kol Tov AI</span>
    </Link>
    <Link href="/upload" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      <span className="hidden sm:inline">Upload</span>
    </Link>
    {/* Settings cog — unchanged, keep everything inside */}
    <div className="relative" ref={settingsRef}>
      <button
        onClick={() => setShowSettings((v) => !v)}
        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors border bg-blue-700 ${showSettings ? "bg-blue-700 border-gray-200" : "border-gray-100 hover:bg-blue-400"}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
        </svg>
      </button>

            {/* Settings dropdown */}
            {showSettings && (
              <div className="absolute right-0 top-11 w-80 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden z-50">
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">Your settings</p>
                  <p className="text-xs text-gray-400 mt-0.5">Changes apply instantly to your roadmap</p>
                </div>

                {/* Stage */}
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Aliyah stage</p>
                  <div className="space-y-1.5">
                    {STAGE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => saveOnboarding({ ...onboarding, stage: opt.value })}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between ${
                          stage === opt.value
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span>{opt.label}</span>
                        <span className="text-xs text-gray-400">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Origin */}
                <div className="px-5 py-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Country of origin</p>
                  <div className="space-y-1.5">
                    {ORIGIN_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => saveOnboarding({ ...onboarding, origin: opt.value })}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
                          onboarding.origin === opt.value
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-5xl mx-auto px-10 pt-16 pb-10">
        <p className="text-xs text-blue-500 font-semibold uppercase tracking-widest mb-4">Your roadmap</p>
        <h1 className="text-5xl font-semibold tracking-tight text-gray-900 mb-4" style={{ letterSpacing: "-1.5px" }}>
          Here&apos;s what to do next.
        </h1>
        <p className="text-lg text-gray-500 mb-4">
          {mounted ? totalItems : ""} steps personalised for your stage. Check them off as you go — your progress is saved automatically.
        </p>
        {mounted && (
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 mb-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
            </svg>
            <p className="text-xs text-blue-700 font-medium">
              Personalised for {{
                us_ca: "USA & Canada",
                uk: "United Kingdom",
                france: "France",
                russia_cis: "Russia & CIS",
                south_america: "South America",
                south_africa: "South Africa",
                other: "your country",
              }[origin] ?? "your country"} · {STAGE_OPTIONS.find(s => s.value === stage)?.label}
            </p>
          </div>
        )}

        {/* Progress */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-3xl font-semibold text-gray-900" style={{ letterSpacing: "-1px" }}>
                {mounted ? completedCount : 0} <span className="text-gray-300 font-normal">/ {mounted ? totalItems : 0}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">steps completed</p>
            </div>
            <p className="text-3xl font-semibold text-blue-600" style={{ letterSpacing: "-1px" }}>{mounted ? progressPct : 0}%</p>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${mounted ? progressPct : 0}%` }}
            />
          </div>
          {mounted && (
            <div className="flex gap-2 flex-wrap mt-6">
              {visiblePhases.map((p) => {
                const phaseItems = filteredItems.filter((i) => i.phase === p);
                const phaseDone = phaseItems.filter((i) => completed.includes(i.id)).length;
                return (
                  <button
                    key={p}
                    onClick={() => setActivePhase(activePhase === p ? null : p)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                      activePhase === p
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600 border-gray-100 hover:border-blue-200"
                    }`}
                  >
                    {getPhaseMeta(p, stage).label}
                    <span className={`ml-2 text-xs ${activePhase === p ? "text-blue-200" : "text-gray-400"}`}>
                      {phaseDone}/{phaseItems.length}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto px-10 pb-28">
        {visiblePhases
          .filter((p) => !activePhase || activePhase === p)
          .map((phase) => {
            const items = filteredItems.filter((i) => i.phase === phase);
            return (
              <div key={phase} className="mb-16">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900" style={{ letterSpacing: "-0.5px" }}>
                    {getPhaseMeta(phase, stage).label}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{mounted ? getPhaseMeta(phase, stage).sub : ""}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((item) => {
                    const done = completed.includes(item.id);
                    const catStyle = cat[item.category];
                    return (
                      <div
                        key={item.id}
                        onClick={() => setOpenItem(item)}
                        className={`group relative bg-white border rounded-2xl p-6 cursor-pointer transition-all duration-150 hover:shadow-sm hover:border-blue-100 ${
                          done ? "border-green-100 bg-green-50/30" : "border-gray-100"
                        }`}
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleComplete(item.id); }}
                          className={`absolute top-5 right-5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            done ? "bg-green-500 border-green-500" : "border-gray-200 hover:border-green-400"
                          }`}
                        >
                          {done && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${catStyle.bg} ${catStyle.color}`}>
                            {catStyle.label}
                          </div>
                          {!item.origins.includes("all") && (
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                              For you
                            </div>
                          )}
                        </div>
                        <h3 className={`text-base font-semibold mb-2 pr-8 leading-snug ${done ? "text-gray-400 line-through" : "text-gray-900"}`}>
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                            </svg>
                            {item.time}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                            </svg>
                            {item.office.split(" (")[0]}
                          </div>
                        </div>
                        <p className="text-xs text-blue-500 mt-4 group-hover:text-blue-700 transition-colors font-medium">
                          View details →
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      {/* Modal */}
      {openItem && (() => {
        const d = openItem;
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-6 py-10"
            style={{ background: "rgba(0,0,0,0.4)" }}
            onClick={() => setOpenItem(null)}
          >
            <div
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-10 py-6 rounded-t-3xl flex items-start justify-between gap-6">
                <div>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold mb-3 ${cat[openItem.category].bg} ${cat[openItem.category].color}`}>
                    {cat[openItem.category].label}
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 leading-tight" style={{ letterSpacing: "-0.5px" }}>
                    {d.title}
                  </h2>
                </div>
                <button
                  onClick={() => setOpenItem(null)}
                  className="shrink-0 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center mt-1"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Modal body */}
              <div className="px-10 py-8 space-y-8">
<p className="text-base text-gray-600 leading-relaxed whitespace-pre-line">
  {renderDetailsWithLinks(d.details)}
</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Time needed</p>
                    <p className="text-sm font-medium text-gray-900">{openItem.time}</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Where to go</p>
                    <p className="text-sm font-medium text-gray-900">{openItem.office}</p>
                    {openItem.address && <p className="text-xs text-gray-500 mt-1">{openItem.address}</p>}
                  </div>
                  {openItem.phone && (
                    <div className="bg-gray-50 rounded-2xl p-5">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{openItem.phone}</p>
                    </div>
                  )}
                  {openItem.hours && (
                    <div className="bg-gray-50 rounded-2xl p-5">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Opening hours</p>
                      <p className="text-sm font-medium text-gray-900">{openItem.hours}</p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">What to bring</p>
                  <div className="space-y-2.5">
                    {d.bring.map((b, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2.5 2.5L8 3" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-700">{b}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {d.tip && (
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-2">Insider tip</p>
                    <p className="text-sm text-amber-900 leading-relaxed">{d.tip}</p>
                  </div>
                )}

                {openItem.link && (
                  <a
                    href={openItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
                  >
                    Official website
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                )}
              </div>

              {/* Modal footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-100 px-10 py-5 rounded-b-3xl flex items-center justify-between">
                <button onClick={() => setOpenItem(null)} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
                  Close
                </button>
                <button
                  onClick={() => { toggleComplete(openItem.id); setOpenItem(null); }}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    completed.includes(openItem.id)
                      ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {completed.includes(openItem.id) ? "Mark as incomplete" : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7l3 3L11.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Mark as done
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      {/* Document checklist toggle button */}
      <button
        onClick={() => setShowDocs((v) => !v)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-white border border-gray-100 border-r-0 rounded-l-2xl px-3 py-5 shadow-sm hover:bg-gray-50 transition-colors flex flex-col items-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        <span className="text-xs font-semibold text-blue-600 [writing-mode:vertical-rl] rotate-180">Documents</span>
      </button>

      {/* Document checklist panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white border-l border-gray-100 z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
          showDocs ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-900">Document checklist</p>
            <p className="text-xs text-gray-400 mt-0.5">Track what you have ready</p>
          </div>
          <button
            onClick={() => setShowDocs(false)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Progress */}
        {mounted && (
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">{docCompleted.length} of {DOC_ITEMS.filter(d => d.origins.includes("all") || d.origins.includes(origin)).length} ready</p>
              <p className="text-xs font-semibold text-blue-600">
                {Math.round((docCompleted.length / Math.max(DOC_ITEMS.filter(d => d.origins.includes("all") || d.origins.includes(origin)).length, 1)) * 100)}%
              </p>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.round((docCompleted.length / Math.max(DOC_ITEMS.filter(d => d.origins.includes("all") || d.origins.includes(origin)).length, 1)) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Doc list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {DOC_GROUPS.map((group) => {
            const items = DOC_ITEMS.filter(
              (d) => d.group === group.id && (d.origins.includes("all") || d.origins.includes(origin))
            );
            if (items.length === 0) return null;
            return (
              <div key={group.id}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{group.label}</p>
                <div className="space-y-2">
                  {items.map((doc) => {
                    const done = docCompleted.includes(doc.id);
                    return (
                      <button
                        key={doc.id}
                        onClick={() => toggleDoc(doc.id)}
                        className={`w-full text-left flex items-start gap-3 px-3 py-3 rounded-xl border transition-all ${
                          done ? "border-green-100 bg-green-50/40" : "border-gray-100 bg-white hover:border-blue-100 hover:bg-blue-50/20"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          done ? "bg-green-500 border-green-500" : "border-gray-300"
                        }`}>
                          {done && (
                            <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium leading-snug ${done ? "text-gray-400 line-through" : "text-gray-900"}`}>
                            {doc.name}
                          </p>
                          {doc.note && (
                            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{doc.note}</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Backdrop */}
      {showDocs && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setShowDocs(false)}
        />
      )}

      <TranslateOrb />
    </div>
  );
}