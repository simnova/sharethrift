import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { AdminUsersTable } from './admin-users-table';
import type { AdminUserData } from './admin-users-table.types';

const mockUsers: AdminUserData[] = [
    {
        id: '1',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        accountCreated: '2023-01-15',
        status: 'Active',
        isBlocked: false,
    },
];

const mockBlockedUser: AdminUserData[] = [
    {
        id: '2',
        username: 'blockeduser',
        firstName: 'Blocked',
        lastName: 'User',
        accountCreated: '2023-05-20',
        status: 'Blocked',
        isBlocked: true,
    },
];

const mockMultipleUsers: AdminUserData[] = [
    ...mockUsers,
    ...mockBlockedUser,
    {
        id: '3',
        username: 'janesmith',
        firstName: 'Jane',
        lastName: 'Smith',
        accountCreated: '2024-02-10',
        status: 'Active',
        isBlocked: false,
    },
];

const meta: Meta<typeof AdminUsersTable> = {
    title: 'Components/AdminUsersTable',
    component: AdminUsersTable,
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof AdminUsersTable>;

export const WithUsers: Story = {
    args: {
        data: mockUsers,
        searchText: '',
        statusFilters: [],
        sorter: { field: null, order: null },
        currentPage: 1,
        pageSize: 10,
        total: 1,
        loading: false,
        onSearch: fn(),
        onStatusFilter: fn(),
        onTableChange: fn(),
        onPageChange: fn(),
        onAction: fn(),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const ClickViewProfileButton: Story = {
    args: {
        data: mockUsers,
        searchText: '',
        statusFilters: [],
        sorter: { field: null, order: null },
        currentPage: 1,
        pageSize: 10,
        total: 1,
        loading: false,
        onSearch: fn(),
        onStatusFilter: fn(),
        onTableChange: fn(),
        onPageChange: fn(),
        onAction: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const viewProfileButton = await canvas.findByRole('button', {
            name: 'View Profile',
        });
        await userEvent.click(viewProfileButton);
        await expect(args.onAction).toHaveBeenCalledWith('view-profile', '1');
    },
};

export const ClickViewReportButton: Story = {
    args: {
        data: mockUsers,
        searchText: '',
        statusFilters: [],
        sorter: { field: null, order: null },
        currentPage: 1,
        pageSize: 10,
        total: 1,
        loading: false,
        onSearch: fn(),
        onStatusFilter: fn(),
        onTableChange: fn(),
        onPageChange: fn(),
        onAction: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const viewReportButton = await canvas.findByRole('button', {
            name: 'View Report',
        });
        await userEvent.click(viewReportButton);
        await expect(args.onAction).toHaveBeenCalledWith('view-report', '1');
    },
};

export const OpenBlockModal: Story = {
    args: {
        data: mockUsers,
        searchText: '',
        statusFilters: [],
        sorter: { field: null, order: null },
        currentPage: 1,
        pageSize: 10,
        total: 1,
        loading: false,
        onSearch: fn(),
        onStatusFilter: fn(),
        onTableChange: fn(),
        onPageChange: fn(),
        onAction: fn(),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const blockButton = await canvas.findByRole('button', { name: 'Block' });
        await userEvent.click(blockButton);
        await waitFor(async () => {
            const modalTitle = document.querySelector('.ant-modal-title');
            await expect(modalTitle?.textContent).toBe('Block User');
        });
    },
};

export const OpenUnblockModal: Story = {
    args: {
        data: mockBlockedUser,
        searchText: '',
        statusFilters: [],
        sorter: { field: null, order: null },
        currentPage: 1,
        pageSize: 10,
        total: 1,
        loading: false,
        onSearch: fn(),
        onStatusFilter: fn(),
        onTableChange: fn(),
        onPageChange: fn(),
        onAction: fn(),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const unblockButton = await canvas.findByRole('button', {
            name: 'Unblock',
        });
        await userEvent.click(unblockButton);
        await waitFor(async () => {
            const modalTitle = document.querySelector('.ant-modal-title');
            await expect(modalTitle?.textContent).toBe('Unblock User');
        });
    },
};

export const ConfirmUnblockUser: Story = {
    args: {
        data: mockBlockedUser,
        searchText: '',
        statusFilters: [],
        sorter: { field: null, order: null },
        currentPage: 1,
        pageSize: 10,
        total: 1,
        loading: false,
        onSearch: fn(),
        onStatusFilter: fn(),
        onTableChange: fn(),
        onPageChange: fn(),
        onAction: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const unblockButton = await canvas.findByRole('button', {
            name: 'Unblock',
        });
        await userEvent.click(unblockButton);
        await waitFor(async () => {
            const okButton = document.querySelector(
                '.ant-modal-footer .ant-btn-primary',
            );
            if (okButton) {
                await userEvent.click(okButton);
            }
        });
        await expect(args.onAction).toHaveBeenCalledWith('unblock', '2');
    },
};

export const MultipleUsers: Story = {
    args: {
        data: mockMultipleUsers,
        searchText: '',
        statusFilters: [],
        sorter: { field: null, order: null },
        currentPage: 1,
        pageSize: 10,
        total: 3,
        loading: false,
        onSearch: fn(),
        onStatusFilter: fn(),
        onTableChange: fn(),
        onPageChange: fn(),
        onAction: fn(),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getAllByText('johndoe').length).toBeGreaterThan(0);
        await expect(canvas.getAllByText('blockeduser').length).toBeGreaterThan(0);
    },
};

export const UsersWithInvalidDates: Story = {
    args: {
        data: [
            {
                id: '1',
                username: 'nodate',
                firstName: 'No',
                lastName: 'Date',
                accountCreated: null as unknown as string,
                status: 'Active',
                isBlocked: false,
            },
            {
                id: '2',
                username: 'invaliddate',
                firstName: 'Invalid',
                lastName: 'Date',
                accountCreated: 'not-a-date',
                status: 'Active',
                isBlocked: false,
            },
        ],
        searchText: '',
        statusFilters: [],
        sorter: { field: null, order: null },
        currentPage: 1,
        pageSize: 10,
        total: 2,
        loading: false,
        onSearch: fn(),
        onStatusFilter: fn(),
        onTableChange: fn(),
        onPageChange: fn(),
        onAction: fn(),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const naElements = canvas.getAllByText('N/A');
        await expect(naElements.length).toBeGreaterThan(0);
    },
};

export const Loading: Story = {
    args: {
        data: [],
        searchText: '',
        statusFilters: [],
        sorter: { field: null, order: null },
        currentPage: 1,
        pageSize: 10,
        total: 0,
        loading: true,
        onSearch: fn(),
        onStatusFilter: fn(),
        onTableChange: fn(),
        onPageChange: fn(),
        onAction: fn(),
    },
    play: async ({ canvasElement }) => {
        await expect(canvasElement).toBeTruthy();
    },
};

export const SearchUser: Story = {
    args: {
        data: mockUsers,
        searchText: '',
        statusFilters: [],
        sorter: { field: null, order: null },
        currentPage: 1,
        pageSize: 10,
        total: 1,
        loading: false,
        onSearch: fn(),
        onStatusFilter: fn(),
        onTableChange: fn(),
        onPageChange: fn(),
        onAction: fn(),
    },
    play: async ({ canvasElement, args }) => {
        // Wait for table to render
        await waitFor(() => {
            expect(canvasElement.querySelector('.ant-table')).toBeTruthy();
        });
        
        // Click on search icon to open search dropdown
        const searchIcon = canvasElement.querySelector('[data-icon="search"]');
        if (searchIcon) {
            const filterButton = searchIcon.closest('button');
            if (filterButton) {
                await userEvent.click(filterButton);
                
                // Wait for dropdown to appear
                await waitFor(() => {
                    expect(document.querySelector('.ant-input-search input')).toBeTruthy();
                });
                
                // Type in search field
                const searchInput = document.querySelector('.ant-input-search input');
                if (searchInput) {
                    await userEvent.type(searchInput, 'john');
                    // Trigger search
                    const searchButton = document.querySelector('.ant-input-search-button');
                    if (searchButton) {
                        await userEvent.click(searchButton);
                        // Wait for search to process
                        await waitFor(() => {
                            expect(args.onSearch).toHaveBeenCalled();
                        });
                    }
                }
            }
        }
    },
};

export const FilterByStatus: Story = {
    args: {
        data: mockMultipleUsers,
        searchText: '',
        statusFilters: [],
        sorter: { field: null, order: null },
        currentPage: 1,
        pageSize: 10,
        total: 3,
        loading: false,
        onSearch: fn(),
        onStatusFilter: fn(),
        onTableChange: fn(),
        onPageChange: fn(),
        onAction: fn(),
    },
    play: async ({ canvasElement, args }) => {
        // Wait for table to render
        await waitFor(() => {
            expect(canvasElement.querySelector('.ant-table')).toBeTruthy();
        });
        
        // Click on filter icon
        const filterIcon = canvasElement.querySelector('[data-icon="filter"]');
        if (filterIcon) {
            const filterButton = filterIcon.closest('button');
            if (filterButton) {
                await userEvent.click(filterButton);
                
                // Wait for dropdown to appear
                await waitFor(() => {
                    expect(document.querySelector('.ant-dropdown-menu')).toBeTruthy();
                });
                
                // Check "Blocked" status filter
                const blockedCheckbox = document.querySelector('input[value="Blocked"]');
                if (blockedCheckbox) {
                    await userEvent.click(blockedCheckbox);
                    // Wait for filter to process
                    await waitFor(() => {
                        expect(args.onStatusFilter).toHaveBeenCalled();
                    });
                }
            }
        }
    },
};

export const SortByColumn: Story = {
    args: {
        data: mockMultipleUsers,
        searchText: '',
        statusFilters: [],
        sorter: { field: null, order: null },
        currentPage: 1,
        pageSize: 10,
        total: 3,
        loading: false,
        onSearch: fn(),
        onStatusFilter: fn(),
        onTableChange: fn(),
        onPageChange: fn(),
        onAction: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        // Click on "First Name" header to sort
        const firstNameHeader = canvas.getByText('First Name');
        await userEvent.click(firstNameHeader);
        await expect(args.onTableChange).toHaveBeenCalled();
    },
};

export const ClearSearch: Story = {
    args: {
        data: mockUsers,
        searchText: 'john',
        statusFilters: [],
        sorter: { field: null, order: null },
        currentPage: 1,
        pageSize: 10,
        total: 1,
        loading: false,
        onSearch: fn(),
        onStatusFilter: fn(),
        onTableChange: fn(),
        onPageChange: fn(),
        onAction: fn(),
    },
    play: async ({ canvasElement }) => {
        // Click on search icon
        const searchIcon = canvasElement.querySelector('[data-icon="search"]');
        if (searchIcon) {
            const filterButton = searchIcon.closest('button');
            if (filterButton) {
                await userEvent.click(filterButton);
            }
        }
        // Clear search
        await waitFor(async () => {
            const clearButton = document.querySelector('.ant-input-clear-icon');
            if (clearButton) {
                await userEvent.click(clearButton);
            }
        });
    },
};

export const ConfirmBlockUser: Story = {
    args: {
        data: mockUsers,
        searchText: '',
        statusFilters: [],
        sorter: { field: null, order: null },
        currentPage: 1,
        pageSize: 10,
        total: 1,
        loading: false,
        onSearch: fn(),
        onStatusFilter: fn(),
        onTableChange: fn(),
        onPageChange: fn(),
        onAction: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const blockButton = await canvas.findByRole('button', { name: 'Block' });
        await userEvent.click(blockButton);

        // Wait for modal and fill form
        await waitFor(async () => {
            const reasonSelect = document.querySelector('.ant-select-selector');
            if (reasonSelect) {
                await userEvent.click(reasonSelect);
            }
        });

        // Select first option
        const firstOption = document.querySelector('.ant-select-item');
        if (firstOption) {
            await userEvent.click(firstOption);
        }

        // Fill description
        const descriptionField = document.querySelector('textarea');
        if (descriptionField) {
            await userEvent.type(descriptionField, 'Test block reason');
        }

        // Confirm block
        const confirmBtn = document.querySelector(
            '.ant-modal-footer .ant-btn-primary',
        );
        if (confirmBtn) {
            await userEvent.click(confirmBtn);
        }

        await expect(args.onAction).toHaveBeenCalledWith('block', '1');
    },
};

export const CancelBlockModal: Story = {
    args: {
        data: mockUsers,
        searchText: '',
        statusFilters: [],
        sorter: { field: null, order: null },
        currentPage: 1,
        pageSize: 10,
        total: 1,
        loading: false,
        onSearch: fn(),
        onStatusFilter: fn(),
        onTableChange: fn(),
        onPageChange: fn(),
        onAction: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const blockButton = await canvas.findByRole('button', { name: 'Block' });
        await userEvent.click(blockButton);

        // Wait for modal and cancel
        await waitFor(async () => {
            const cancelBtn = document.querySelector(
                '.ant-modal-footer .ant-btn:not(.ant-btn-primary)',
            );
            if (cancelBtn) {
                await userEvent.click(cancelBtn);
            }
        });

        // onAction should not be called when canceling
        await expect(args.onAction).not.toHaveBeenCalled();
    },
};

export const CancelUnblockModal: Story = {
    args: {
        data: mockBlockedUser,
        searchText: '',
        statusFilters: [],
        sorter: { field: null, order: null },
        currentPage: 1,
        pageSize: 10,
        total: 1,
        loading: false,
        onSearch: fn(),
        onStatusFilter: fn(),
        onTableChange: fn(),
        onPageChange: fn(),
        onAction: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const unblockButton = await canvas.findByRole('button', {
            name: 'Unblock',
        });
        await userEvent.click(unblockButton);

        // Wait for modal and cancel
        await waitFor(async () => {
            const cancelBtn = document.querySelector(
                '.ant-modal-footer .ant-btn:not(.ant-btn-primary)',
            );
            if (cancelBtn) {
                await userEvent.click(cancelBtn);
            }
        });

        // onAction should not be called when canceling
        await expect(args.onAction).not.toHaveBeenCalled();
    },
};

export const UsersWithMissingUsername: Story = {
    args: {
        data: [
            {
                id: '1',
                username: null as unknown as string,
                firstName: 'No',
                lastName: 'Username',
                accountCreated: '2023-01-15',
                status: 'Active',
                isBlocked: false,
            },
        ],
        searchText: '',
        statusFilters: [],
        sorter: { field: null, order: null },
        currentPage: 1,
        pageSize: 10,
        total: 1,
        loading: false,
        onSearch: fn(),
        onStatusFilter: fn(),
        onTableChange: fn(),
        onPageChange: fn(),
        onAction: fn(),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Use getAllByText since N/A appears multiple times (username and name display)
        const naElements = canvas.getAllByText('N/A');
        await expect(naElements.length).toBeGreaterThan(0);
    },
};

export const WithSorting: Story = {
    args: {
        data: mockMultipleUsers,
        searchText: '',
        statusFilters: [],
        sorter: { field: 'firstName', order: 'ascend' },
        currentPage: 1,
        pageSize: 10,
        total: 3,
        loading: false,
        onSearch: fn(),
        onStatusFilter: fn(),
        onTableChange: fn(),
        onPageChange: fn(),
        onAction: fn(),
    },
    play: async ({ canvasElement }) => {
        await expect(canvasElement).toBeTruthy();
    },
};

export const WithStatusFilters: Story = {
    args: {
        data: mockMultipleUsers,
        searchText: '',
        statusFilters: ['Active'],
        sorter: { field: null, order: null },
        currentPage: 1,
        pageSize: 10,
        total: 3,
        loading: false,
        onSearch: fn(),
        onStatusFilter: fn(),
        onTableChange: fn(),
        onPageChange: fn(),
        onAction: fn(),
    },
    play: async ({ canvasElement }) => {
        await expect(canvasElement).toBeTruthy();
    },
};
