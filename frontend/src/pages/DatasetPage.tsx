import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Title,
    Paper,
    Group,
    Button,
    TextInput,
    Select,
    Textarea,
    Modal,
    ActionIcon,
    Badge,
    Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IconEye, IconArrowLeft, IconPlus } from '@tabler/icons-react';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { api } from '../api/client';
import { Dataset } from '../types';
import { DatasetImagesView } from './DatasetImagesView'; // Extracting this component

interface DatasetForm {
    name: string;
    path: string;
    type: string;
    description: string;
}

export default function DatasetPage() {
    const { flowId } = useParams<{ flowId: string }>();
    const navigate = useNavigate();

    const [opened, { open, close }] = useDisclosure(false); // Modal for upload
    const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null); // Selecting for Next step
    const [previewDatasetId, setPreviewDatasetId] = useState<string | null>(null); // Full page preview

    // Filter & Pagination State - MRT handles this now
    // const [search, setSearch] = useState('');
    // const [page, setPage] = useState(1);
    // const pageSize = 10;

    const [formState, setFormState] = useState<DatasetForm>({
        name: '',
        path: '',
        type: 'yolo',
        description: '',
    });

    const queryClient = useQueryClient();

    // Query Datasets
    const {
        data: datasets,
        isLoading,
        isError,
    } = useQuery<Dataset[]>({
        queryKey: ['datasets'],
        queryFn: async () => {
            const res = await api.get('/stepper/datasets');
            return res.data;
        },
    });

    // Create Dataset Mutation
    const createMutation = useMutation({
        mutationFn: (newDataset: DatasetForm) => api.post('/stepper/datasets', newDataset),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['datasets'] });
            close();
        },
    });

    // Update Flow Mutation (to link dataset)
    const updateFlowMutation = useMutation({
        mutationFn: (datasetId: string) => api.patch(`/flows/${flowId}`, { dataset_id: datasetId }),
        onSuccess: () => {
            navigate(`/flows/${flowId}/training`);
        },
    });

    const handleSubmit = () => {
        createMutation.mutate(formState);
        setFormState({ name: '', path: '', type: 'yolo', description: '' }); // Reset
    };

    const handleNext = () => {
        if (selectedDatasetId) {
            updateFlowMutation.mutate(selectedDatasetId);
        }
    };

    const columns = useMemo<MRT_ColumnDef<Dataset>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
            },
            {
                accessorKey: 'type',
                header: 'Type',
                Cell: ({ cell }) => <Badge>{cell.getValue<string>()}</Badge>,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                Cell: ({ cell }) => {
                    const status = cell.getValue<string>();
                    return (
                        <Badge color={status === 'active' ? 'green' : 'gray'} variant="dot">
                            {status}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'description',
                header: 'Description',
                Cell: ({ cell }) => (
                    <div
                        style={{
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {cell.getValue<string>()}
                    </div>
                ),
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
        data: datasets || [],
        enableRowActions: true,
        renderRowActions: ({ row }) => (
            <ActionIcon
                variant="light"
                color="blue"
                onClick={(e) => {
                    e.stopPropagation();
                    setPreviewDatasetId(row.original.id);
                }}
            >
                <IconEye size={16} />
            </ActionIcon>
        ),
        // enableRowSelection: !!flowId,
        // onRowSelectionChange: (updater) => {
        //     // MRT row selection handling is different, adapted here for single select behavior if needed or just styling
        //     // But we can also use moutineRowClick for selection logic as before
        // },
        mantineTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                if (flowId) {
                    setSelectedDatasetId(row.original.id);
                }
            },
            style: {
                cursor: flowId ? 'pointer' : 'default',
                backgroundColor:
                    selectedDatasetId === row.original.id
                        ? 'var(--mantine-color-blue-light)'
                        : undefined,
            },
        }),
        state: {
            isLoading,
            showAlertBanner: isError,
            showProgressBars: isLoading,
        },
    });

    // PREVIEW MODE
    if (previewDatasetId) {
        return (
            <Container fluid h="100%" display="flex" style={{ flexDirection: 'column' }}>
                <Group mb="md">
                    <Button
                        variant="subtle"
                        leftSection={<IconArrowLeft size={16} />}
                        onClick={() => setPreviewDatasetId(null)}
                    >
                        Back to List
                    </Button>
                    <Title order={3}>Dataset Preview</Title>
                </Group>

                <Paper
                    flex={1}
                    withBorder
                    p="md"
                    style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                >
                    <DatasetImagesView datasetId={previewDatasetId} />
                </Paper>
            </Container>
        );
    }

    // MAIN LIST MODE
    return (
        <Container fluid h="100%" display="flex" style={{ flexDirection: 'column' }}>
            <Group justify="space-between" mb="md">
                <Title order={2}>{flowId ? 'Step 1: Select Dataset' : 'Dataset Management'}</Title>
                <Group>
                    <Button onClick={open} leftSection={<IconPlus size={16} />}>
                        Create Dataset
                    </Button>
                    {flowId && (
                        <Button
                            onClick={handleNext}
                            disabled={!selectedDatasetId}
                            loading={updateFlowMutation.isPending}
                        >
                            Next: Training
                        </Button>
                    )}
                </Group>
            </Group>

            <Paper
                flex={1}
                withBorder
                p="md"
                display="flex"
                style={{ flexDirection: 'column', overflow: 'hidden' }}
            >
                <MantineReactTable table={table} />
            </Paper>

            <Modal opened={opened} onClose={close} title="Create New Dataset">
                <Stack>
                    <TextInput
                        label="Dataset Name"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    />
                    <TextInput
                        label="Path"
                        placeholder="/path/to/dataset"
                        value={formState.path}
                        onChange={(e) => setFormState({ ...formState, path: e.target.value })}
                    />
                    <Select
                        label="Type"
                        data={['yolo', 'coco', 'voc']}
                        value={formState.type}
                        onChange={(val) => setFormState({ ...formState, type: val || 'yolo' })}
                    />
                    <Textarea
                        label="Description"
                        value={formState.description}
                        onChange={(e) =>
                            setFormState({ ...formState, description: e.target.value })
                        }
                    />
                    <Button onClick={handleSubmit} loading={createMutation.isPending}>
                        Submit
                    </Button>
                </Stack>
            </Modal>
        </Container>
    );
}
