'use client';
import React, { useState } from "react";

const blogPosts = [
  {
    id: 1,
    title: "أفضل أفكار هدايا للنساء في جميع المناسبات",
    excerpt: "دليل شامل لاختيار هدية مميزة تناسب كل امرأة في حياتك...",
    full: "اختيار الهدية المثالية للمرأة ليس أمراً صعباً إذا عرفت ذوقها. للأم المحبة: طقم برائحها المفضلة أو علبة شوكولاتة فاخرة. للصديقة: باقة ورد بألوانها المفضلة مع بطاقة مخصصة. لزوجتك: مجوهرات رقيقة أو حقيبة جلدية فاخرة. لزميلتك: بوكس شوكولاتة تحف يدوية من جنان فلو. تذكر دائماً أن الهدية التي تخرج من القلب هي التي تبقى في الذاكرة.",
  },
  {
    id: 2,
    title: "كيف تختار باقة ورد مثالية؟",
    excerpt: "نصائح لاختيار باقة الورد المناسبة لكل مناسبة وشخصية...",
    full: "كل لون له معنى: الورد الأحمر للحب والشغف. الورد الأبيض للنقاء والتقدير. الورد الوردي للبهجة والأنوثة. زهرة السنفر للسعادة والطاقة. عند اختيار باقتك: اختري أزهاراً طازجة بالحياة، وتأكدي من تناسق الألوان مع بعضها، وأضيفي لمسة شخصية بورقة خط يدوي. جنان فلو تضمن لك باقات طازجة تدوم أكثر من أسبوعين.",
  },
  {
    id: 3,
    title: "هدايا رجالية أنيقة وفاخرة",
    excerpt: "اقتراحات لهدايا رجالية تجمع بين الأناقة والعملية...",
    full: "اختيار هدية للرجل يتطلب فهم شخصيته. لرجل الأعمال: أكسسوار جلدية فاخرة أو ساعة كلاسيكية. للرجل الرياضي: كابسول عطر خشبي فاخر. للمدير المكتبي: طقم قهوة فاخر مع اسمه منقوشاً. للمحب التقني: ملحقات بريميوم. في جنان فلو ستجد كل هذه الخيارات بتغليف فاخر وتوصيل سريع.",
  },
];

export default function BlogIdeas() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <section className="my-16 w-full max-w-4xl mx-auto" id="blog">
      <h2 className="text-3xl font-bold mb-8 text-center" style={{ background: "linear-gradient(180deg, #D4AF37, #C9A96E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>أفكار الهدايا والمناسبات</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogPosts.map((post) => {
          const isExpanded = expandedId === post.id;
          return (
            <div key={post.id} className="rounded-xl shadow-lg p-6 flex flex-col items-start transition-all duration-300" style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: isExpanded ? "1px solid rgba(201, 169, 110, 0.5)" : "1px solid rgba(74, 155, 160, 0.3)" }}>
              <h3 className="text-xl font-bold mb-2" style={{ color: "#C9A96E" }}>{post.title}</h3>
              <p className="mb-3" style={{ color: "#8B9A9A" }}>
                {isExpanded ? post.full : post.excerpt}
              </p>
              {isExpanded && (
                <div className="w-full h-px my-2 mb-3" style={{ background: "rgba(201, 169, 110, 0.2)" }} />
              )}
              <button
                onClick={() => setExpandedId(isExpanded ? null : post.id)}
                className="font-medium transition-all duration-200 hover:underline mt-auto"
                style={{ color: "#4A9BA0" }}
              >
                {isExpanded ? "∧ أغلق" : "اقرأ المزيد ↓"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
