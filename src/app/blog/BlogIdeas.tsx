import React from "react";

const blogPosts = [
  {
    id: 1,
    title: "أفضل أفكار هدايا للنساء في جميع المناسبات",
    excerpt: "دليل شامل لاختيار هدية مميزة تناسب كل امرأة في حياتك...",
    link: "#",
  },
  {
    id: 2,
    title: "كيف تختار باقة ورد مثالية؟",
    excerpt: "نصائح لاختيار باقة الورد المناسبة لكل مناسبة وشخصية...",
    link: "#",
  },
  {
    id: 3,
    title: "هدايا رجالية أنيقة وفاخرة",
    excerpt: "اقتراحات لهدايا رجالية تجمع بين الأناقة والعملية...",
    link: "#",
  },
];

export default function BlogIdeas() {
  return (
    <section className="my-16 w-full max-w-4xl mx-auto" id="blog">
      <h2 className="text-3xl font-bold mb-8 text-center" style={{ background: "linear-gradient(180deg, #D4AF37, #C9A96E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>أفكار الهدايا والمناسبات</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <div key={post.id} className="rounded-xl shadow-lg p-6 flex flex-col items-start transition-transform duration-300 hover:scale-105" style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(74, 155, 160, 0.3)" }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: "#C9A96E" }}>{post.title}</h3>
            <p className="mb-4" style={{ color: "#8B9A9A" }}>{post.excerpt}</p>
            <a href={post.link} className="font-medium hover:underline" style={{ color: "#4A9BA0" }}>اقرأ المزيد</a>
          </div>
        ))}
      </div>
    </section>
  );
}
