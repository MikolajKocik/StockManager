import { suppliersApi } from "@/api/internal/suppliersApi";
import { Select, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Header } from "@/components/common";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";

export default function Suppliers() {
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const { data: suppliers = { data: [] }, isLoading, isError } = useQuery({
        queryKey: ['suppliers'],
        queryFn: suppliersApi.getAll
    });

    if (isLoading) return <div className="loading">Loading suppliers...</div>;
    if (isError) return <div className="error-message">Error loading suppliers.</div>;

    const countries = [...new Set(suppliers.data.map(s =>
        s.address?.country).filter(Boolean)
    )] as string[];
    const cities = [...new Set(suppliers.data.map(s =>
        s.address?.city).filter(Boolean)
    )] as string[];

    const filtered = suppliers.data.filter(s => {
        const byCountry = !selectedCountry || s.address?.country === selectedCountry;
        const byCity = !selectedCity || s.address?.city === selectedCity;
        return byCountry && byCity;
    })

    const tableRef = useRef<HTMLDivElement>(null);

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCountry(e.target.value);
        setSelectedCity('');
        tableRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div>
            <h2>Suppliers</h2>
        </div>
    )
}
