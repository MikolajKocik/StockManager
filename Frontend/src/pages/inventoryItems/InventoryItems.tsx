import api from "@/api/api";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/common/Table";
import type { InventoryItemCollection } from "@/models/inventoryItem";
import { useState, useEffect } from "react"

export default function InventoryItems() {
    const [items, setItems] = useState<InventoryItemCollection>({ data: [] });
    // const []

    useEffect(() => {
        const fetchItems = async () => {
            const response = await api.get("/inventory-items")
            setItems(response.data);
        }

        fetchItems();
    }, []);


    // const handleAsk = async (question: HTMLInputElement) => {
    //     try {
    //         const answer = api.post("/ai/ask");


    //     } catch (err) {
    //         console.error(`Something went wrong... \n ${err}`);
    //     }
    // }

    return (
        <>
            <div className="search-panel">
                <div className="search-item">
                    <input type="text" placeholder="search item" /*onChange={}*/ />
                </div>

                <div>
                    <label>Is available</label>
                    <input type="checkbox" />
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