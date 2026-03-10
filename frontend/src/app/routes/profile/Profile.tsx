import { Button } from "@/components/ui/button";
import ProfileStep1 from "@/features/profile/components/ProfileStep1";
import ProfileStep2 from "@/features/profile/components/ProfileStep2";
import ProfileStepBar from "@/features/profile/components/ProfileStepBar";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { ProfileLayout } from "@/features/profile/layout/ProfileLayout";
import React from "react";
import { FormProvider } from "react-hook-form";

export default function Profile() {
  const { methods, onSubmit } = useProfile();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const [step, setStep] = React.useState(1);

  const handleNextStep = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <ProfileLayout>
      <ProfileStepBar className="mb-8" currentStep={step} />

      <FormProvider {...methods}>
        <form
          className="flex flex-col gap-4 mb-8 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          {step === 1 && <ProfileStep1 />}
          {step === 2 && <ProfileStep2 />}

          <div className="w-full flex justify-between">
            <Button
              variant="outline"
              className="text-left mt-12"
              type="button"
              style={{ visibility: step === 1 ? "hidden" : "visible" }}
              onClick={handlePreviousStep}
            >
              Voltar
            </Button>

            <Button
              className="text-left mt-12"
              type={step === 5 ? "submit" : "button"}
              disabled={isSubmitting}
              onClick={step === 5 ? undefined : handleNextStep}
              style={{ visibility: step === 5 ? "hidden" : "visible" }}
            >
              {step === 5 ? "Finalizar" : "Próximo"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </ProfileLayout>
  );
}
