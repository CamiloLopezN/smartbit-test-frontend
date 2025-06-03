import * as React from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    IconButton,
    Box,
    Typography,
} from '@mui/material';

export interface Column<T> {
    id: keyof T;
    label: string;
    minWidth?: number;
    align?: 'left' | 'center' | 'right';
    format?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface Action<T> {
    icon: React.ReactNode;
    onClick: (row: T) => void;
    title?: string;
}

interface GenericTableProps<T> {
    columns: Column<T>[];
    rows?: T[];
    actions?: Action<T>[];
    initialRowsPerPage?: number;
    rowsPerPageOptions?: number[];
    emptyMessage?: string;
}

export default function GenericTable<T extends Record<string, any>>({
                                                                        columns,
                                                                        rows = [],
                                                                        actions,
                                                                        initialRowsPerPage = 10,
                                                                        rowsPerPageOptions = [10, 25, 100],
                                                                        emptyMessage = 'No records found.',
                                                                    }: GenericTableProps<T>) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(initialRowsPerPage);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = +event.target.value;
        setRowsPerPage(value);
        setPage(0);
    };

    const paginatedRows = React.useMemo(() => {
        const start = page * rowsPerPage;
        return rows.slice(start, start + rowsPerPage);
    }, [rows, page, rowsPerPage]);

    if (rows.length === 0) {
        return (
            <Paper sx={{ width: '100%', p: 4 }}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="200px"
                >
                    <Typography variant="subtitle1" color="text.secondary">
                        {emptyMessage}
                    </Typography>
                </Box>
            </Paper>
        );
    }

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="generic table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={String(column.id)}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                            {actions && actions.length > 0 && (
                                <TableCell align="center" style={{ minWidth: 100 }}>
                                    Actions
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedRows.map((row, rowIndex) => (
                            <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                                {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                        <TableCell key={String(column.id)} align={column.align}>
                                            {column.format ? column.format(value, row) : value}
                                        </TableCell>
                                    );
                                })}
                                {actions && actions.length > 0 && (
                                    <TableCell align="center">
                                        {actions.map((action, actionIndex) => (
                                            <IconButton
                                                key={actionIndex}
                                                onClick={() => action.onClick(row)}
                                                title={action.title}
                                                size="small"
                                            >
                                                {action.icon}
                                            </IconButton>
                                        ))}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={rowsPerPageOptions}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
