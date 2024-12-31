"use client";
import LibraryHomeScreen from "@/components/LibraryHomeScreen";
import { RecoilRoot } from 'recoil';
import DreamSymbolsProvider from "@/components/Providers/DreamSymbolsProvider";

export default function LibraryPage() {
    return (
        <RecoilRoot>
            <DreamSymbolsProvider>
                <div className="main-content">
                    <LibraryHomeScreen />
                </div>
            </DreamSymbolsProvider>
        </RecoilRoot>
    )
}