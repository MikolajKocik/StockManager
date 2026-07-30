import { useQuery } from "@tanstack/react-query";
import { documentsApi } from "@/api/internal/documentsApi";
import { type Document } from "@/models/document";

export const useDocuments = () => {
    return useQuery<Document[]>({
        queryKey: ["documents"],
        queryFn: () => documentsApi.getDocuments()
    });
};
