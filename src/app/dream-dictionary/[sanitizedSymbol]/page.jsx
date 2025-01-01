"use client";
import DreamSymbolForm from "@/components/DreamSymbolForm";
import { RecoilRoot } from 'recoil';
import DreamSymbolsProvider from "@/components/Providers/DreamSymbolsProvider";

export default function DreamSymbolPage() {
    return (
        <RecoilRoot>
            <DreamSymbolsProvider>
                <DreamSymbolForm />
            </DreamSymbolsProvider>
        </RecoilRoot>
    )
}