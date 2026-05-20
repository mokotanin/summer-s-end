const OUTPUT_WIDTH = 2560
const OUTPUT_HEIGHT = 2560
const SOURCE_WIDTH = 2560
const SOURCE_HEIGHT = 1280

const canvas = document.getElementById("glitchCanvas")
const ctx = canvas.getContext("2d")

const imageAInput = document.getElementById("imageAInput")
const imageBInput = document.getElementById("imageBInput")
const stripHeightInput = document.getElementById("stripHeight")
const stripLabel = document.getElementById("stripLabel")
const status = document.getElementById("status")
const mergeNowButton = document.getElementById("mergeNow")
const downloadButton = document.getElementById("download")

const preparedA = document.createElement("canvas")
preparedA.width = SOURCE_WIDTH
preparedA.height = SOURCE_HEIGHT
const preparedACtx = preparedA.getContext("2d")

const preparedB = document.createElement("canvas")
preparedB.width = SOURCE_WIDTH
preparedB.height = SOURCE_HEIGHT
const preparedBCtx = preparedB.getContext("2d")

let imageAReady = false
let imageBReady = false

function resetPreviewCanvas() {
  const previewSize = Math.min(window.innerWidth * 0.62, 760)
  const size = Math.max(320, Math.floor(previewSize))
  canvas.width = size
  canvas.height = size
  ctx.fillStyle = "#101822"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawCover(ctx2d, image, targetWidth, targetHeight) {
  const scale = Math.max(targetWidth / image.width, targetHeight / image.height)
  const drawWidth = image.width * scale
  const drawHeight = image.height * scale
  const dx = (targetWidth - drawWidth) / 2
  const dy = (targetHeight - drawHeight) / 2

  ctx2d.clearRect(0, 0, targetWidth, targetHeight)
  ctx2d.drawImage(image, dx, dy, drawWidth, drawHeight)
}

function loadImageFromFile(file, destinationCtx, setReady) {
  if (!file) {
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    const image = new Image()
    image.onload = () => {
      drawCover(destinationCtx, image, SOURCE_WIDTH, SOURCE_HEIGHT)
      setReady(true)
      updateStatus()
      if (imageAReady && imageBReady) {
        renderInterleavedPreview()
      }
    }
    image.src = reader.result
  }
  reader.readAsDataURL(file)
}

function updateStatus() {
  if (!imageAReady || !imageBReady) {
    status.textContent = "Waiting for two images..."
    return
  }

  status.textContent = "Ready. Merged output is 2560x2560."
}

function buildMergedOutput() {
  const outputCanvas = document.createElement("canvas")
  outputCanvas.width = OUTPUT_WIDTH
  outputCanvas.height = OUTPUT_HEIGHT
  const outputCtx = outputCanvas.getContext("2d")

  const stripHeight = Number(stripHeightInput.value)
  let outY = 0

  for (let sourceY = 0; sourceY < SOURCE_HEIGHT && outY < OUTPUT_HEIGHT; sourceY += stripHeight) {
    const h = Math.min(stripHeight, SOURCE_HEIGHT - sourceY, OUTPUT_HEIGHT - outY)
    outputCtx.drawImage(preparedA, 0, sourceY, SOURCE_WIDTH, h, 0, outY, OUTPUT_WIDTH, h)
    outY += h

    if (outY >= OUTPUT_HEIGHT) {
      break
    }

    outputCtx.drawImage(preparedB, 0, sourceY, SOURCE_WIDTH, h, 0, outY, OUTPUT_WIDTH, h)
    outY += h
  }

  return outputCanvas
}

function renderInterleavedPreview() {
  if (!imageAReady || !imageBReady) {
    return
  }

  const merged = buildMergedOutput()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(merged, 0, 0, canvas.width, canvas.height)
}

imageAInput.addEventListener("change", (event) => {
  imageAReady = false
  loadImageFromFile(event.target.files[0], preparedACtx, (value) => {
    imageAReady = value
  })
})

imageBInput.addEventListener("change", (event) => {
  imageBReady = false
  loadImageFromFile(event.target.files[0], preparedBCtx, (value) => {
    imageBReady = value
  })
})

stripHeightInput.addEventListener("input", () => {
  stripLabel.textContent = `Current strip height: ${stripHeightInput.value}px`
  renderInterleavedPreview()
})

mergeNowButton.addEventListener("click", () => {
  renderInterleavedPreview()
})

downloadButton.addEventListener("click", () => {
  if (!imageAReady || !imageBReady) {
    status.textContent = "Upload both images before downloading."
    return
  }

  const merged = buildMergedOutput()
  const link = document.createElement("a")
  link.href = merged.toDataURL("image/png")
  link.download = "strip-interleave-2560x2560.png"
  link.click()
})

window.addEventListener("resize", () => {
  resetPreviewCanvas()
  renderInterleavedPreview()
})

resetPreviewCanvas()
updateStatus()
