import { useState } from 'react';
import { AppShell, Burger, Group, Title, ActionIcon, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from '@tabler/icons-react';
import { StepperNav } from './StepperNav';
import { Outlet, useNavigate } from 'react-router-dom';

export function Layout() {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

    const [activeStep, setActiveStep] = useState(0);
    const navigate = useNavigate();

    const handleStepChange = (nextStep: number) => {
        setActiveStep(nextStep);
        if (nextStep === 0) navigate('/dataset');
        if (nextStep === 1) navigate('/training');
        if (nextStep === 2) navigate('/models');
    };

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: desktopOpened ? 300 : 80,
                breakpoint: 'sm',
                collapsed: { mobile: !mobileOpened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                        <Title order={3}>YOLOFlow</Title>
                    </Group>
                    <ActionIcon variant="subtle" color="gray" onClick={toggleDesktop} visibleFrom="sm">
                        {desktopOpened ? <IconLayoutSidebarLeftCollapse style={{ width: rem(22) }} /> : <IconLayoutSidebarLeftExpand style={{ width: rem(22) }} />}
                    </ActionIcon>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <StepperNav
                    active={activeStep}
                    setActive={handleStepChange}
                    collapsed={!desktopOpened}
                />
            </AppShell.Navbar>

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}
