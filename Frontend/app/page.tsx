"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, type ReactNode } from "react";

const NeuralCore = dynamic(() => import("./NeuralCore"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[260px] items-center justify-center text-sm text-sky-200/70">
      Initializing Neural Core…
    </div>
  ),
});

type Task = { id: number; title: string; detail: string; done: boolean };
type Skill = { name: string; level: number; color: string; group: string };

const initialTasks: Task[] = [
  { id: 1, title: "Complete one focused learning sprint", detail: "45 min · Deep work", done: false },
  { id: 2, title: "Improve one portfolio project", detail: "30 min · Build", done: false },
  { id: 3, title: "Practice five interview questions", detail: "20 min · Career prep", done: false },
];

const skills: Skill[] = [
  { name: "Python", level: 82, color: "#B9DDF2", group: "Programming" },
  { name: "SQL", level: 74, color: "#D5B17A", group: "Analytics" },
  { name: "Machine Learning", level: 61, color: "#A9C9DB", group: "AI / ML" },
  { name: "Statistics", level: 68, color: "#D5B17A", group: "Analytics" },
  { name: "Deep Learning", level: 48, color: "#B9DDF2", group: "AI / ML" },
  { name: "Power BI", level: 66, color: "#D5B17A", group: "BI" },
];

const navItems = [
  ["Overview", "◈", "overview"],
  ["Learning universe", "◎", "learning-universe"],
  ["Skill analytics", "⌁", "skill-analytics"],
  ["Project lab", "⌘", "project-lab"],
  ["Career explorer", "↗", "career-explorer"],
  ["Interview arena", "✳", "interview-arena"],
  ["AI mentor", "✧", "ai-mentor"],
];

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[22px] border border-[#354550]/70 bg-[#111B24]/90 shadow-[0_14px_42px_rgba(0,0,0,.16)] ${className}`}>{children}</section>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#9AAAB4]">{children}</p>;
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="nx-display mt-2 text-2xl font-semibold tracking-tight text-[#F4F0E8] sm:text-[28px]">{title}</h2>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-[#9EACB5]">{description}</p>}
      </div>
    </div>
  );
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedSkill, setSelectedSkill] = useState<Skill>(skills[0]);
  const [search, setSearch] = useState("");
  const [weekly, setWeekly] = useState([32, 55, 42, 74, 61, 88, 48]);
  const [projectChecks, setProjectChecks] = useState([true, false, false, false]);
  const [careerResults, setCareerResults] = useState<any[]>([]);
  const [careerLoading, setCareerLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [mentorPrompt, setMentorPrompt] = useState("");
  const [mentorReply, setMentorReply] = useState("Tell me your goal and I’ll help you turn it into a practical next step.");
  const [interviewQuestion, setInterviewQuestion] = useState("Explain the difference between precision and recall.");
  const [interviewAnswer, setInterviewAnswer] = useState("");

  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("nexora_tasks_v1");
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      const savedChecks = localStorage.getItem("nexora_project_checks_v1");
      if (savedChecks) setProjectChecks(JSON.parse(savedChecks));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("nexora_tasks_v1", JSON.stringify(tasks)); } catch {}
  }, [tasks]);

  useEffect(() => {
    try { localStorage.setItem("nexora_project_checks_v1", JSON.stringify(projectChecks)); } catch {}
  }, [projectChecks]);

  const completedTasks = tasks.filter((task) => task.done).length;
  const completion = Math.round((completedTasks / Math.max(tasks.length, 1)) * 100);
  const filteredSkills = useMemo(() => skills.filter((skill) => `${skill.name} ${skill.group}`.toLowerCase().includes(search.toLowerCase())), [search]);

  function goTo(label: string, id: string) {
    setActiveNav(label);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function addSkillTask() {
    setTasks((previous) => [{ id: Date.now(), title: `Practice ${selectedSkill.name}`, detail: "Added from Learning Universe", done: false }, ...previous]);
    setNotice(`Added a ${selectedSkill.name} task to today’s focus.`);
  }

  async function loadCareers() {
    setCareerLoading(true);
    setNotice("");
    try {
      const response = await fetch("http://127.0.0.1:8000/careers");
      if (!response.ok) throw new Error("Career API unavailable");
      const data = await response.json();
      const rows = Array.isArray(data) ? data : data.results ?? data.careers ?? [];
      setCareerResults(rows);
      setNotice(rows.length ? "Career data loaded from your backend." : "Backend connected, but no career records were returned.");
    } catch {
      setCareerResults([
        { title: "Junior Data Analyst", company: "Sample role — not a verified vacancy", location: "Gurugram / Hybrid", skills: "SQL, Excel, Power BI" },
        { title: "Data Science Intern", company: "Sample role — not a verified vacancy", location: "Delhi NCR", skills: "Python, Pandas, ML basics" },
        { title: "BI / Reporting Analyst", company: "Sample role — not a verified vacancy", location: "Gurugram", skills: "Power BI, SQL, dashboards" },
      ]);
      setNotice("Backend unavailable. Showing sample roles only; these are not verified live vacancies.");
    } finally { setCareerLoading(false); }
  }

  function askMentor() {
    const prompt = mentorPrompt.trim().toLowerCase();
    if (!prompt) { setMentorReply("Type a goal or problem first."); return; }
    if (prompt.includes("resume") || prompt.includes("cv")) {
      setMentorReply("Tailor your resume to one target role. Put matching skills near the top and add 2–3 project bullets covering the problem, tools, and real result. Keep every claim accurate.");
    } else if (prompt.includes("interview")) {
      setMentorReply("Try a 25-minute sprint: 5 minutes on your introduction, 10 minutes explaining one project end-to-end, and 10 minutes answering SQL/Python questions aloud.");
    } else if (prompt.includes("project") || prompt.includes("fraud")) {
      setMentorReply("Explain the business problem, data quality, baseline, metrics, trade-offs, and next improvements. For imbalanced fraud data, discuss precision-recall and false positives—not accuracy alone.");
    } else {
      setMentorReply("Turn the goal into one 30-minute action. Define what done looks like, finish a small deliverable, then review what worked. This mentor is a local demo, not a live AI model.");
    }
  }

  const statCards = [
    { label: "TODAY’S COMPLETION", value: `${completion}%`, note: `${completedTasks} of ${tasks.length} tasks complete`, mark: "◉", tone: "blue" },
    { label: "SKILL NODES", value: "06", note: "Programming, analytics & AI", mark: "⌘", tone: "gold" },
    { label: "PROJECT CHECKLIST", value: `${projectChecks.filter(Boolean).length}/4`, note: "FraudShield showcase", mark: "◈", tone: "blue" },
    { label: "WEEKLY RHYTHM", value: "In progress", note: "Small steps compound", mark: "↗", tone: "gold" },
  ];

  return (
     <main className="nexora min-h-screen overflow-hidden text-[#F3F0E9] selection:bg-[#D5B17A]/30">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; background: #090F15; }
        body { margin: 0; background: #090F15; color: #F3F0E9; font-family: 'DM Sans', sans-serif; }
        button, input, textarea { font: inherit; }
        button { cursor: pointer; }
        .nexora { background: radial-gradient(ellipse at 68% 2%, rgba(85,128,154,.13), transparent 35%), #090F15; }
        .nx-display { font-family: 'Space Grotesk', sans-serif; letter-spacing: -.045em; }
        .nx-grid { background-image: linear-gradient(rgba(171,195,209,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(171,195,209,.035) 1px,transparent 1px); background-size: 44px 44px; }
        .nx-card { transition: transform .22s ease,border-color .22s ease,background .22s ease; }
        .nx-card:hover { transform: translateY(-2px); border-color: rgba(183,214,231,.34); background-color: rgba(22,36,47,.98); }
        .nx-button { transition: transform .2s ease,filter .2s ease; }
        .nx-button:hover { transform: translateY(-1px); filter: brightness(1.07); }
        .nx-input { width: 100%; border: 1px solid rgba(155,181,197,.2); background: rgba(255,255,255,.035); color: #F3F0E9; border-radius: 13px; outline: none; padding: 12px 14px; }
        .nx-input:focus { border-color: rgba(183,214,231,.6); box-shadow: 0 0 0 3px rgba(183,214,231,.08); }
        .nx-input::placeholder { color: #718391; }
        .nx-node { transform: translate(-50%,-50%); transition: transform .2s ease,box-shadow .2s ease; }
        .nx-node:hover { transform: translate(-50%,-50%) scale(1.05); }
        @media(max-width:640px) { .nx-grid { background-size: 28px 28px; } }
      `}</style>

      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -top-52 left-[18%] h-[560px] w-[560px] rounded-full bg-[#A8CDE2]/[0.07] blur-[145px]" />
        <div className="absolute right-[-180px] top-[35%] h-[500px] w-[500px] rounded-full bg-[#CDA66F]/[0.045] blur-[150px]" />
        <div className="nx-grid absolute inset-0 opacity-80" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-[252px] shrink-0 border-r border-[#344451]/60 bg-[#0A1118]/95 px-5 py-6 xl:flex xl:flex-col">
          <button onClick={() => goTo("Overview", "overview")} className="mb-10 flex items-center gap-3 text-left">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#AFCFE2]/25 bg-[#B9DDF2]/[0.08] text-xl text-[#D7E8F2] shadow-[0_0_28px_rgba(161,202,226,.08)]">✳</span>
            <span><span className="nx-display block text-xl font-bold text-[#F3F0E9]">NEXORA<span className="text-[#D5B17A]">.</span></span><span className="text-[9px] tracking-[.18em] text-[#8FA2AF]">CAREER INTELLIGENCE</span></span>
          </button>
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#8295A3]">Workspace</p>
          <nav className="space-y-1">
            {navItems.map(([label, glyph, id]) => (
              <button key={label} onClick={() => goTo(label, id)} className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm transition ${activeNav === label ? "border-[#B9DDF2]/20 bg-[#B9DDF2]/[0.08] text-[#D7E8F2]" : "border-transparent text-[#9BAAB5] hover:border-white/[0.05] hover:bg-white/[0.035] hover:text-[#F3F0E9]"}`}>
                <span className="w-5 text-center text-base">{glyph}</span>{label}
                {activeNav === label && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#D5B17A]" />}
              </button>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl border border-[#AFCFE2]/15 bg-gradient-to-br from-[#B9DDF2]/[0.07] to-[#D5B17A]/[0.035] p-4">
            <div className="mb-3 flex justify-between"><span className="text-[10px] font-bold uppercase tracking-[.15em] text-[#9BAAB5]">Your momentum</span><span className="text-xs text-[#D7E8F2]">{completion}%</span></div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]"><div className="h-full rounded-full bg-gradient-to-r from-[#B9DDF2] to-[#D5B17A] transition-all" style={{ width: `${completion}%` }} /></div>
            <p className="mt-3 text-xs leading-5 text-[#9BAAB5]">Small, consistent progress compounds into career-ready skills.</p>
          </div>
          <div className="mt-5 flex items-center gap-3 border-t border-[#344451]/60 pt-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#D7E8F2] to-[#D5B17A] font-bold text-[#101820]">N</div>
            <div><p className="text-sm font-semibold text-[#F3F0E9]">My workspace</p><p className="text-xs text-[#8295A3]">Local demo</p></div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          

 <div className="mx-auto max-w-[1500px] px-4 pb-8 pt-5 sm:px-7 sm:pt-7 lg:px-10 lg:pt-8">
            <section id="overview" className="relative mb-6 scroll-mt-24 overflow-hidden rounded-[28px] border border-[#40515D]/70 bg-[#0D1822] shadow-[0_22px_80px_rgba(0,0,0,.24)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#B9DDF2]/[0.075] via-transparent to-[#D5B17A]/[0.055]" />
              <div className="nx-grid absolute inset-0 opacity-70" />
              <div className="absolute -right-20 -top-28 h-96 w-96 rounded-full bg-[#B9DDF2]/[0.07] blur-[100px]" />
              <div className="relative grid items-center gap-5 px-6 py-7 sm:px-9 sm:py-9 lg:min-h-[360px] lg:grid-cols-[1.02fr_.98fr] lg:gap-7 lg:px-10 lg:py-8 xl:px-12">
                <div className="relative z-10 max-w-2xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#B9DDF2]/20 bg-[#B9DDF2]/[0.06] px-3 py-1.5 text-[10px] font-bold tracking-[.14em] text-[#D7E8F2]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#B9DDF2]" /> YOUR PERSONAL AI CAREER OS</div>
                  <h1 className="nx-display text-[38px] font-semibold leading-[1.05] text-[#F3F0E9] sm:text-5xl xl:text-[56px]">Build skills.<br /><span className="text-[#D5B17A]">Shape your</span><br />next chapter.</h1>
                  <p className="mt-4 max-w-lg text-sm leading-6 text-[#A5B2BC] sm:text-[15px] sm:leading-7">One focused workspace for learning, building projects, tracking progress, and getting ready for the opportunities you want.</p>
                  <div className="mt-5 flex flex-nowrap gap-3">
                    <button onClick={() => goTo("Learning universe", "learning-universe")} className="nx-button whitespace-nowrap rounded-xl bg-[#D7E8F2] px-5 py-3 text-sm font-bold !text-[#101820] shadow-[0_8px_28px_rgba(183,214,231,.12)]">Explore learning universe ↗</button>
                    <button onClick={() => goTo("Project lab", "project-lab")} className="nx-button rounded-xl border border-[#718593]/30 bg-[#14212B]/80 px-5 py-3 text-sm font-semibold text-[#E2E8EC] hover:border-[#D5B17A]/40">Open project lab</button>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#93A2AD]"><span>✦ Adaptive learning</span><span>✦ Portfolio-first</span><span>✦ Career-focused</span></div>
                </div>
                <div className="relative mx-auto mt-1 h-[280px] w-full max-w-[450px] sm:h-[320px] lg:mt-0 lg:h-[330px]">
                  <div className="absolute inset-[8%] rounded-full border border-[#B9DDF2]/[0.11]" />
                  <div className="absolute inset-[17%] rounded-full border border-[#D5B17A]/[0.13]" />
                  <div className="absolute inset-[24%] rounded-full bg-[#B9DDF2]/[0.055] blur-3xl" />
                  <div className="absolute inset-0"><NeuralCore /></div>
                  <div className="absolute left-0 top-[13%] rounded-xl border border-[#40515D]/80 bg-[#101C26]/95 px-3 py-2 shadow-lg backdrop-blur-xl"><Eyebrow>Core system</Eyebrow><p className="mt-1 text-xs font-semibold text-[#D7E8F2]">Learning intelligence</p></div>
                  <div className="absolute bottom-[9%] right-0 rounded-xl border border-[#40515D]/80 bg-[#101C26]/95 px-3 py-2 shadow-lg backdrop-blur-xl"><Eyebrow>Current focus</Eyebrow><p className="mt-1 text-xs font-semibold text-[#E4C89F]">Data + AI</p></div>
                </div>
              </div>
              <div className="relative grid grid-cols-2 border-t border-[#40515D]/60 sm:grid-cols-4">
                {[[ "01", "LEARN WITH INTENT" ], [ "02", "BUILD REAL PROJECTS" ], [ "03", "MEASURE PROGRESS" ], [ "04", "PREPARE TO LAUNCH" ]].map(([number, label]) => <div key={number} className="border-b border-r border-[#40515D]/50 px-4 py-3.5 last:border-r-0 sm:border-b-0"><span className="mr-2 text-[10px] font-bold text-[#D5B17A]">{number}</span><span className="text-[9px] font-bold tracking-[.1em] text-[#91A2AE]">{label}</span></div>)}
              </div>
            </section>

            <section className="mb-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
              {statCards.map((card) => <Panel key={card.label} className="nx-card p-4 sm:p-5"><div className="flex items-start justify-between gap-2"><p className="text-[9px] font-bold leading-4 tracking-[.1em] text-[#91A2AE] sm:text-[10px]">{card.label}</p><span className={card.tone === "gold" ? "text-[#D5B17A]" : "text-[#B9DDF2]"}>{card.mark}</span></div><p className="nx-display mt-3 text-xl font-semibold text-[#F3F0E9] sm:text-2xl">{card.value}</p><p className="mt-1 text-xs leading-5 text-[#91A2AE]">{card.note}</p></Panel>)}
            </section>

            <SectionHeading eyebrow="Daily operating system" title="Your next best moves" description="A clear, realistic plan for making progress today." />
            <div className="mb-9 grid gap-4 xl:grid-cols-[1.04fr_.96fr]">
              <Panel className="p-5 sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-semibold text-[#F3F0E9]">Today’s focus</h3><p className="mt-1 text-xs text-[#91A2AE]">Three small actions. One meaningful day.</p></div><span className="rounded-xl border border-[#B9DDF2]/15 bg-[#B9DDF2]/[0.05] px-3 py-2 text-xs text-[#D7E8F2]">{completedTasks}/{tasks.length} complete</span></div>
                <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full rounded-full bg-gradient-to-r from-[#B9DDF2] to-[#D5B17A] transition-all" style={{ width: `${completion}%` }} /></div>
                <div className="space-y-3">{tasks.map((task) => <button key={task.id} onClick={() => setTasks((previous) => previous.map((item) => item.id === task.id ? { ...item, done: !item.done } : item))} className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${task.done ? "border-[#A6CBB9]/20 bg-[#A6CBB9]/[0.04]" : "border-[#344451]/65 bg-[#0D1720]/75 hover:border-[#8CA8B8]/35"}`}><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs ${task.done ? "border-[#A6CBB9] bg-[#A6CBB9] text-[#0A1512]" : "border-[#657985] text-transparent"}`}>{task.done ? "✓" : "·"}</span><span className="min-w-0 flex-1"><span className={`block text-sm font-medium ${task.done ? "text-[#8295A3] line-through" : "text-[#E7E9E7]"}`}>{task.title}</span><span className="mt-1 block text-xs text-[#91A2AE]">{task.detail}</span></span><span className="text-[#D5B17A]">↗</span></button>)}</div>
              </Panel>
              <Panel className="relative overflow-hidden p-5 sm:p-6"><div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#B9DDF2]/[0.06] blur-3xl" /><div className="relative"><div className="mb-5 flex items-center justify-between gap-3"><div><h3 className="font-semibold text-[#F3F0E9]">Weekly activity</h3><p className="mt-1 text-xs text-[#91A2AE]">Illustrative focus score · select a bar to edit</p></div><span className="text-xs text-[#D5B17A]">7-day view</span></div><div className="flex h-44 items-end justify-between gap-2 border-b border-[#344451]/60 pb-2">{weekly.map((value, index) => <button key={index} title={`Day ${index + 1}: ${value}`} onClick={() => setWeekly((previous) => previous.map((item, itemIndex) => itemIndex === index ? (item >= 95 ? 20 : item + 10) : item))} className="group flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-[10px] text-[#91A2AE] opacity-0 group-hover:opacity-100">{value}</span><div className="w-full max-w-8 rounded-t-md bg-gradient-to-t from-[#607D91] to-[#D5B17A] transition-all duration-500 group-hover:brightness-110" style={{ height: `${value}%` }} /><span className="text-[10px] text-[#91A2AE]">{["M", "T", "W", "T", "F", "S", "S"][index]}</span></button>)}</div><div className="mt-4 flex justify-between text-xs"><span className="text-[#8295A3]">Demo data</span><span className="font-semibold text-[#D7E8F2]">{Math.round(weekly.reduce((sum, value) => sum + value, 0) / weekly.length)} average</span></div></div></Panel>
            </div>

            <section id="learning-universe" className="mb-9 scroll-mt-24">
              <SectionHeading eyebrow="Interactive learning map" title="Learning universe" description="Choose a skill node to inspect your current baseline and add a practice task." />
              <div className="grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
                <Panel className="relative min-h-[430px] overflow-hidden p-4 sm:p-6"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(142,190,215,.09),transparent_68%)]" /><div className="nx-grid absolute inset-0 opacity-50" /><div className="relative h-[390px]">
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{filteredSkills.map((skill, index) => <line key={skill.name} x1="50" y1="49" x2={16 + index * 13} y2={index % 2 === 0 ? 19 : 78} stroke={selectedSkill.name === skill.name ? skill.color : "rgba(155,181,197,.25)"} strokeWidth={selectedSkill.name === skill.name ? ".65" : ".35"} strokeDasharray="1.2 1.5" />)}<circle cx="50" cy="49" r="17" fill="rgba(183,214,231,.035)" stroke="rgba(183,214,231,.28)" strokeWidth=".35" /></svg>
                  <button onClick={() => setSelectedSkill({ name: "Career Core", level: 72, color: "#B9DDF2", group: "Core" })} className="absolute left-1/2 top-[49%] z-10 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[#B9DDF2]/30 bg-[#122331] text-center shadow-[0_0_40px_rgba(183,214,231,.10)] transition hover:scale-105"><span className="text-xl text-[#D7E8F2]">✳</span><span className="mt-1 text-[9px] font-bold text-[#F3F0E9]">CAREER CORE</span><span className="mt-1 text-[9px] text-[#A9C7D8]">72% readiness</span></button>
                  {filteredSkills.map((skill, index) => <button key={skill.name} onClick={() => setSelectedSkill(skill)} style={{ left: `${16 + index * 13}%`, top: `${index % 2 === 0 ? 19 : 78}%`, borderColor: selectedSkill.name === skill.name ? skill.color : "rgba(155,181,197,.18)", boxShadow: selectedSkill.name === skill.name ? `0 0 22px ${skill.color}20` : "0 8px 24px rgba(0,0,0,.2)" }} className="nx-node absolute z-20 flex min-w-[86px] flex-col items-center rounded-xl border bg-[#101C26]/95 px-2.5 py-2.5 text-center backdrop-blur"><span className="mb-1 h-1.5 w-1.5 rounded-full" style={{ background: skill.color }} /><span className="text-[10px] font-semibold text-[#E7E9E7]">{skill.name}</span><span className="mt-1 text-[10px] text-[#91A2AE]">{skill.level}% mastery</span></button>)}
                </div></Panel>
               <button onClick={addSkillTask} className="nx-button mt-5 w-full rounded-xl bg-[#D7E8F2] px-4 py-3 text-sm font-bold !text-[#101820]">Add practice to today’s focus +</button>
              </div>
            </section>

            <section id="skill-analytics" className="mb-9 scroll-mt-24">
              <SectionHeading eyebrow="Signals, not guesswork" title="Skill analytics" description="A quick snapshot of your current self-assessed strengths." />
              <div className="grid gap-4 lg:grid-cols-2">
                <Panel className="p-5 sm:p-6"><div className="mb-6"><h3 className="font-semibold text-[#F3F0E9]">Mastery profile</h3><p className="mt-1 text-xs text-[#91A2AE]">Baseline estimates · update as you learn</p></div><div className="space-y-5">{skills.slice(0, 5).map((skill) => <div key={skill.name}><div className="mb-2 flex justify-between gap-3 text-sm"><span className="text-[#E7E9E7]">{skill.name}</span><span className="tabular-nums text-[#A5B2BC]">{skill.level}%</span></div><div className="h-2 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full rounded-full" style={{ width: `${skill.level}%`, background: `linear-gradient(90deg,${skill.color}80,${skill.color})` }} /></div></div>)}</div></Panel>
                <Panel className="p-5 sm:p-6"><h3 className="font-semibold text-[#F3F0E9]">Skill radar</h3><p className="mt-1 text-xs text-[#91A2AE]">Visual profile of your learning baseline</p><div className="mx-auto flex max-w-[430px] items-center justify-center"><svg viewBox="0 0 360 300" className="w-full" role="img" aria-label="Skill mastery radar chart"><g transform="translate(180 145)">{[1, .75, .5, .25].map((scale) => <polygon key={scale} points={skills.slice(0, 5).map((_, index) => { const angle = -Math.PI / 2 + index * 2 * Math.PI / 5; return `${Math.cos(angle) * 115 * scale},${Math.sin(angle) * 95 * scale}`; }).join(" ")} fill="none" stroke="rgba(155,181,197,.18)" strokeWidth="1" />)}{skills.slice(0, 5).map((skill, index) => { const angle = -Math.PI / 2 + index * 2 * Math.PI / 5; return <line key={skill.name} x1="0" y1="0" x2={Math.cos(angle) * 115} y2={Math.sin(angle) * 95} stroke="rgba(155,181,197,.2)" />; })}<polygon points={skills.slice(0, 5).map((skill, index) => { const angle = -Math.PI / 2 + index * 2 * Math.PI / 5; return `${Math.cos(angle) * 115 * skill.level / 100},${Math.sin(angle) * 95 * skill.level / 100}`; }).join(" ")} fill="rgba(183,214,231,.13)" stroke="#B9DDF2" strokeWidth="2" />{skills.slice(0, 5).map((skill, index) => { const angle = -Math.PI / 2 + index * 2 * Math.PI / 5; return <circle key={skill.name} cx={Math.cos(angle) * 115 * skill.level / 100} cy={Math.sin(angle) * 95 * skill.level / 100} r="3.5" fill={skill.color} />; })}</g>{skills.slice(0, 5).map((skill, index) => { const angle = -Math.PI / 2 + index * 2 * Math.PI / 5; return <text key={skill.name} x={180 + Math.cos(angle) * 139} y={145 + Math.sin(angle) * 119} textAnchor="middle" dominantBaseline="middle" fill="#A5B2BC" fontSize="10">{skill.name}</text>; })}</svg></div><p className="text-center text-xs text-[#8295A3]">Starting estimates only—not an externally validated score.</p></Panel>
              </div>
            </section>

            <section id="project-lab" className="mb-9 scroll-mt-24">
              <SectionHeading eyebrow="Portfolio workshop" title="Project lab" description="Turn your technical work into a clear, recruiter-ready story." />
              <Panel className="overflow-hidden"><div className="grid lg:grid-cols-[.8fr_1.2fr]"><div className="relative min-h-[250px] overflow-hidden border-b border-[#344451]/60 bg-gradient-to-br from-[#B9DDF2]/[0.09] via-[#101C26] to-[#D5B17A]/[0.07] p-6 lg:border-b-0 lg:border-r"><div className="absolute -right-8 -top-8 h-52 w-52 rounded-full border border-[#B9DDF2]/15" /><div className="absolute right-5 top-5 h-40 w-40 rounded-full border border-[#D5B17A]/15" /><div className="relative"><span className="rounded-full border border-[#B9DDF2]/20 bg-[#B9DDF2]/[0.06] px-3 py-1.5 text-[10px] font-bold tracking-[.15em] text-[#D7E8F2]">FEATURED BUILD</span><h3 className="nx-display mt-6 text-3xl font-semibold text-[#F3F0E9]">FraudShield AI</h3><p className="mt-3 max-w-sm text-sm leading-6 text-[#A5B2BC]">A transaction-fraud classification project focused on suspicious activity, class imbalance, and false alarms.</p><div className="mt-5 flex flex-wrap gap-2">{["Python", "Pandas", "Scikit-learn", "PR-AUC"].map((tag) => <span key={tag} className="rounded-lg border border-[#40515D]/70 bg-black/15 px-2.5 py-1.5 text-[10px] text-[#C7D1D8]">{tag}</span>)}</div></div></div><div className="p-5 sm:p-7"><div className="mb-5 flex items-center justify-between gap-3"><div><h3 className="font-semibold text-[#F3F0E9]">Recruiter-ready checklist</h3><p className="mt-1 text-xs text-[#91A2AE]">Check only when genuinely complete.</p></div><span className="text-sm font-semibold text-[#D7E8F2]">{projectChecks.filter(Boolean).length}/4</span></div><div className="space-y-3">{["Write a clear business problem and dataset summary", "Explain class imbalance and precision-recall trade-offs", "Document baseline, evaluation metrics, and limitations", "Add a clean README with setup steps and results"].map((item, index) => <label key={item} className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#344451]/60 bg-[#0D1720]/65 p-3.5 hover:bg-[#14212B]"><input type="checkbox" checked={projectChecks[index]} onChange={(event) => setProjectChecks((previous) => previous.map((value, itemIndex) => itemIndex === index ? event.target.checked : value))} className="mt-0.5 h-4 w-4 accent-[#B9DDF2]" /><span className={`text-sm leading-5 ${projectChecks[index] ? "text-[#8295A3] line-through" : "text-[#E2E8EC]"}`}>{item}</span></label>)}</div><p className="mt-4 text-xs leading-5 text-[#8295A3]">Report actual model metrics honestly. Accuracy alone can hide poor fraud detection on imbalanced data.</p></div></div></Panel>
            </section>

            <section id="career-explorer" className="mb-9 scroll-mt-24">
              <SectionHeading eyebrow="Opportunity radar" title="Career explorer" description="Connect to your local FastAPI endpoint to load career records." />
              <Panel className="p-5 sm:p-6"><div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><h3 className="font-semibold text-[#F3F0E9]">Explore roles for your next step</h3><p className="mt-1 max-w-xl text-sm leading-6 text-[#91A2AE]">If the API is offline, the sample roles below are clearly labelled.</p></div><button disabled={careerLoading} onClick={loadCareers} className="nx-button shrink-0 rounded-xl border border-[#B9DDF2]/20 bg-[#B9DDF2]/[0.07] px-4 py-3 text-sm font-semibold text-[#D7E8F2] disabled:opacity-50">{careerLoading ? "Connecting…" : "Load career data ↗"}</button></div>{notice && <p className="mt-4 rounded-xl border border-[#344451]/60 bg-[#0D1720]/70 p-3 text-xs leading-5 text-[#A5B2BC]">{notice}</p>}{careerResults.length > 0 && <div className="mt-5 grid gap-3 md:grid-cols-3">{careerResults.map((role, index) => <div key={`${role.title ?? "role"}-${index}`} className="rounded-xl border border-[#344451]/65 bg-[#0D1720]/70 p-4"><span className="text-[10px] font-bold tracking-[.14em] text-[#D5B17A]">ROLE MATCH</span><h4 className="mt-3 font-semibold text-[#F3F0E9]">{role.title ?? role.role ?? "Career opportunity"}</h4><p className="mt-1 text-xs text-[#A5B2BC]">{role.company ?? role.organization ?? "Organization not specified"}</p><p className="mt-3 text-xs text-[#91A2AE]">{role.location ?? "Location not specified"}</p><p className="mt-3 text-xs leading-5 text-[#A5B2BC]">{Array.isArray(role.skills) ? role.skills.join(", ") : role.skills ?? role.description ?? "Review role details in your backend record."}</p></div>)}</div>}</Panel>
            </section>

            <section id="interview-arena" className="mb-9 scroll-mt-24">
              <SectionHeading eyebrow="Practice under pressure" title="Interview arena" description="Practice structuring answers before the real interview." />
              <Panel className="p-5 sm:p-6"><div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]"><div><span className="rounded-full border border-[#D5B17A]/20 bg-[#D5B17A]/[0.06] px-3 py-1.5 text-[10px] font-bold tracking-[.15em] text-[#E4C89F]">QUESTION OF THE SESSION</span><h3 className="nx-display mt-5 text-2xl font-semibold leading-snug text-[#F3F0E9]">{interviewQuestion}</h3><p className="mt-3 text-sm leading-6 text-[#91A2AE]">Explain what the concept means, when to use it, and the business trade-off.</p><button onClick={() => { setInterviewQuestion((question) => question.startsWith("Explain the difference") ? "How would you handle missing values and outliers in a real dataset?" : question.startsWith("How") ? "Explain a project where your first model did not perform well." : "Explain the difference between precision and recall."); setInterviewAnswer(""); }} className="nx-button mt-5 rounded-xl border border-[#40515D]/70 bg-[#14212B] px-4 py-2.5 text-sm text-[#E2E8EC]">Next question ↗</button></div><div><label className="mb-2 block text-xs font-semibold text-[#A5B2BC]">Your answer</label><textarea value={interviewAnswer} onChange={(event) => setInterviewAnswer(event.target.value)} placeholder="Concept → example → trade-off…" rows={7} className="nx-input resize-y leading-6" /><div className="mt-3 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-[#8295A3]">{interviewAnswer.trim().split(/\s+/).filter(Boolean).length} words · local practice</span><button onClick={() => setNotice(interviewAnswer.trim() ? "Answer ready for your self-review. No external AI evaluation is connected." : "Write an answer before saving it for review.")} className="nx-button rounded-xl bg-[#D5B17A] px-4 py-2.5 text-sm font-bold text-[#17130D]">Save for review</button></div></div></div></Panel>
            </section>

           
            <section id="ai-mentor" className="mb-9 scroll-mt-24">
              <SectionHeading
                eyebrow="Your thinking partner"
                title="AI mentor"
                description="Get a practical starting point for your next move."
              />

              <Panel className="relative overflow-hidden p-5 sm:p-6">
                <div className="absolute -right-10 -top-20 h-60 w-60 rounded-full bg-[#B9DDF2]/[0.055] blur-3xl" />

                <div className="relative grid gap-5 lg:grid-cols-[.7fr_1.3fr]">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#B9DDF2]/20 bg-[#B9DDF2]/[0.07] text-xl text-[#D7E8F2]">
                      ✳
                    </div>
                    <h3 className="nx-display mt-4 text-2xl font-semibold text-[#F3F0E9]">
                      Make your next move count.
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#91A2AE]">
                      A lightweight local demo mentor; it is not connected to a live AI model yet.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-[#A5B2BC]">
                      What do you need help with?
                    </label>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        value={mentorPrompt}
                        onChange={(event) => setMentorPrompt(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") askMentor();
                        }}
                        className="nx-input flex-1"
                        placeholder="e.g. Improve my fraud detection project"
                      />
                      <button
                        onClick={askMentor}
                        className="nx-button whitespace-nowrap rounded-xl bg-[#D7E8F2] px-5 py-3 text-sm font-bold !text-[#101820]"
                      >
                        Ask mentor ↗
                      </button>
                    </div>

                    <div className="mt-3 rounded-xl border border-[#B9DDF2]/15 bg-[#B9DDF2]/[0.035] p-4">
                      <Eyebrow>Suggested next step</Eyebrow>
                      <p className="mt-2 text-sm leading-6 text-[#C6D0D7]">
                        {mentorReply}
                      </p>
                    </div>
                  </div>
                </div>
              </Panel>
            </section>


            <footer className="flex flex-col justify-between gap-3 border-t border-[#344451]/60 pt-5 text-xs text-[#8295A3] sm:flex-row sm:items-center"><span>© NEXORA · Personal career & learning workspace</span><span>Local demo · Progress stored in this browser · No live AI claims</span></footer>
          </div>
        </div>
      </div>

      {notice && <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border border-[#40515D]/80 bg-[#101C26] px-4 py-3 text-xs leading-5 text-[#E2E8EC] shadow-2xl">{notice}<button onClick={() => setNotice("")} className="ml-3 text-[#D5B17A]">Dismiss</button></div>}
    </main>
  );
}
