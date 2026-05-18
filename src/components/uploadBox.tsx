"use client"

import { useRef, useState } from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"

export default function UploadBox() {
  const inputRef = useRef<HTMLInputElement>(null)

  const [images, setImages] = useState<string[]>([])

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files

    if (!files) return

    if (files.length > 2) {
      alert("2 images max")
      return
    }

    const urls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    )

    setImages(urls)
  }

  return (
    <div className="p-10">
      <Button onClick={() => inputRef.current?.click()}>
        Upload images
      </Button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={onChange}
      />

      <div className="mt-6 flex gap-4">
        {images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt="uploaded image"
            width={300}
            height={300}
            className="rounded-xl object-cover"
          />
        ))}
      </div>
    </div>
  )
}