import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Select, Input, Button, Header } from "@/components/common";
import { useState } from "react"
import "./InventoryItems.css";
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
        <div className="inventory-container animate-fade">
            <Header
                title="Inventory Items"
                subtitle="Manage and browse your stock with AI-powered search"
            />

            <div className="search-panel">
                <div className="search-grid">
                    <div className="input-group full-width">
                        <Input
                            label="AI Query / Search"
                            type="text"
                            placeholder="e.g., 'What items are low in stock in Warehouse A?'"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <Select
                            label="Category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            options={["All Categories", ...genres]}
                        />
                    </div>

                    <div className="input-group">
                        <Select
                            label="Warehouse"
                            value={selectedWarehouse}
                            onChange={(e) => setSelectedWarehouse(e.target.value)}
                            options={["All Warehouses", ...warehouses]}
                        />
                    </div>

                    <div className="actions">
                        <Button
                            variant="ai"
                            onClick={handleAsk}
                            isLoading={isSearching}
                        >
                            <span className="sparkle">✨</span> Ask AI
                        </Button>
                    </div>
                </div>
            </div>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeaderCell>Name</TableHeaderCell>
                        <TableHeaderCell>Location code</TableHeaderCell>
                        <TableHeaderCell>Warehouse</TableHeaderCell>
                        <TableHeaderCell>Quantity Available</TableHeaderCell>
                        <TableHeaderCell>Quantity On Hand</TableHeaderCell>
                        <TableHeaderCell>Quantity Reserved</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {displayItems.data.map(item =>
                        <TableRow key={item.id}>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>{item.binLocationCode}</TableCell>
                            <TableCell>{item.warehouse}</TableCell>
                            <TableCell>{item.quantityAvailable}</TableCell>
                            <TableCell>{item.quantityOnHand}</TableCell>
                            <TableCell>{item.quantityReserved}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}