"use client"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const Searchbar = () => {
    const [open, setOpen] = useState(false)
    const t = useTranslations("Header")
    
    return (
        <>
            <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
                onClick={() => setOpen(true)}
                aria-label={t("search")}
            >
                <Search />
            </Button>

            {open && (
                <>
                    <button
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                        aria-label="Close search"
                    />
                    <div className="absolute top-[calc(100%+12px)] inset-x-0 z-50">
                        <div className="mx-auto max-w-2xl rounded-3xl border bg-white shadow-lg backdrop-blur-md p-3">
                            <div className="relative">
                                <Search className="absolute inset-y-0 inset-s-3 my-auto h-4 w-4 text-muted-foreground" />
                                <Input
                                    autoFocus
                                    className="h-12 rounded-2xl ps-10"
                                    type="search"
                                    placeholder={t("search")}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    className="absolute inset-y-0 inset-e-2 my-auto rounded-full"
                                    onClick={() => setOpen(false)}
                                    aria-label="Close"
                                >
                                    <X />
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Searchbar