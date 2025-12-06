import { useMemo } from 'react';
import { Container, Title, Button, Group, Paper, Badge, Text } from '@mantine/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IconPlus, IconEye } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { api } from '../api/client';
import { Flow } from '../types';

export default function FlowsPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

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
        mutationFn: () => api.post('/flows', { status: 'draft' }), // Create empty draft flow
        onSuccess: (newFlow) => {
            queryClient.invalidateQueries({ queryKey: ['flows'] });
            navigate(`/flows/${newFlow.data.id}`);
        },
    });

    const columns = useMemo<MRT_ColumnDef<Flow>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                Cell: ({ cell }) => cell.getValue<string>() || <em>Untitled Flow</em>,
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
        <Container fluid p="md">
            <Group justify="space-between" mb="lg">
                <Title order={2}>Flow Records</Title>
                <Button
                    leftSection={<IconPlus size={16} />}
                    onClick={() => createMutation.mutate()}
                    loading={createMutation.isPending}
                >
                    Create Flow
                </Button>
            </Group>

            <Paper withBorder p="md">
                <MantineReactTable table={table} />
            </Paper>
        </Container>
    );
}
