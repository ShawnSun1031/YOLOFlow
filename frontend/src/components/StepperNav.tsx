import { Stepper, Stack, UnstyledButton, rem } from '@mantine/core';
import { IconDatabase, IconCpu, IconDeviceFloppy, Icon } from '@tabler/icons-react';

interface StepperNavProps {
    active: number;
    setActive: (step: number) => void;
    collapsed: boolean;
}

const steps = [
    { icon: IconDatabase, label: 'Dataset', description: 'Manage Data' },
    { icon: IconCpu, label: 'Training', description: 'Train Model' },
    { icon: IconDeviceFloppy, label: 'Management', description: 'Manage Models' },
];

export function StepperNav({ active, setActive, collapsed }: StepperNavProps) {
    // If collapsed, we show custom icon-only UI mimicking stepper state
    // If expanded, we show full Mantine Stepper vertical

    return (
        <Stack gap="md" py="md">
            {!collapsed ? (
                <Stepper active={active} onStepClick={setActive} orientation="vertical" size="sm">
                    {steps.map((step, index) => (
                        <Stepper.Step
                            key={index}
                            label={step.label}
                            description={step.description}
                            icon={<step.icon style={{ width: rem(18), height: rem(18) }} />}
                        />
                    ))}
                </Stepper>
            ) : (
                <Stack align="center" gap="lg">
                    {steps.map((step, index) => {
                        const StepIcon = step.icon as Icon;
                        const isActive = index === active;
                        const isCompleted = index < active;
                        const color = isActive ? 'blue' : isCompleted ? 'blue' : 'gray';

                        return (
                            <UnstyledButton
                                key={index}
                                onClick={() => setActive(index)}
                                style={{
                                    color: 'var(--mantine-color-text)',
                                    opacity: isActive || isCompleted ? 1 : 0.5
                                }}
                            >
                                <StepIcon style={{ width: rem(24), height: rem(24), color: `var(--mantine-color-${color}-6)` }} />
                            </UnstyledButton>
                        );
                    })}
                </Stack>
            )}
        </Stack>
    );
}
