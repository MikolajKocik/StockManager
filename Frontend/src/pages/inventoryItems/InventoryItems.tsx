import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Select, Input, Button, Header } from "@/components/common";
import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query";
import { inventoryApi } from "@/api/internal/inventoryApi";
import { productsApi } from "@/api/internal/productsApi";
import type { InventoryItemCollection } from "@/models/inventoryItem";

export default function InventoryItems() {
    const [question, setQuestion] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
    const [aiItems, setAiItems] = useState<InventoryItemCollection | null>(null);

    const { data: items = { data: [] } } = useQuery({
        queryKey: ['items'],
        queryFn: inventoryApi.getItems
    });

    const { data: genres = [] } = useQuery({
        queryKey: ['genres'],
        queryFn: productsApi.getGenres
    });

    const { data: warehouses = [] } = useQuery({
        queryKey: ['warehouses'],
        queryFn: productsApi.getWarehouses
    });

    const { mutate: searchAI, isPending: isSearching } = useMutation({
        mutationFn: inventoryApi.searchAI,
        onSuccess: (data) => setAiItems(data),
        onError: () => alert("Ollama error ocurred during retrieving question")
    });

    const handleAsk = async () => {
        if (!question.trim()) {
            setAiItems(null);
            return;
        } else {
            const requestPayload = {
                question: question,
                conversationId: null,
                categoryFilter: selectedCategory || null,
                warehouseFilter: selectedWarehouse || null
            };

            searchAI(requestPayload);
        }
    }

    const displayItems = aiItems ?? items;

    return (
        <div>
            <h2>Inventory Items</h2>
        </div>
    )
}
