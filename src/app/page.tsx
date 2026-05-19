"use client"

import { useRef, useState } from "react"
import { AlertTriangleIcon, Files, UploadIcon } from "lucide-react"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle, EmptyMedia } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import rezeImage from "./reze.jpeg"
import { Alert,AlertDescription,AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"

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
  const [alertMessage, setAlertMessage] = useState<string | null>(null)

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    
    if (files.length > 2) {
      setAlertMessage("You can only upload up to 2 images at a time.")
      setTimeout(() => setAlertMessage(null), 3000)
      return
    }

    // Process files here - you can add state management as needed
    console.log("Files selected:", files)
  }

  return (
    <>
      {alertMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 2, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          className="fixed top-4 right-4 z-50"
        >
          <Alert variant="destructive">
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertTitle>Too many files</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        </motion.div>
      )}
      
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
          <Button variant="link" disabled={(files.length === 2)}>
            Create
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
