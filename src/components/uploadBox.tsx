"use client"

import { useState } from "react"
import Image from "next/image"

export default function UploadBox() {
  const [image, setImage] = useState<string | null>(null)

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setImage(url)
  }

  return (
    <div className="p-6">
      <input type="file" onChange={onChange} />

      {image && (
        <div className="mt-4">
          <Image
            src={image}
            alt="upload preview"
            width={400}
            height={400}
            className="rounded-xl object-cover"
          />
        </div>
      )}
    </div>
  )
}