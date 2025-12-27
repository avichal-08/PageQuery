"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function ChatBox() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [loading, setLoading] = useState(false);

    async function send() {
        if (!input.trim()) return;

        const userMessage = input;
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setLoading(true);

        setMessages((prev) => [...prev, { role: "ai", content: "" }]);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: userMessage }),
            });

            if (!res.body) throw new Error("No response body");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;

                const chunkValue = decoder.decode(value, { stream: true });

                setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastMsgIndex = newMessages.length - 1;

                    newMessages[lastMsgIndex] = {
                        ...newMessages[lastMsgIndex],
                        content: newMessages[lastMsgIndex].content + chunkValue
                    };

                    return newMessages;
                });
            }

        } catch (err) {
            console.error(err);
            setMessages((prev) => [
                ...prev.slice(0, -1),
                { role: "ai", content: "Error: Failed to stream response." }
            ]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-4">
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                            className={`rounded-xl px-5 py-3 max-w-[85%] text-sm leading-relaxed shadow-sm ${msg.role === "user"
                                    ? "bg-green-600/20 text-green-100 border border-green-500/30"
                                    : "bg-white/5 text-gray-200 border border-white/10"
                                }`}
                        >
                            {msg.role === "ai" ? (
                                <div className="markdown-content">
                                    <ReactMarkdown
                                        components={{
                                            strong: ({ node, ...props }) => <span className="font-bold text-green-400" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc list-inside ml-2 space-y-1" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal list-inside ml-2 space-y-1" {...props} />,
                                            h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-green-300 mt-2 mb-1" {...props} />,
                                            h2: ({ node, ...props }) => <h2 className="text-md font-semibold text-green-300 mt-2 mb-1" {...props} />,
                                            a: ({ node, ...props }) => <a className="text-blue-400 hover:underline" target="_blank" {...props} />,
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                msg.content
                            )}
                        </div>
                    </div>
                ))}
                {loading && messages[messages.length - 1].content === "" && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm ml-2 animate-pulse">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        Thinking...
                    </div>
                )}
            </div>

            <div className="flex gap-3 pt-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                    placeholder="Ask a question..."
                    className="flex-1 rounded-lg bg-black/40 px-4 py-3 text-gray-200 placeholder-gray-600 border border-white/10 focus:outline-none focus:border-green-500/50 transition-all"
                />
                <button
                    onClick={send}
                    disabled={loading || !input.trim()}
                    className="rounded-lg bg-green-600 px-6 py-2 font-medium text-black hover:bg-green-500 disabled:opacity-50 transition-all"
                >
                    Send
                </button>
            </div>
        </div>
    );
}