import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Select, Input, Button, Header } from "@/components/common";
import { useState } from "react"
import { useMutation } from "@tanstack/react-query";
import { inventoryApi } from "@/api/internal/inventoryApi";
import type { InventoryItemCollection } from "@/models/inventoryItem";
import { useInventoryItems } from "./hooks/useInventoryItems";
import { useGenres, useWTypes } from "@/hooks/queries";

export default function InventoryItems() {
    const [question, setQuestion] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
    const [aiItems, setAiItems] = useState<InventoryItemCollection | null>(null);

    const { data: items = { data: [] } } = useInventoryItems();

    // const { data: genres = [] } = useGenres();

    // const { data: warehouses = [] } = useWTypes();

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
