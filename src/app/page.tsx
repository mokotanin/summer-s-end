"use client"

import { useRef, useState } from "react"
import { UploadIcon } from "lucide-react"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle, EmptyMedia } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import rezeImage from "./reze.jpeg"

export function ImageDemo() {
  return (
    <Card className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden p-0">
      <div className="absolute inset-0 z-10 bg-black/35" />
      <Image loading="eager" src={rezeImage} alt="-Summer's End-" fill sizes="(max-width: 640px) 100vw, 384px" className="relative z-0 object-cover" />
    </Card>
  )
}

export function EmptyDemo() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    
    if (files.length > 2) {
      alert("2 images max")
      return
    }

    // Process files here - you can add state management as needed
    console.log("Files selected:", files)
  }

  return (
    <>
      <Empty className="relative mx-auto rounded-lg border max-w-sm">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UploadIcon />
          </EmptyMedia>
          <EmptyTitle>No image uploaded</EmptyTitle>
          <EmptyDescription>You haven&apos;t uploaded any images yet. Get started by uploading your first image.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center gap-2">
          <Button>
            What is this?
          </Button>
          <Button variant="outline" onClick={handleImportClick}>
            Import Image
          </Button>
        </EmptyContent>
      </Empty>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleFileChange}
      />
    </>
  )
}

export default function Page() {
  return (
    <main className="space-y-6 p-6">
      <ImageDemo />
      <EmptyDemo />
    </main>
  )
}
