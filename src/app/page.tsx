//import UploadBox from "@/components/uploadBox"
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
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UploadIcon />
        </EmptyMedia>
        <EmptyTitle>No image uploaded</EmptyTitle>
        <EmptyDescription>You haven&apos;t uploaded any images yet. Get started by uploading your first image.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button>What is this?</Button>
        <Button variant="outline">Import Image</Button>
      </EmptyContent>
    </Empty>
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
