import type { DataSources } from '@sthrift/persistence';
import type { Domain } from '@sthrift/domain';

export interface GetAllUsersCommand {
	page: number;
	pageSize: number;
	searchText?: string | undefined;
	statusFilters?: string[] | undefined;
	sorter?: { field: string; order: string } | undefined;
}

export interface PersonalUserPageResult {
	items: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference[];
	total: number;
	page: number;
	pageSize: number;
}

type User = Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;

function applySearchFilter(users: User[], searchText?: string | undefined): User[] {
    if (!searchText?.trim()){ return users;}
    const q = searchText.toLowerCase();
    return users.filter((u) =>
        [u.account?.email, u.account?.username, u.account?.profile?.firstName, u.account?.profile?.lastName]
            .some((s) => s?.toLowerCase().includes(q)),
    );
}

function applyStatusFilter(users: User[], statusFilters?: string[] | undefined): User[] {
    if (!statusFilters?.length){ return users;}
    const wantActive = statusFilters.includes('Active');
    const wantBlocked = statusFilters.includes('Blocked');
    return users.filter((u) =>
        wantActive && !wantBlocked ? !u.isBlocked :
        wantBlocked && !wantActive ? u.isBlocked :
        true,
    );
}

const fieldGetters: Record<string, (u: User) => string | number> = {
    email:         (u) => u.account?.email ?? '',
    username:      (u) => u.account?.username ?? '',
    firstName:     (u) => u.account?.profile?.firstName ?? '',
    lastName:      (u) => u.account?.profile?.lastName ?? '',
    accountCreated:(u) => u.createdAt ? +new Date(u.createdAt) : 0,
    createdAt:     (u) => u.createdAt ? +new Date(u.createdAt) : 0,
    status:        (u) => u.isBlocked ? 1 : 0,
};

function sortUsers(users: User[], sorter: { field: string; order: string } | undefined): User[] {
    if (!sorter?.field || !sorter?.order) {return users;}
    const dir = sorter.order === 'ascend' ? 1 : -1;
    const get = fieldGetters[sorter.field];
    if (!get) {return users;}
    return users.sort((a, b) => {
        const A = get(a);
        const B = get(b);
        if (typeof A === 'string' && typeof B === 'string') {
            return A.localeCompare(B) * dir;
        }
        return (A < B ? -1 : A > B ? 1 : 0) * dir;
    });
}

function paginate<T>(items: T[], page: number, pageSize: number): T[] {
    const from = Math.max(0, (page - 1) * pageSize);
    return items.slice(from, from + pageSize);
}

export const getAllUsers = (datasources: DataSources) => {
    return async (command: GetAllUsersCommand): Promise<PersonalUserPageResult> => {
        const all = await datasources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getAll();

        const searched = applySearchFilter(all, command.searchText);
        const statusFiltered = applyStatusFilter(searched, command.statusFilters);
        const sorted = command.sorter ? sortUsers(statusFiltered, command.sorter) : statusFiltered;

        const total = sorted.length;
        const items = paginate(sorted, command.page, command.pageSize);

        return {
            items,
            total,
            page: command.page,
            pageSize: command.pageSize,
        };
    };
};
