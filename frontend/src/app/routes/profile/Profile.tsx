import { Button } from "@/components/ui/button";
import ProfileStep1 from "@/features/profile/components/ProfileStep1";
import ProfileStep2 from "@/features/profile/components/ProfileStep2";
import ProfileStep3 from "@/features/profile/components/ProfileStep3";
import ProfileStep4 from "@/features/profile/components/ProfileStep4";
import ProfileStep5 from "@/features/profile/components/ProfileStep5";
import SuccessScreen from "@/features/profile/components/SuccessScreen";
import ProfileStepBar from "@/features/profile/components/ProfileStepBar";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { ProfileLayout } from "@/features/profile/layout/ProfileLayout";
import React from "react";
import { FormProvider, useWatch } from "react-hook-form";
import { useOnboardingOptions } from "@/features/profile/hooks/useOnboardingOptions";
import { ProfileLoading } from "@/features/profile/components/ProfileLoading";
import { toast } from "sonner";

export default function Profile() {
  const { data, isLoading } = useOnboardingOptions();
  const { form, mutation } = useProfile();
  const { handleSubmit, control } = form;
  const [step, setStep] = React.useState(1);
  const formValues = useWatch({
    control,
  });

  if (isLoading) {
    return (
      <ProfileLayout>
        <ProfileLoading />
      </ProfileLayout>
    );
  }

  if (mutation.isSuccess) {
    return (
      <ProfileLayout>
        <SuccessScreen />
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

      <FormProvider {...form}>
        <form
          className="flex flex-col gap-4 mb-8 w-full"
          onSubmit={handleSubmit(
            (data) => mutation.mutate(data),
            (errors) => {
              const firstError = Object.values(errors)[0];
              firstError?.message
                ? toast.error(firstError.message as string)
                : toast.error("Por favor, verifique os campos do formulário.");
            },
          )}
        >
          {step === 1 && <ProfileStep1 seniorities={data?.seniorities} />}
          {step === 2 && <ProfileStep2 specialties={data?.specialties} />}
          {step === 3 && (
            <ProfileStep3 careerObjectives={data?.careerObjectives} />
          )}
          {step === 4 && <ProfileStep4 ageRanges={data?.ageRanges} />}
          {step === 5 && <ProfileStep5 stacks={data?.stacks} />}

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
              disabled={mutation.isPending || !isStepValid()}
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
