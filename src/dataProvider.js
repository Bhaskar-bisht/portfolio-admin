/** @format */

// src/dataProvider.js
import simpleRestProvider from "ra-data-simple-rest";
import { fetchUtils } from "react-admin";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: "application/json" });
    }

    const token = localStorage.getItem("token");
    if (token) {
        options.headers.set("Authorization", `Bearer ${token}`);
    }

    return fetchUtils.fetchJson(url, options);
};

const baseDataProvider = simpleRestProvider(`${API_URL}/admin`, httpClient);

// Custom dataProvider to handle file uploads and custom responses
const dataProvider = {
    ...baseDataProvider,

    getList: (resource, params) => {
        // ✅ Special handling for api-logs
        if (resource === "api-logs") {
            const { page, perPage } = params.pagination;
            const { field, order } = params.sort;
            const query = {
                page: page,
                limit: perPage,
                sort: `${order === "DESC" ? "-" : ""}${field}`,
                ...params.filter,
            };

            const url = `${API_URL}/admin/api-logs?${new URLSearchParams(query)}`;

            return httpClient(url).then(({ json }) => ({
                data: json.data.map((item) => ({ ...item, id: item._id })),
                total: json.pagination?.total || json.data.length,
            }));
        }

        // Default handling for other resources
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            page: page,
            limit: perPage,
            sort: `${order === "DESC" ? "-" : ""}${field}`,
            ...params.filter,
        };

        const url = `${API_URL}/admin/${resource}?${new URLSearchParams(query)}`;

        return httpClient(url).then(({ json }) => ({
            data: json.data.map((item) => ({ ...item, id: item._id || item.id })),
            total: json.pagination?.total || json.data.length,
        }));
    },

    getOne: (resource, params) => {
        // ✅ Special handling for api-logs
        if (resource === "api-logs") {
            const url = `${API_URL}/admin/api-logs/${params.id}`;
            return httpClient(url).then(({ json }) => ({
                data: { ...json.data, id: json.data._id },
            }));
        }

        const url = `${API_URL}/admin/${resource}/${params.id}`;

        return httpClient(url).then(({ json }) => ({
            data: { ...json.data, id: json.data._id || json.data.id },
        }));
    },

    getMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        const url = `${API_URL}/admin/${resource}?${new URLSearchParams(query)}`;

        return httpClient(url).then(({ json }) => ({
            data: json.data.map((item) => ({ ...item, id: item._id || item.id })),
        }));
    },

    create: (resource, params) => {
        // Handle file uploads
        if (
            params.data.thumbnail ||
            params.data.avatar ||
            params.data.logo ||
            params.data.featuredImage ||
            params.data.gallery
        ) {
            return uploadFile(resource, params, "POST");
        }

        const url = `${API_URL}/admin/${resource}`;

        return httpClient(url, {
            method: "POST",
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: { ...json.data, id: json.data._id || json.data.id },
        }));
    },

    update: (resource, params) => {
        // Handle file uploads
        if (
            params.data.thumbnail ||
            params.data.avatar ||
            params.data.logo ||
            params.data.featuredImage ||
            params.data.gallery
        ) {
            return uploadFile(resource, params, "PUT");
        }

        const url = `${API_URL}/admin/${resource}/${params.id}`;

        return httpClient(url, {
            method: "PUT",
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: { ...json.data, id: json.data._id || json.data.id },
        }));
    },

    delete: (resource, params) => {
        const url = `${API_URL}/admin/${resource}/${params.id}`;

        return httpClient(url, {
            method: "DELETE",
        }).then(({ json }) => ({
            data: { ...params.previousData, id: params.id },
        }));
    },

    deleteMany: (resource, params) => {
        return Promise.all(
            params.ids.map((id) =>
                httpClient(`${API_URL}/admin/${resource}/${id}`, {
                    method: "DELETE",
                }),
            ),
        ).then(() => ({ data: params.ids }));
    },

    // ✅ CUSTOM METHOD: Get API Log Statistics
    getApiLogStats: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_URL}/admin/api-logs/stats?${queryString}`;

        const token = localStorage.getItem("token");
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return await response.json();
    },

    // ✅ CUSTOM METHOD: Bulk Delete by Date Range
    deleteApiLogsByDateRange: async (startDate, endDate) => {
        const url = `${API_URL}/admin/api-logs/bulk/date-range`;

        const token = localStorage.getItem("token");
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ startDate, endDate }),
        });

        return await response.json();
    },

    // ✅ CUSTOM METHOD: Bulk Delete by Method
    deleteApiLogsByMethod: async (method) => {
        const url = `${API_URL}/admin/api-logs/bulk/method`;

        const token = localStorage.getItem("token");
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ method }),
        });

        return await response.json();
    },

    // ✅ CUSTOM METHOD: Delete All API Logs
    deleteAllApiLogs: async () => {
        const url = `${API_URL}/admin/api-logs/bulk/all`;

        const token = localStorage.getItem("token");
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return await response.json();
    },
};

// Helper function for file uploads
const uploadFile = (resource, params, method) => {
    const formData = new FormData();

    // Handle different file fields
    const fileFields = [
        "thumbnail",
        "avatar",
        "logo",
        "featuredImage",
        "companyLogo",
        "institutionLogo",
        "certificate",
        "banner",
        "iconImage",
        "ogImage",
    ];

    // Add files to FormData
    fileFields.forEach((field) => {
        if (params.data[field]?.rawFile) {
            formData.append(field, params.data[field].rawFile);
        }
    });

    // Handle gallery (multiple files)
    if (params.data.gallery && Array.isArray(params.data.gallery)) {
        params.data.gallery.forEach((file) => {
            if (file.rawFile) {
                formData.append("gallery", file.rawFile);
            }
        });
    }

    // Add other fields
    Object.keys(params.data).forEach((key) => {
        if (!fileFields.includes(key) && key !== "gallery") {
            const value = params.data[key];
            if (value !== null && value !== undefined) {
                if (typeof value === "object") {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            }
        }
    });

    const token = localStorage.getItem("token");
    const url = method === "POST" ? `${API_URL}/admin/${resource}` : `${API_URL}/admin/${resource}/${params.id}`;

    return fetch(url, {
        method: method,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    })
        .then((response) => response.json())
        .then((json) => ({
            data: { ...json.data, id: json.data._id || json.data.id },
        }));
};

export default dataProvider;
