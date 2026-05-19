"use client"

import { useRef, useState } from "react"
import { AlertTriangleIcon, Image as ImageIcon, UploadIcon } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import rezeImage from "./reze.jpeg"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

function ImageSlot({ file }: { file?: File }) {
  const previewUrl = file ? URL.createObjectURL(file) : null

  return (
    <Card className="relative h-16 w-16 overflow-hidden p-0">
      {previewUrl ? (
        <Image
          src={previewUrl}
          alt={file?.name ?? "uploaded image"}
          fill
          sizes="64px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-card">
          <ImageIcon className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
    </Card>
  )
}

export function ImageDemo() {
  return (
    <Card className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden p-0">
      <div className="absolute inset-0 z-10 bg-black/35" />
      <Image
        loading="eager"
        src={rezeImage}
        alt="-Summer's End-"
        fill
        sizes="(max-width: 640px) 100vw, 384px"
        className="relative z-0 object-cover"
      />
    </Card>
  )
}

export function Image1({ file }: { file?: File }) {
  return <ImageSlot file={file} />
}

export function Image2({ file }: { file?: File }) {
  return <ImageSlot file={file} />
}

export function EmptyDemo({
  selectedFiles,
  onFilesSelected,
}: {
  selectedFiles: File[]
  onFilesSelected: (files: File[]) => void
}) {
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

    onFilesSelected(Array.from(files))
    console.log("Files selected:", files)
  }

  return (
    <>
      {alertMessage && (
        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 2,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -40,
          }}
          className="fixed top-4 right-4 z-50"
        >
          <Alert variant="destructive">
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertTitle>Too many files</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <Empty className="relative mx-auto max-w-sm rounded-lg border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UploadIcon />
          </EmptyMedia>
          <EmptyTitle>No image uploaded</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t uploaded any images yet. Get started by uploading your first image.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center gap-2">
          <Button>What is this?</Button>
          <Button variant="outline" onClick={handleImportClick}>
            Import Image
          </Button>
          <Button variant="secondary" disabled={selectedFiles.length !== 2}>
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  return (
    <main className="space-y-6 p-6">
      <div className="relative mx-auto w-full max-w-sm">
        <ImageDemo />
        <HoverCard openDelay={10} closeDelay={100}>
          <HoverCardTrigger asChild>
            <div className="absolute top-0 -left-20">
              <Image1 file={selectedFiles[0]} />
            </div>
          </HoverCardTrigger>
          <HoverCardContent side="right" align="start">
            <p>Image 1</p>
          </HoverCardContent>
        </HoverCard>
        <HoverCard openDelay={10} closeDelay={100}>
          <HoverCardTrigger asChild>
            <div className="absolute top-20 -left-20">
              <Image2 file={selectedFiles[1]} />
            </div>
          </HoverCardTrigger>
          <HoverCardContent side="right" align="start">
            <p>Image 2</p>
          </HoverCardContent>
        </HoverCard>
      </div>
      <EmptyDemo selectedFiles={selectedFiles} onFilesSelected={setSelectedFiles} />
    </main>
  )
}
