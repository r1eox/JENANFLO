'use client';
import CategoryPageTemplate from "../_components/CategoryPageTemplate";

export default function WomenPage() {
  return (
    <CategoryPageTemplate
      categoryKey="women"
      title="أنوثتك"
      emoji="🦋"
      subtitle="تفاصيل ناعمة تُزهر أنوثتك وتُعطّر أيامك"
      activeLink="women"
    />
  );
}
