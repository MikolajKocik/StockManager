import api from "@/api/api";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/common/Table";
import { Button } from "@/components/common/Button";
import type { InventoryItemCollection } from "@/models/inventoryItem";
import { useState, useEffect } from "react"
import "./InventoryItems.css";
import { Select } from "@/components/common/Select";
import { Input } from "@/components/common/Input";

interface SearchRequest {
    question: string,
    conversationId: string | null,
    categoryFilter: string | null,
    warehouseFilter: string | null;
}

export default function InventoryItems() {
    const [items, setItems] = useState<InventoryItemCollection>({ data: [] });
    const [warehouses, setWarehouses] = useState<string[]>([]);
    const [genres, setGenres] = useState<string[]>([]);
    const [question, setQuestion] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const fetchItems = async () => {
        try {
            const [invRes, wsRes, genRes] = await Promise.all([
                api.get<InventoryItemCollection>("/inventory-items"),
                api.get<string[]>("/products/warehouses"),
                api.get<string[]>("/products/genres")
            ]);

            setItems(invRes.data);
            setWarehouses(wsRes.data);
            setGenres(genRes.data);
        } catch (err) {
            console.error("Failed to fetch initial data", err);
        }
    };

    useEffect(() => {
        const fetchData = async () =>
            await fetchItems();

        fetchData();
    }, []);


    const handleAsk = async () => {
        if (!question.trim()) {
            await fetchItems();
            return;
        }

        setIsSearching(true);
        const requestPayload: SearchRequest = {
            question: question,
            conversationId: null,
            categoryFilter: selectedCategory || null,
            warehouseFilter: selectedWarehouse || null
        };

        try {
            const response = await api.post("/inventory-items/ai/search", requestPayload);

            setItems({ data: response.data.items || response.data.Items || [] });
        } catch (err) {
            console.error(`Something went wrong... \n ${err}`);
        } finally {
            setIsSearching(false);
        }
    }

    return (
        <div className="inventory-container animate-fade">
            <header className="page-header">
                <h1>Inventory Items</h1>
                <p>Manage and browse your stock with AI-powered search</p>
            </header>

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
                    {items.data.map(item =>
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