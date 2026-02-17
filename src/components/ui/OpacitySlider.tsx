interface OpacitySliderProps {
  opacity: number;
  onChange: (opacity: number) => void;
  label?: string;
}

export const OpacitySlider = ({
  opacity,
  onChange,
  label = "투명도",
}: OpacitySliderProps) => {
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value);
    onChange(value);
  };

  const percentage = Math.round(opacity * 100);

  return (
    <div
      className="absolute top-20 left-4 flex flex-col gap-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 px-3 py-2 select-none min-w-50 z-10"
      onMouseDown={stop}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-700">{label}</span>
        <span className="text-xs font-mono text-gray-600 min-w-[3ch] text-right">
          {percentage}%
        </span>
      </div>
      <input
        type="range"
        aria-label="투명도 조절"
        min="0"
        max="1"
        step="0.01"
        value={opacity}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};
