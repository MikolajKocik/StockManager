import api from "@/api/api";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/common/Table";
import type { InventoryItemCollection } from "@/models/inventoryItem";
import { useState, useEffect } from "react"

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
        }
    }

    return (
        <>
            <div className="search-panel">
                <div className="search-item">
                    <label >Inventory Browser</label>
                    <input 
                        type="text" 
                        placeholder="Search item..." 
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)} 
                    />

                    <label>
                        Select category
                        <select 
                            value={selectedCategory} 
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">-- All --</option>
                            {genres.map(g => 
                                <option key={g} value={g}>{g}</option>
                            )}
                        </select>
                    </label>
                    
                    <label>
                        Select warehouse
                        <select 
                            value={selectedWarehouse} 
                            onChange={(e) => setSelectedWarehouse(e.target.value)}
                        >
                            <option value="">-- All --</option>
                            {warehouses.map(ws =>
                                <option key={ws} value={ws}>{ws}</option>
                            )}
                        </select>
                    </label>

                    <button onClick={handleAsk}>Ask AI</button>
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
        </>
    )
}