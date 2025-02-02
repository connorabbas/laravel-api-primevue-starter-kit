<script setup>
import { ref, useTemplateRef } from 'vue';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue';
import Container from '@/components/Container.vue';
import { useAxiosLazyDataTable } from '@/composables/useAxiosLazyDataTable';
import { FilterMatchMode } from '@primevue/core/api';

// User context menu
const userContextMenu = useTemplateRef('user-context-menu');
const userContextMenuItems = ref([]);
function toggleUserContextMenu(event, userData) {
    // Populate menu items based on row data
    userContextMenuItems.value = [
        {
            label: 'Manage User',
            icon: 'pi pi-pencil',
            command: () => {
                alert('User Data: ' + JSON.stringify(userData));
            },
        },
    ];
    // Show the menu
    userContextMenu.value.toggle(event);
}

// DataTable
const {
    data,
    processing,
    filters,
    sorting,
    firstDatasetIndex,
    filteredOrSorted,
    debounceInputFilter,
    fetchData,
    paginate,
    filter,
    sort,
    hardReset,
} = useAxiosLazyDataTable('/api/users', {
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    email: { value: null, matchMode: FilterMatchMode.CONTAINS },
}, 20);

fetchData();
</script>

<template>
    <AuthenticatedLayout>
        <template #header>
            <h1 class="font-bold text-2xl leading-tight">Users</h1>
        </template>
        <Container>
            <div class="py-4 md:py-8">
                <Card>
                    <template #content>
                        <Menu
                            ref="user-context-menu"
                            class="shadow-sm"
                            :model="userContextMenuItems"
                            popup
                        />
                        <DataTable
                            ref="dataTable"
                            v-model:filters="filters"
                            lazy
                            paginator
                            removableSort
                            resizableColumns
                            columnResizeMode="fit"
                            :loading="processing"
                            :value="data.data"
                            :totalRecords="data.total"
                            filterDisplay="row"
                            :sortField="sorting.field"
                            :sortOrder="sorting.order"
                            :rows="data.per_page"
                            :rowsPerPageOptions="[10, 20, 50, 100]"
                            :first="firstDatasetIndex"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
                            @filter="filter"
                            @sort="sort"
                            @page="paginate"
                        >
                            <template #empty>
                                <div class="flex justify-center">
                                    <Message
                                        severity="warn"
                                        icon="pi pi-exclamation-circle"
                                        class="grow text-center flex justify-center"
                                    >
                                        No Users found.
                                    </Message>
                                </div>
                            </template>
                            <Column
                                field="name"
                                header="Name"
                                sortable
                                :showFilterMenu="false"
                            >
                                <template #filter="{ filterModel, filterCallback }">
                                    <InputText
                                        v-model="filterModel.value"
                                        type="text"
                                        placeholder="Search by name"
                                        fluid
                                        @input="debounceInputFilter(filterCallback)"
                                    />
                                </template>
                                <template #body="slotProps">
                                    {{ slotProps.data.name }}
                                </template>
                            </Column>
                            <Column
                                field="email"
                                header="Email"
                                sortable
                                :showFilterMenu="false"
                            >
                                <template #filter="{ filterModel, filterCallback }">
                                    <InputText
                                        v-model="filterModel.value"
                                        type="text"
                                        placeholder="Search by Email"
                                        fluid
                                        @input="debounceInputFilter(filterCallback)"
                                    />
                                </template>
                                <template #body="slotProps">
                                    {{ slotProps.data.email }}
                                </template>
                            </Column>
                            <Column header="Action">
                                <template #body="{ data }">
                                    <Button
                                        v-tooltip.top="'Show User Actions'"
                                        type="button"
                                        severity="secondary"
                                        text
                                        rounded
                                        icon="pi pi-ellipsis-v"
                                        @click="toggleUserContextMenu($event, data)"
                                    />
                                </template>
                            </Column>
                        </DataTable>
                    </template>
                </Card>
            </div>
        </Container>
    </AuthenticatedLayout>
</template>
