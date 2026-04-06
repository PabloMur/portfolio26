import { useState, useRef, useEffect } from "react";
import { sendGroqMessage, type ProjectSummary } from "../services/groq";
import { fetchProjects } from "../services/airtable";
import {
  AiOutlineMessage,
  AiOutlineClose,
  AiOutlineSend,
} from "react-icons/ai";
import { useLanguage } from "../context/LanguageContext";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const INITIAL_MESSAGES = {
  en: "Hi! I'm Pablo's assistant. I can give you a quick summary of his profile, walk you through his projects, or explain his technical strengths. What would you like to explore?",
  es: "¡Hola! Soy el asistente de Pablo. Puedo darte un resumen de su perfil, mostrarte sus proyectos o explicar sus habilidades técnicas. ¿Qué te gustaría explorar?",
};

const UI_TEXT = {
  en: { header: "Pablo's Assistant", subheader: "Ask about his profile", placeholder: "Ask something..." },
  es: { header: "Asistente de Pablo", subheader: "Preguntá sobre su perfil", placeholder: "Escribe algo..." },
};

function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>
      : part
  );
}

function FormattedMessage({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushList = () => {
    if (listItems.length === 0) return;
    if (listType === "ol") {
      elements.push(
        <ol key={elements.length} className="list-decimal list-inside space-y-0.5 pl-1">
          {listItems}
        </ol>
      );
    } else {
      elements.push(
        <ul key={elements.length} className="list-disc list-inside space-y-0.5 pl-1">
          {listItems}
        </ul>
      );
    }
    listItems = [];
    listType = null;
  };

  lines.forEach((line, i) => {
    const bullet = line.match(/^[-*] (.+)/);
    const numbered = line.match(/^\d+\. (.+)/);

    if (bullet) {
      if (listType !== "ul") flushList();
      listType = "ul";
      listItems.push(<li key={i}>{renderInline(bullet[1])}</li>);
    } else if (numbered) {
      if (listType !== "ol") flushList();
      listType = "ol";
      listItems.push(<li key={i}>{renderInline(numbered[1])}</li>);
    } else {
      flushList();
      if (line.trim() === "") {
        elements.push(<div key={i} className="h-1.5" />);
      } else {
        elements.push(<p key={i}>{renderInline(line)}</p>);
      }
    }
  });

  flushList();

  return <div className="space-y-1.5 text-sm leading-relaxed">{elements}</div>;
}

export default function ChatWidget() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: INITIAL_MESSAGES[lang] },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProjects()
      .then((data) =>
        setProjects(
          data.map((p) => ({
            title: p.title,
            description: p.description,
            githubUrl: p.githubUrl,
            deployUrl: p.deployUrl,
          }))
        )
      )
      .catch(() => {});
  }, []);

  useEffect(() => {
    setMessages([{ role: "assistant", content: INITIAL_MESSAGES[lang] }]);
  }, [lang]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendGroqMessage([...messages, userMsg], lang, projects);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-96 h-[500px] bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_6px_2px_rgba(167,139,250,0.45)]" />
              <div>
                <p className="text-sm font-semibold text-white">{UI_TEXT[lang].header}</p>
                <p className="text-xs text-gray-500">{UI_TEXT[lang].subheader}</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-600 hover:text-gray-300 transition-colors"
            >
              <AiOutlineClose size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto chat-scroll p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-3 py-2 ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-sm text-sm leading-relaxed"
                      : "bg-gray-900 text-gray-300 rounded-bl-sm border border-gray-800"
                  }`}
                >
                  {msg.role === "user" ? msg.content : <FormattedMessage content={msg.content} />}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl rounded-bl-sm px-4 py-3">
                  <span className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={UI_TEXT[lang].placeholder}
              className="flex-1 text-sm bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 outline-none text-gray-200 placeholder:text-gray-600 focus:border-violet-500 transition-colors"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-40 transition-colors"
            >
              <AiOutlineSend size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <div className="chat-spin-wrapper shadow-lg shadow-violet-500/30">
        <div className="chat-spin-gradient" />
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="relative z-10 w-13 h-13 bg-amber-50 text-gray-800 rounded-full hover:bg-amber-100 transition-colors flex items-center justify-center cursor-pointer p-3"
        >
          {open ? <AiOutlineClose size={22} /> : <AiOutlineMessage size={22} />}
        </button>
      </div>
    </div>
  );
}
