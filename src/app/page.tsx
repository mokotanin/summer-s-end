"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AlertTriangleIcon, Image as ImageIcon, UploadIcon, Check } from "lucide-react"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"
//import { AppleSwitch } from "@/components/unlumen-ui/apple-switch"
import { Slider } from "@/components/ui/slider"

{/* static dimensions */ }
const OUTPUT_WIDTH = 2560
const OUTPUT_HEIGHT = 2560
const SOURCE_WIDTH = 2560
const SOURCE_HEIGHT = 1280

{/* memory management */ }
function useObjectUrl(file?: File) {
  const url = useMemo(() => {
    if (!file) {
      return null
    }

    return URL.createObjectURL(file)
  }, [file])

  useEffect(() => {
    if (!url) {
      return
    }

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [url])

  return url
}

{/* read image function */ }
async function readImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file)

  return new Promise((resolve, reject) => {
    const image = new window.Image()

    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error(`Failed to load image: ${file.name}`))
    }

    image.src = url
  })
}

{/* resize */ }
function drawCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
) {
  const scale = Math.max(targetWidth / image.width, targetHeight / image.height)
  const drawWidth = image.width * scale
  const drawHeight = image.height * scale
  const dx = (targetWidth - drawWidth) / 2
  const dy = (targetHeight - drawHeight) / 2

  ctx.clearRect(0, 0, targetWidth, targetHeight)
  ctx.drawImage(image, dx, dy, drawWidth, drawHeight)
}

{/* image merging function */ }
async function mergeInterleavedImages(
  imageAFile: File,
  imageBFile: File,
  stripHeight: number,
): Promise<Blob> {
  const [imageA, imageB] = await Promise.all([readImage(imageAFile), readImage(imageBFile)])

  const sourceA = document.createElement("canvas")
  sourceA.width = SOURCE_WIDTH
  sourceA.height = SOURCE_HEIGHT
  const sourceACtx = sourceA.getContext("2d")

  const sourceB = document.createElement("canvas")
  sourceB.width = SOURCE_WIDTH
  sourceB.height = SOURCE_HEIGHT
  const sourceBCtx = sourceB.getContext("2d")

  if (!sourceACtx || !sourceBCtx) {
    throw new Error("Could not initialize source canvas")
  }

  drawCover(sourceACtx, imageA, SOURCE_WIDTH, SOURCE_HEIGHT)
  drawCover(sourceBCtx, imageB, SOURCE_WIDTH, SOURCE_HEIGHT)

  const output = document.createElement("canvas")
  output.width = OUTPUT_WIDTH
  output.height = OUTPUT_HEIGHT
  const outputCtx = output.getContext("2d")

  if (!outputCtx) {
    throw new Error("Could not initialize output canvas")
  }

  let outY = 0
  for (let sourceY = 0; sourceY < SOURCE_HEIGHT && outY < OUTPUT_HEIGHT; sourceY += stripHeight) {
    const h = Math.min(stripHeight, SOURCE_HEIGHT - sourceY, OUTPUT_HEIGHT - outY)

    outputCtx.drawImage(sourceA, 0, sourceY, SOURCE_WIDTH, h, 0, outY, OUTPUT_WIDTH, h)
    outY += h

    if (outY >= OUTPUT_HEIGHT) {
      break
    }

    outputCtx.drawImage(sourceB, 0, sourceY, SOURCE_WIDTH, h, 0, outY, OUTPUT_WIDTH, h)
    outY += h
  }

  return new Promise((resolve, reject) => {
    output.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Could not export merged image"))
        return
      }

      resolve(blob)
    }, "image/png")
  })
}

{/* uploaded images preview */ }
function ImageSlot({ file }: { file?: File }) {
  const previewUrl = useObjectUrl(file)

  return (
    <Card className="relative h-16 w-16 overflow-hidden p-0">
      {previewUrl ? (
        <Image
          src={previewUrl}
          alt={file?.name ?? "uploaded image"}
          width={64}
          height={64}
          unoptimized
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-card">
          <ImageIcon className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
    </Card>
  )
}

{/* example image */ }
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

{/* image slots for displaying uploaded images */ }
export function Image1({ file }: { file?: File }) {
  return <ImageSlot file={file} />
}

export function Image2({ file }: { file?: File }) {
  return <ImageSlot file={file} />
}

{/* setting up the type */ }
export function EmptyDemo({
  selectedFiles,
  stripHeight,
  onStripHeightChange,
  onCreate,
  onDownload,
  canDownload,
  onFilesSelected,
  image1InputRef,
  image2InputRef,
}: {
  selectedFiles: File[]
  stripHeight: number
  onStripHeightChange: (value: number) => void
  onCreate: () => Promise<void>
  onDownload: () => void
  canDownload: boolean
  onFilesSelected: (files: File[]) => void
  image1InputRef?: React.RefObject<HTMLInputElement | null>
  image2InputRef?: React.RefObject<HTMLInputElement | null>
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const image1InternalRef = useRef<HTMLInputElement>(null)
  const image2InternalRef = useRef<HTMLInputElement>(null)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  {/* create system */ }
  const handleCreateClick = async () => {
    setIsLoading(true)
    try {
      await onCreate()
    } finally {
      setIsLoading(false)
    }
  }

  {/* import system (multi-file import MUST be exactly 2 files) */ }
  const handleImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    if (files.length !== 2) {
      setAlertMessage("Please select exactly 2 images when using Import.")
      setTimeout(() => setAlertMessage(null), 3000)
        // clear the input so the user can re-select the same files if needed
        ; (e.target as HTMLInputElement).value = ""
      return
    }

    onFilesSelected(Array.from(files))
      // clear input to allow re-selecting same files later
      ; (e.target as HTMLInputElement).value = ""
    console.log("Files selected via Import:", files)
  }

  // forward refs: attach parent refs directly to inputs via JSX `ref` prop

  const handleSingleFileChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    const next = selectedFiles.slice(0, 2)
    next[index] = f
    onFilesSelected(next)
  }

  return (
    <> {/* notification animation */}
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
            <AlertTitle>Too many files</AlertTitle> {/* notification title */}
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <Empty className="relative mx-auto w-full max-w-[17rem] rounded-lg border sm:max-w-sm">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            {selectedFiles.length === 0 ? <UploadIcon /> : <Check />}
          </EmptyMedia>
          <EmptyTitle>

            {/* dynamic instructions */}
            {selectedFiles.length === 0
              ? "No images uploaded"
              : `${selectedFiles.length} image${selectedFiles.length > 1 ? "s" : ""} selected`}
          </EmptyTitle>

          {/* regular description */}
          <EmptyDescription>
            {selectedFiles.length === 0
              ? "Upload 2 images to create the album cover Recommended size of each : 2560x1280"
              : ""}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="w-full space-y-2">
          <div className="flex flex-wrap justify-center gap-2">
            <Popover>
              <PopoverTrigger asChild>

                {/* what is button */}
                <Button>What is this?</Button>
              </PopoverTrigger>
              <PopoverContent>
                <p>
                  The only purpose of this site is to recreate the{" "}
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <span className="underline">-summer&apos;s end-</span>
                    </HoverCardTrigger>

                    {/* detailed hover content */}
                    <HoverCardContent side="top" className="w-fit">
                      <div className="text-sm">
                        CHAINSAW MAN THE MOVIE: REZE ARC original soundtrack -summer&apos;s end- by
                        kensuke ushio
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  &apos;s album cover.
                </p>
              </PopoverContent>
            </Popover>

            {/* import button */}
            <Button variant="outline" onClick={handleImportClick}>
              Import Image
            </Button>
            <Button
              variant="secondary"
              disabled={selectedFiles.length !== 2 || isLoading}
              onClick={handleCreateClick}
            >
              {isLoading ? <Spinner className="animate-spin" /> : null} {/* loading button & loading animation */}
              {selectedFiles.length === 2 ? "Create" : "Create"}
            </Button>
          </div>

          <div className="mx-auto flex w-full max-w-md flex-col gap-2">
            <div className="min-w-52 space-y-1 rounded-md border p-2">
              {/* slider */}
              <div className="relative">
                <p className="text-xs text-muted-foreground text-center">Strip Height: {stripHeight}px</p>
                <Button
                  variant="link"
                  size="xs"
                  className={`absolute right-2 top-0 p-0 h-auto ${stripHeight !== 22 ? "" : "hidden"}`}
                  aria-hidden={stripHeight === 22}
                  onClick={() => onStripHeightChange(22)}
                >
                  Reset
                </Button>
              </div> {/* slider */}
              <Slider
                value={[stripHeight]}
                onValueChange={(v) => onStripHeightChange(Array.isArray(v) ? v[0] : (v as number))}
                min={1}
                max={64}
                aria-label="Strip height"
              />
            </div>

            {/* download button */}
            <Button variant="default" disabled={!canDownload} onClick={onDownload}>
              Download PNG
            </Button>
          </div>
        </EmptyContent>
      </Empty>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleImportChange}
      />

      {/* per-slot hidden inputs (exposed via refs) */}
      <input
        ref={image1InputRef ?? image1InternalRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleSingleFileChange(0)}
      />
      <input
        ref={image2InputRef ?? image2InternalRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleSingleFileChange(1)}
      />
    </>
  )
}

export default function Page() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [enabled] = useState(true)
  const [stripHeight, setStripHeight] = useState(22)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const image1ImportRef = useRef<HTMLInputElement>(null)
  const image2ImportRef = useRef<HTMLInputElement>(null)

  const resultUrl = useMemo(() => {
    if (!resultBlob) {
      return null
    }

    return URL.createObjectURL(resultBlob)
  }, [resultBlob])

  useEffect(() => {
    if (!resultUrl) {
      return
    }

    return () => {
      URL.revokeObjectURL(resultUrl)
    }
  }, [resultUrl])

  const handleCreate = async () => {
    if (selectedFiles.length !== 2) {
      setErrorMessage("Please select exactly 2 images.")
      return
    }

    setErrorMessage(null)

    try {
      const merged = await mergeInterleavedImages(selectedFiles[0], selectedFiles[1], stripHeight)
      setResultBlob(merged)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to merge images")
    }
  }

  const handleDownload = () => {
    if (!resultBlob) {
      return
    }

    const url = URL.createObjectURL(resultBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "strip-interleave-2560x2560.png"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="h-screen overflow-hidden p-3 sm:p-4">
      <Card
        className="relative mx-auto -translate-y-1.5 aspect-square w-full max-w-[17rem] overflow-hidden p-0 sm:max-w-sm"
      >
        {enabled && resultUrl ? (
          <Image
            src={resultUrl}
            alt="Merged output preview"
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, 384px"
            className="object-cover"
          />
        ) : (
          <ImageDemo />
        )}
      </Card>
      <div className="relative mx-auto max-w-sm">
        <HoverCard openDelay={10} closeDelay={100}>
          <HoverCardTrigger asChild>
            <div
              className="absolute top-0 -left-20 cursor-pointer"
              onClick={() => image1ImportRef.current?.click()}
            >
              <Image1 file={selectedFiles[0]} />
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            side="left"
            sideOffset={5}
            align="start"
            className="flex w-fit flex-col"
          >
            <p>Image 1</p>
          </HoverCardContent>
        </HoverCard>
        <HoverCard openDelay={10} closeDelay={100}>
          <HoverCardTrigger asChild>
            <div
              className="absolute top-20 -left-20 cursor-pointer"
              onClick={() => image2ImportRef.current?.click()}
            >
              <Image2 file={selectedFiles[1]} />
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            side="left"
            sideOffset={5}
            align="start"
            className="flex w-fit flex-col"
          >
            <p>Image 2</p>
          </HoverCardContent>
        </HoverCard>
        <HoverCard openDelay={10} closeDelay={50}>
          <HoverCardTrigger asChild>
            {/*<AppleSwitch
              className="absolute top-40 -left-18"
              onCheckedChange={setEnabled}
              size="sm"
              defaultChecked={true}
              checked={enabled}
            />*/}
          </HoverCardTrigger>
          <HoverCardContent
            side="bottom"
            sideOffset={5}
            align="center"
            className="flex w-fit flex-col"
          >
            <p>Show merged preview</p>
          </HoverCardContent>
        </HoverCard>
      </div>
      {errorMessage ? (
        <Alert variant="destructive" className="mx-auto max-w-sm">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Merge failed</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}
      <EmptyDemo
        selectedFiles={selectedFiles}
        stripHeight={stripHeight}
        onStripHeightChange={setStripHeight}
        onCreate={handleCreate}
        onDownload={handleDownload}
        canDownload={Boolean(resultBlob)}
        onFilesSelected={setSelectedFiles}
        image1InputRef={image1ImportRef}
        image2InputRef={image2ImportRef}
      />
    </main>
  )
}
