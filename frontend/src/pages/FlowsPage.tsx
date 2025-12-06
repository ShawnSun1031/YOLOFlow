import { useMemo, useState } from 'react';
import {
    Container,
    Title,
    Button,
    Group,
    Paper,
    Badge,
    Text,
    Modal,
    TextInput,
    Textarea,
    Stack,
} from '@mantine/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IconPlus, IconEye } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { useDisclosure } from '@mantine/hooks';
import { api } from '../api/client';
import { Flow } from '../types';

export default function FlowsPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [opened, { open, close }] = useDisclosure(false);
    const [formState, setFormState] = useState({ name: '', description: '' });

    const {
        data: flows,
        isLoading,
        isError,
    } = useQuery<Flow[]>({
        queryKey: ['flows'],
        queryFn: async () => {
            const res = await api.get('/flows');
            return res.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: (data: { name: string; description: string; status: string }) =>
            api.post('/flows', data),
        onSuccess: (newFlow) => {
            queryClient.invalidateQueries({ queryKey: ['flows'] });
            close();
            navigate(`/flows/${newFlow.data.id}`);
        },
    });

    const handleCreate = () => {
        createMutation.mutate({
            name: formState.name,
            description: formState.description,
            status: 'draft',
        });
    };

    const columns = useMemo<MRT_ColumnDef<Flow>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                Cell: ({ cell }) => cell.getValue<string>() || <em>Untitled Flow</em>,
            },
            {
                accessorKey: 'description',
                header: 'Description',
                Cell: ({ cell }) => (
                    <Text size="sm" c="dimmed" lineClamp={1}>
                        {cell.getValue<string>() || '-'}
                    </Text>
                ),
            },
            {
                accessorKey: 'id',
                header: 'UUID',
                Cell: ({ cell }) => (
                    <Text size="xs" c="dimmed">
                        {cell.getValue<string>()}
                    </Text>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                Cell: ({ cell }) => {
                    const status = cell.getValue<string>();
                    return (
                        <Badge
                            color={
                                status === 'completed'
                                    ? 'green'
                                    : status === 'active'
                                      ? 'blue'
                                      : 'gray'
                            }
                        >
                            {status}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'created_at',
                header: 'Created At',
                Cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleDateString(),
            },
        ],
        [],
    );

    const table = useMantineReactTable({
        columns,
        data: flows || [],
        enableRowActions: true,
        renderRowActions: ({ row }) => (
            <Button
                variant="light"
                size="xs"
                rightSection={<IconEye size={14} />}
                onClick={() => navigate(`/flows/${row.original.id}`)}
            >
                View
            </Button>
        ),
        state: {
            isLoading,
            showAlertBanner: isError,
            showProgressBars: isLoading,
        },
    });

    return (
        <Container size="xl" py="xl">
            <Group justify="space-between" mb="lg">
                <Title order={2}>Flow Records</Title>
                <Button leftSection={<IconPlus size={16} />} onClick={open}>
                    Create Flow
                </Button>
            </Group>

            <Paper withBorder p="md">
                <MantineReactTable table={table} />
            </Paper>

            <Modal opened={opened} onClose={close} title="Create New Flow">
                <Stack>
                    <TextInput
                        label="Flow Name"
                        placeholder="e.g. Traffic Sign Detection"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    />
                    <Textarea
                        label="Description"
                        placeholder="Detailed description of the flow..."
                        minRows={3}
                        value={formState.description}
                        onChange={(e) =>
                            setFormState({ ...formState, description: e.target.value })
                        }
                    />
                    <Group justify="flex-end" mt="md">
                        <Button variant="default" onClick={close}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreate}
                            loading={createMutation.isPending}
                            disabled={!formState.name}
                        >
                            Create
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Container>
    );
}
