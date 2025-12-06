import {
    AppShell,
    Burger,
    Group,
    Title,
    ActionIcon,
    rem,
    useMantineColorScheme,
    useComputedColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    IconLayoutSidebarLeftCollapse,
    IconLayoutSidebarLeftExpand,
    IconSun,
    IconMoonStars,
    IconHome2,
} from '@tabler/icons-react';
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

    // Theme toggle
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const { setColorScheme } = useMantineColorScheme();

    const toggleColorScheme = () => {
        setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
    };

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
                collapsed: { mobile: !mobileOpened, desktop: !isFlowContext },
            }}
            padding="md"
            style={{
                '--app-shell-header-offset': '60px',
            }}
        >
            <AppShell.Header
                style={{
                    backdropFilter: 'blur(10px)',
                    backgroundColor:
                        computedColorScheme === 'dark'
                            ? 'rgba(26, 27, 30, 0.7)'
                            : 'rgba(255, 255, 255, 0.7)',
                    borderBottom: '1px solid var(--mantine-color-default-border)',
                }}
            >
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
                            style={{
                                cursor: 'pointer',
                                background: 'linear-gradient(45deg, #4c6ef5, #15aabf)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 900,
                            }}
                            onClick={() => navigate('/')}
                        >
                            YOLOFlow
                        </Title>
                    </Group>
                    <Group>
                        <ActionIcon
                            onClick={() => navigate('/')}
                            variant="default"
                            size="lg"
                            aria-label="Toggle color scheme"
                        >
                            <IconHome2 style={{ width: rem(18), height: rem(18) }} />
                        </ActionIcon>
                        <ActionIcon
                            onClick={toggleColorScheme}
                            variant="default"
                            size="lg"
                            aria-label="Toggle color scheme"
                        >
                            {computedColorScheme === 'dark' ? (
                                <IconSun style={{ width: rem(18), height: rem(18) }} />
                            ) : (
                                <IconMoonStars style={{ width: rem(18), height: rem(18) }} />
                            )}
                        </ActionIcon>
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={toggleDesktop}
                            visibleFrom="sm"
                            size="lg"
                        >
                            {desktopOpened ? (
                                <IconLayoutSidebarLeftCollapse style={{ width: rem(22) }} />
                            ) : (
                                <IconLayoutSidebarLeftExpand style={{ width: rem(22) }} />
                            )}
                        </ActionIcon>
                    </Group>
                </Group>
            </AppShell.Header>

            {isFlowContext ? (
                <AppShell.Navbar
                    p="md"
                    style={{
                        backgroundColor:
                            computedColorScheme === 'dark'
                                ? 'rgba(26, 27, 30, 0.5)'
                                : 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(10px)',
                        borderRight: '1px solid var(--mantine-color-default-border)',
                    }}
                >
                    <StepperNav
                        active={activeStep}
                        setActive={handleStepChange}
                        collapsed={!desktopOpened}
                    />
                </AppShell.Navbar>
            ) : null}

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}
