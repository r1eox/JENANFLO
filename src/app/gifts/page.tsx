'use client';
import CategoryPageTemplate from "../_components/CategoryPageTemplate";

export default function GiftsPage() {
  return (
    <CategoryPageTemplate
      categoryKey="gifts"
      title="هداياك"
      emoji="✨"
      subtitle="هدايا استثنائية تُحاكي القلوب وتصنع الذكريات"
      activeLink="gifts"
    />
  );
}
