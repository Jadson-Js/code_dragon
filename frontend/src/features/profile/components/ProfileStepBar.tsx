interface Props {
  className?: string;
  currentStep: number;
}

export default function ProfileStepBar({ className, currentStep }: Props) {
  return (
    <div className={`flex flex-col items-end gap-2 w-full ${className}`}>
      <span className="text-white-2">Etapa {currentStep} de 5</span>

      <div className="w-full h-2 bg-bg-3 rounded-full">
        <div
          className="h-full bg-primary-1 rounded-full transition-all duration-300 "
          style={{ width: `${(currentStep / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}
