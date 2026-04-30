import { suppliersApi } from "@/api/suppliersApi";
import { Select } from "@/components/common/Select";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/common/Table";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";

export default function Suppliers() {
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const { data: suppliers } = useSuspenseQuery({
       queryKey: ['suppliers'],
       queryFn: suppliersApi.getAll 
    });

    const countries = [...new Set(suppliers.map(s =>
        s.address?.country).filter(Boolean)
    )] as string[];
    const cities = [...new Set(suppliers.map(s =>
        s.address?.city).filter(Boolean)
    )] as string[];

    const filtered = suppliers.filter(s => {
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
            <div className="filters">
                <Select 
                    label="Country"
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    options={[
                        { value: '', label: 'All Countries'},
                        ...countries.map(c => ({ value: c, label: c }))
                    ]}
                />

                <Select 
                    label="City"
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                    options={[
                        { value: '', label: 'All Cities'},
                        ...cities.map(c => ({ value: c, label: c }))
                    ]}
                />
            </div>

            <div ref={tableRef}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>
                                Supplier name
                            </TableHeaderCell>
                            <TableHeaderCell>
                                Unique identifier
                            </TableHeaderCell>
                            <TableHeaderCell>
                                City
                            </TableHeaderCell>
                            <TableHeaderCell>
                                Country
                            </TableHeaderCell>
                            <TableHeaderCell>
                                Postal code
                            </TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.map(s => 
                        <TableRow key={s.id}>
                            <TableCell>
                                {s.name}
                            </TableCell>
                            <TableCell>
                                {s.slug}
                            </TableCell>
                            <TableCell>
                                {s.address?.city}
                            </TableCell>
                            <TableCell>
                                {s.address?.country}
                            </TableCell>
                            <TableCell>
                                {s.address?.postalCode}
                            </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}