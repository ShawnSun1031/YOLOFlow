import { AppShell, Burger, Group, Title, ActionIcon, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from '@tabler/icons-react';
import { StepperNav } from './StepperNav';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export function Layout() {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

    const location = useLocation();
    const navigate = useNavigate();

    // Check if we are in a flow context: /flows/:id/...
    // But NOT /flows (list) or /flows/new
    const match = location.pathname.match(/\/flows\/([^/]+)/);
    const currentFlowId = match ? match[1] : null;
    const isFlowContext = !!currentFlowId && currentFlowId !== 'new';

    // Determine active step based on path
    const getActiveStep = () => {
        if (location.pathname.includes('/dataset')) return 0;
        if (location.pathname.includes('/training')) return 1;
        if (location.pathname.includes('/models')) return 2;
        return 0;
    };

    const activeStep = getActiveStep();

    const handleStepChange = (nextStep: number) => {
        if (!currentFlowId) return;
        if (nextStep === 0) navigate(`/flows/${currentFlowId}/dataset`);
        if (nextStep === 1) navigate(`/flows/${currentFlowId}/training`);
        if (nextStep === 2) navigate(`/flows/${currentFlowId}/models`);
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
                        <Burger
                            opened={mobileOpened}
                            onClick={toggleMobile}
                            hiddenFrom="sm"
                            size="sm"
                        />
                        <Title
                            order={3}
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate('/')}
                        >
                            YOLOFlow
                        </Title>
                    </Group>
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={toggleDesktop}
                        visibleFrom="sm"
                    >
                        {desktopOpened ? (
                            <IconLayoutSidebarLeftCollapse style={{ width: rem(22) }} />
                        ) : (
                            <IconLayoutSidebarLeftExpand style={{ width: rem(22) }} />
                        )}
                    </ActionIcon>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                {isFlowContext ? (
                    <StepperNav
                        active={activeStep}
                        setActive={handleStepChange}
                        collapsed={!desktopOpened}
                    />
                ) : (
                    <Group p="md">
                        {/* Placeholder for Main Menu if needed, or just show Flows */}
                        <Title order={5}>Menu</Title>
                    </Group>
                )}
            </AppShell.Navbar>

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}
