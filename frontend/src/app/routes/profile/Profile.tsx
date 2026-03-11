import { Button } from "@/components/ui/button";
import ProfileStep1 from "@/features/profile/components/ProfileStep1";
import ProfileStep2 from "@/features/profile/components/ProfileStep2";
import ProfileStep3 from "@/features/profile/components/ProfileStep3";
import ProfileStep4 from "@/features/profile/components/ProfileStep4";
import ProfileStep5 from "@/features/profile/components/ProfileStep5";
import SuccessView from "@/features/profile/components/SuccessView";
import ProfileStepBar from "@/features/profile/components/ProfileStepBar";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { ProfileLayout } from "@/features/profile/layout/ProfileLayout";
import React from "react";
import { FormProvider, useWatch } from "react-hook-form";

export default function Profile() {
  const { methods, onSubmit, isSuccess } = useProfile();
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const [step, setStep] = React.useState(1);

  const formValues = useWatch({
    control,
  });

  if (isSuccess) {
    return (
      <ProfileLayout>
        <SuccessView />
      </ProfileLayout>
    );
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return !!formValues.seniorityId && formValues.seniorityId > 0;
      case 2:
        return !!formValues.specialtyId && formValues.specialtyId > 0;
      case 3:
        return (
          !!formValues.careerObjectiveId && formValues.careerObjectiveId > 0
        );
      case 4:
        return !!formValues.ageRangeId && formValues.ageRangeId > 0;
      case 5:
        return !!formValues.stacksId && formValues.stacksId.length > 0;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (step < 5 && isStepValid()) {
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
          {step === 3 && <ProfileStep3 />}
          {step === 4 && <ProfileStep4 />}
          {step === 5 && <ProfileStep5 />}

          <div className="w-full flex justify-between">
            <Button
              variant="outline"
              className="mt-12"
              type="button"
              style={{ visibility: step === 1 ? "hidden" : "visible" }}
              onClick={handlePreviousStep}
            >
              Voltar
            </Button>

            <Button
              className="mt-12"
              type={step === 5 ? "submit" : "button"}
              disabled={isSubmitting || !isStepValid()}
              onClick={step === 5 ? undefined : handleNextStep}
            >
              {step === 5 ? "Finalizar" : "Próximo"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </ProfileLayout>
  );
}
