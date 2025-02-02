import { ref, computed, onMounted } from 'vue';
import axios from '@/utils/axios';
import debounce from 'lodash-es/debounce';
import cloneDeep from 'lodash-es/cloneDeep';
import qs from 'qs';

export function useAxiosPaginatedData(url, initialFilters = {}, initialRows = 20) {
    const data = ref({});
    const urlParams = ref({});
    const processing = ref(false);
    const filters = ref(cloneDeep(initialFilters));
    const sorting = ref({
        field: '',
        order: 1,
    });
    const pagination = ref({
        page: 1,
        rows: initialRows,
    });

    const firstDatasetIndex = computed(() => {
        return (pagination.value.page - 1) * pagination.value.rows;
    });
    const filteredOrSorted = computed(() => {
        const filters = urlParams.value?.filters || {};
        const sortField = urlParams.value?.sortField || null;
        const isFiltering = Object.values(filters).some((filter) => filter.value !== null && filter.value !== '');
        const isSorting = sortField !== null && sortField !== '';

        return isFiltering || isSorting;
    });

    const debounceInputFilter = debounce((filterCallback) => {
        filterCallback();
    }, 300);

    function setUrlParams() {
        const queryString = window.location.search;
        const params = qs.parse(queryString, {
            ignoreQueryPrefix: true,
            strictNullHandling: true,
            decoder: function (str, defaultDecoder) {
                // set empty string values to null
                const value = defaultDecoder(str);
                return value === '' ? null : value;
            },
        });
        urlParams.value = { ...params };
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    function updateUrlSearchParams() {
        const params = {
            filters: filters.value,
            page: pagination.value.page,
            rows: pagination.value.rows,
            sortField: sorting.value.field,
            sortOrder: sorting.value.order,
        };
        const newQueryString = qs.stringify(params, { addQueryPrefix: true });
        window.history.replaceState(null, '', newQueryString);
    }

    function fetchData() {
        processing.value = true;
        return axios
            .get(url, {
                params: {
                    filters: filters.value,
                    ...pagination.value,
                    sortField: sorting.value.field,
                    sortOrder: sorting.value.order,
                },
            })
            .then((response) => {
                data.value = response.data;
                updateUrlSearchParams();
            })
            .finally(() => {
                setUrlParams();
                processing.value = false;
            })
            .catch((error) => {
                // TODO
            });
    }

    function paginate(event) {
        if (event.rows != pagination.value.rows) {
            pagination.value.page = 1;
        } else {
            pagination.value.page = event.page + 1;
        }
        pagination.value.rows = event.rows;
        fetchData().then(() => {
            scrollToTop();
        });
    }

    function filter() {
        pagination.value.page = 1;
        fetchData().then(() => {
            scrollToTop();
        });
    }

    function reset() {
        const defaultFilters = cloneDeep(initialFilters);
        Object.keys(defaultFilters).forEach((key) => {
            filters.value[key].value = defaultFilters[key].value;
            filters.value[key].matchMode = defaultFilters[key].matchMode;
        });
        sorting.value = {
            field: '',
            order: 1,
        };
        pagination.value = {
            page: 1,
            rows: initialRows,
        };
        fetchData();
    }

    function hardReset() {
        return axios
            .get(url)
            .then((response) => {
                data.value = response.data;
            })
            .finally(() => {
                setUrlParams();
                processing.value = false;
            })
            .catch((error) => {
                // TODO
            });
    }

    function parseUrlFilterValues() {
        Object.keys(filters.value).forEach((key) => {
            const filter = filters.value[key];
            if (!filter?.value || !filter?.matchMode) {
                return;
            }
            if (filter.matchMode == FilterMatchMode.DATE_IS) {
                filters.value[key].value = new Date(filter.value);
            } else if (typeof filter.value === 'string' && filter.value !== '' && !isNaN(Number(filter.value))) {
                filters.value[key].value = Number(filter.value);
            } else if (Array.isArray(filter.value) || filter.matchMode == FilterMatchMode.IN) {
                if (filter.value.length === 0) {
                    // empty arrays cause filtering issues, set to null instead
                    filters.value[key].value = null;
                } else {
                    // Unique array values
                    const unique = [...new Set(filter.value)];
                    filter.value = unique;
                    filter.value.forEach((value, index) => {
                        if (typeof value === 'string' && !isNaN(Number(value))) {
                            filter.value[index] = Number(value);
                        }
                    });
                }
            }
        });
    }

    function parseUrlParams() {
        filters.value = {
            ...cloneDeep(initialFilters),
            ...urlParams.value?.filters,
        };
        parseUrlFilterValues();
        if (urlParams.value?.sortField) {
            sorting.value.field = urlParams.value.sortField;
        }
        if (urlParams.value?.sortOrder) {
            sorting.value.order = parseInt(urlParams.value.sortOrder);
        }
        if (urlParams.value?.page) {
            pagination.value.page = parseInt(urlParams.value.page);
        }
    }

    onMounted(() => {
        setUrlParams();
        parseUrlParams();
        fetchData();
    });

    return {
        data,
        processing,
        filters,
        sorting,
        pagination,
        firstDatasetIndex,
        filteredOrSorted,
        debounceInputFilter,
        scrollToTop,
        fetchData,
        paginate,
        filter,
        reset,
        hardReset,
        parseUrlParams,
    };
}
