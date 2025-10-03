import { useCallback, useEffect, useMemo, useState } from "react";

import {
	apiClient,
	type Institution,
	type InstitutionsResponse,
} from "@/lib/api";

interface UseInstitutionsOptions {
	initialPage?: number;
	initialLimit?: number;
	enabled?: boolean;
}

type InstitutionsMeta = InstitutionsResponse["data"]["meta"];

interface UseInstitutionsResult {
	institutions: Institution[];
	isLoading: boolean;
	error: Error | null;
	page: number;
	limit: number;
	pagination: InstitutionsMeta;
	setPage: (nextPage: number) => void;
	setLimit: (nextLimit: number) => void;
	refetch: () => Promise<Institution[]>;
}

const createEmptyMeta = (page: number, limit: number): InstitutionsMeta => ({
	page,
	limit,
	total: 0,
	totalPages: 0,
});

export function useInstitutions(
	options: UseInstitutionsOptions = {},
): UseInstitutionsResult {
	const { initialPage = 1, initialLimit = 10, enabled = true } = options;

	const [page, setPageState] = useState(initialPage);
	const [limit, setLimitState] = useState(initialLimit);
	const [institutions, setInstitutions] = useState<Institution[]>([]);
	const [pagination, setPagination] = useState<InstitutionsMeta>(
		createEmptyMeta(initialPage, initialLimit),
	);
	const [isLoading, setIsLoading] = useState(enabled);
	const [error, setError] = useState<Error | null>(null);

		const requestInstitutions = useCallback(
			(targetPage: number, targetLimit: number) =>
				apiClient.getMyInstitutions(targetPage, targetLimit),
			[],
		);

	useEffect(() => {
		if (!enabled) {
			setIsLoading(false);
			return;
		}

		let isCancelled = false;
		setIsLoading(true);
		setError(null);

			requestInstitutions(page, limit)
				.then((response) => {
					if (isCancelled) return;
					setInstitutions(response.data.data);
					setPagination(response.data.meta);
					setError(null);
				})
				.catch((err) => {
				if (isCancelled) return;
				const normalizedError =
					err instanceof Error
						? err
						: new Error("Failed to fetch institutions");
				setError(normalizedError);
			})
			.finally(() => {
				if (isCancelled) return;
				setIsLoading(false);
			});

		return () => {
			isCancelled = true;
		};
		}, [enabled, limit, page, requestInstitutions]);

	const setPage = useCallback((nextPage: number) => {
		setPageState((prev) => (prev === nextPage ? prev : nextPage));
	}, []);

	const setLimit = useCallback((nextLimit: number) => {
		setLimitState((prev) => (prev === nextLimit ? prev : nextLimit));
	}, []);

	const refetch = useCallback(async () => {
		if (!enabled) {
			setInstitutions([]);
				setPagination(createEmptyMeta(page, limit));
			setError(null);
			setIsLoading(false);
			return [];
		}

			setIsLoading(true);
			try {
				const response = await requestInstitutions(page, limit);
				setInstitutions(response.data.data);
				setPagination(response.data.meta);
				setError(null);
				return response.data.data;
		} catch (err) {
			const normalizedError =
				err instanceof Error
					? err
					: new Error("Failed to fetch institutions");
			setError(normalizedError);
			throw normalizedError;
		} finally {
			setIsLoading(false);
		}
		}, [enabled, limit, page, requestInstitutions]);

		const safePagination = useMemo(
			() => ({ ...pagination, limit }),
			[pagination, limit],
		);

	return {
		institutions,
		isLoading,
		error,
		page,
		limit,
		pagination: safePagination,
		setPage,
		setLimit,
		refetch,
	};
}
