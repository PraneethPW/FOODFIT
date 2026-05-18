import { FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Bot, Send, User } from "lucide-react";
import { api } from "../lib/api";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";

type Message = { role: "user" | "assistant"; content: string };

export const AssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Ask me what to eat, how to train, or how to adapt meals for a health condition." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get("/ai/chat/history").then(({ data }) => data.messages?.length && setMessages(data.messages)).catch(() => null);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", content: input };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const { data } = await api.post("/ai/chat", { message: userMessage.content });
      setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Assistant unavailable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <PageHeader eyebrow="AI assistant" title="Your fitness coach, always in context" subtitle="Ask for diabetic dinners, belly-fat workouts, Hyderabad protein foods, or meal swaps." />
      <Card className="flex h-[68vh] flex-col p-0">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.map((message, index) => (
            <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mint/20 text-mint"><Bot size={18} /></span>}
              <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-ink text-white dark:bg-white dark:text-ink" : "bg-black/5 dark:bg-white/10"}`}>{message.content}</div>
              {message.role === "user" && <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-coral/20 text-coral"><User size={18} /></span>}
            </div>
          ))}
          {loading && <div className="rounded-2xl bg-black/5 px-4 py-3 text-sm font-semibold dark:bg-white/10">FOODFIT is thinking...</div>}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={send} className="flex gap-3 border-t border-black/10 p-4 dark:border-white/10">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask: Best protein food in Hyderabad?" className="flex-1 rounded-xl border border-black/10 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/10" />
          <Button disabled={loading}><Send size={18} /></Button>
        </form>
      </Card>
    </div>
  );
};
