export function KathaGlyph({ size = 40, color = "#ECE7DB" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 88V12h15v34l33-34h18L50 48l38 40H70L42 56l-7 7v25z" fill={color}/>
    </svg>
  );
}
