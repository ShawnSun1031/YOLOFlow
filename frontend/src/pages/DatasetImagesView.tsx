import { useState, useMemo } from 'react';
import {
    Paper,
    Title,
    Group,
    Badge,
    Button,
    Modal,
    Stack,
    Checkbox,
    Textarea,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { IconEye } from '@tabler/icons-react';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { api } from '../api/client';
import { Dataset, ImageMetadata } from '../types';
import { ImageCanvas } from '../components/ImageCanvas';

interface DatasetImagesViewProps {
    datasetId: string;
}

export function DatasetImagesView({ datasetId }: DatasetImagesViewProps) {
    // Fetch specific dataset details to get images
    const { data: dataset, isLoading } = useQuery<Dataset>({
        queryKey: ['dataset', datasetId],
        queryFn: async () => {
            const res = await api.get(`/stepper/datasets/${datasetId}`);
            return res.data;
        },
    });

    const [previewImage, setPreviewImage] = useState<ImageMetadata | null>(null);
    const [showBox, setShowBox] = useState(true);

    const columns = useMemo<MRT_ColumnDef<ImageMetadata>[]>(
        () => [
            {
                accessorKey: 'url',
                header: 'Preview',
                Cell: ({ cell }) => (
                    <img
                        src={cell.getValue<string>()}
                        alt="mini"
                        style={{
                            width: 40,
                            height: 40,
                            objectFit: 'cover',
                            borderRadius: 4,
                        }}
                    />
                ),
            },
            {
                accessorKey: 'name',
                header: 'Name',
            },
            {
                accessorKey: 'size',
                header: 'Size',
            },
            {
                accessorKey: 'tags',
                header: 'Tags',
                Cell: ({ cell }) => (
                    <>
                        {cell.getValue<string[]>().map((t) => (
                            <Badge key={t} size="xs" mr={4}>
                                {t}
                            </Badge>
                        ))}
                    </>
                ),
            },
        ],
        [],
    );

    const table = useMantineReactTable({
        columns,
        data: dataset?.images_metadata || [],
        enableRowActions: true,
        renderRowActions: ({ row }) => (
            <Button
                size="xs"
                variant="light"
                leftSection={<IconEye size={12} />}
                onClick={() => setPreviewImage(row.original)}
            >
                Details
            </Button>
        ),
        state: {
            isLoading,
        },
    });

    if (isLoading || !dataset)
        return (
            <Paper flex={2} p="md" withBorder>
                <MantineReactTable table={table} />
            </Paper>
        );

    return (
        <>
            <Title order={4} mb="md">
                Images of {dataset.name}
                <br />
                Dataset ID: {dataset.id}
            </Title>

            <MantineReactTable table={table} />

            {/* Detail Modal with Canvas */}
            <Modal
                size="xl"
                opened={!!previewImage}
                onClose={() => setPreviewImage(null)}
                title={previewImage?.name}
            >
                {previewImage && (
                    <Stack>
                        <Group>
                            <Checkbox
                                label="Show Bounding Boxes"
                                checked={showBox}
                                onChange={(e) => setShowBox(e.currentTarget.checked)}
                            />
                        </Group>
                        <ImageCanvas
                            src={previewImage.url}
                            showBoxes={showBox}
                            boxes={[
                                // Generating mock boxes based on tags for demo
                                [0, 0.5, 0.5, 0.4, 0.3], // class 0, center, center, w, h
                                [1, 0.2, 0.2, 0.1, 0.1],
                            ]}
                        />
                        <Textarea
                            label="Description"
                            readOnly
                            value={`Path: ${previewImage.path}\nSize: ${previewImage.size}\nFormat: ${previewImage.format}`}
                        />
                    </Stack>
                )}
            </Modal>
        </>
    );
}
