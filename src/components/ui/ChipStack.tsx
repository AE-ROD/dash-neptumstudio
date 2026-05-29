export function ChipStack({ tecnologias }: { tecnologias: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {tecnologias.map((tech, i) => (
        <span
          key={`${tech}-${i}`}
          className="bg-[#F0F0EE] text-[#555] text-[9px] font-bold px-2 py-0.5 rounded-full"
        >
          {tech}
        </span>
      ))}
    </div>
  )
}
