import { TemplateCard } from "./TemplateCard";

export function MasonryGrid({ templates }: { templates: any[] }) {
  const validTemplates = templates.filter(t => !t.isFootnote);

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 pb-24">
      {validTemplates.map((template, i) => (
        <TemplateCard key={template.id || i} template={template} index={i} />
      ))}
    </div>
  );
}
